import { NextRequest, NextResponse } from "next/server";
import { resolveSymbol, fetchPriceData, fetchNews } from "@/lib/yahoo";
import { sentimentScore, NewsItem } from "@/lib/sentiment";
import { clamp, linearForecast, volatility } from "@/lib/forecast";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || "").trim();
    const horizonRaw = Number(body.horizon);
    const period = body.period;
    const allowedPeriods = ["1mo", "3mo", "6mo", "1y", "2y"];

    if (!query) {
      return NextResponse.json({ error: "종목명/티커를 입력해주세요." }, { status: 400 });
    }
    if (!Number.isInteger(horizonRaw) || horizonRaw < 1 || horizonRaw > 60) {
      return NextResponse.json({ error: "예측 영업일은 1~60 사이 정수여야 합니다." }, { status: 400 });
    }
    if (!allowedPeriods.includes(period)) {
      return NextResponse.json({ error: "조회 기간은 1mo, 3mo, 6mo, 1y, 2y만 허용됩니다." }, { status: 400 });
    }

    const horizon = horizonRaw;

    let symbol: string;
    try {
      symbol = await resolveSymbol(query);
    } catch (err) {
      const message = err instanceof Error ? err.message : "종목을 찾을 수 없습니다.";
      return NextResponse.json({ error: message }, { status: 404 });
    }

    let priceData;
    try {
      priceData = await fetchPriceData(symbol, period);
    } catch (err) {
      const message = err instanceof Error ? err.message : "가격 데이터 조회 실패";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    if (!priceData.rows || priceData.rows.length === 0) {
      return NextResponse.json({ error: "가격 데이터가 존재하지 않습니다." }, { status: 422 });
    }
    const { rows } = priceData;

    const prices = rows.map((r) => r.close);
    const currentPrice = prices[prices.length - 1];

    const rawNews = await fetchNews(symbol, 10);
    const newsItems: NewsItem[] = rawNews.map((n) => ({
      title: n.title,
      summary: n.summary,
      provider: n.publisher,
      published: n.publishedAt,
      link: n.link,
    }));

    const { overall: sentiment, perItem } = await sentimentScore(newsItems);

    const hasNews = newsItems.length > 0;
    let sentimentLabel = "중립(뉴스 없음)";
    if (hasNews) {
      if (sentiment > 0.12) sentimentLabel = "긍정";
      else if (sentiment < -0.12) sentimentLabel = "부정";
      else sentimentLabel = "중립";
    }

    const trendPct = linearForecast(prices, horizon);
    const sentimentAdj = sentiment * Math.min(Math.max(horizon, 1) / 7.0, 2.5) * 2.2;
    const finalPct = clamp(trendPct + sentimentAdj, -40, 40);

    const vol = volatility(prices);
    const band = clamp(vol * 100 * Math.sqrt(horizon), 1.5, 18);

    const predicted = currentPrice * (1 + finalPct / 100);
    const lower = currentPrice * (1 + (finalPct - band) / 100);
    const upper = currentPrice * (1 + (finalPct + band) / 100);

    const dataConf = clamp((prices.length / 120) * 100, 0, 100);
    const newsConf = clamp((newsItems.length / 20) * 100, 0, 100);
    const trendConf = clamp(72 - Math.abs(vol) * 140, 20, 75);
    const confidence = clamp(15 + 0.45 * dataConf + 0.35 * newsConf + 0.2 * trendConf, 10, 95);

    let signal = "보합";
    if (finalPct >= 1.2) signal = "매수 관망";
    else if (finalPct <= -1.2) signal = "주의";

    const scoreByTitle = Object.fromEntries(perItem.map((p) => [p.title, p.score]));
    const newsPreview = newsItems.slice(0, 8).map((item) => ({
      title: item.title,
      provider: item.provider || "unknown",
      published: item.published || null,
      summary: (item.summary || "").slice(0, 140),
      link: item.link || "",
      score: scoreByTitle[item.title || ""] || 0,
    }));

    const sliceLen = Math.max(30, horizon + 10);
    const slicedRows = rows.slice(-sliceLen);

    return NextResponse.json({
      symbol: priceData.symbol,
      name: priceData.name,
      exchange: priceData.exchange,
      currency: priceData.currency,
      currentPrice,
      latestDate: rows[rows.length - 1].date,
      candles: slicedRows.map((r) => ({
        date: r.date,
        open: r.open,
        high: r.high,
        low: r.low,
        close: r.close,
      })),
      horizon,
      trendPct,
      sentiment,
      sentimentLabel,
      finalPct,
      predicted,
      lower,
      upper,
      signal,
      confidence,
      newsCount: newsItems.length,
      newsItems: newsPreview,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
