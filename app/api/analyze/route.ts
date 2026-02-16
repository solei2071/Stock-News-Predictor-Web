import { NextRequest, NextResponse } from "next/server";
import { resolveSymbol, fetchPriceData, fetchNews } from "@/lib/yahoo";
import { sentimentScore, NewsItem } from "@/lib/sentiment";
import { clamp, linearForecast, volatility } from "@/lib/forecast";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;
const cache = new Map<string, { data: unknown; expiry: number }>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  // Evict expired entries and enforce size limit
  if (cache.size >= MAX_CACHE_SIZE) {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now > v.expiry) cache.delete(k);
    }
    // If still over limit, delete oldest entries
    while (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) cache.delete(firstKey);
      else break;
    }
  }
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || "").trim();
    const horizonRaw = Number(body.horizon);
    const period = body.period;
    const allowedPeriods = ["1mo", "3mo", "6mo", "1y", "2y"];

    if (!query) {
      return NextResponse.json({ error: "Please enter a ticker or company name." }, { status: 400 });
    }
    if (!Number.isInteger(horizonRaw) || horizonRaw < 1 || horizonRaw > 60) {
      return NextResponse.json({ error: "Forecast horizon must be an integer between 1 and 60." }, { status: 400 });
    }
    if (!allowedPeriods.includes(period)) {
      return NextResponse.json({ error: "Period must be one of 1mo, 3mo, 6mo, 1y, or 2y." }, { status: 400 });
    }

    const horizon = horizonRaw;

    let symbol: string;
    try {
      symbol = await resolveSymbol(query);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Symbol not found.";
      return NextResponse.json({ error: message }, { status: 404 });
    }

    const cacheKey = `${symbol}:${period}:${horizon}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    let priceData;
    try {
      priceData = await fetchPriceData(symbol, period);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch price data.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    if (!priceData.rows || priceData.rows.length === 0) {
      return NextResponse.json({ error: "No price data available." }, { status: 422 });
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
    let sentimentLabel = "Neutral (No news)";
    if (hasNews) {
      if (sentiment > 0.12) sentimentLabel = "Positive";
      else if (sentiment < -0.12) sentimentLabel = "Negative";
      else sentimentLabel = "Neutral";
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

    let signal = "Hold";
    if (finalPct >= 1.2) signal = "Buy watch";
    else if (finalPct <= -1.2) signal = "Caution";

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

    const result = {
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
    };

    setCache(cacheKey, result);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
