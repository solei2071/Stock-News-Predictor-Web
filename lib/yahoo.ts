const USER_AGENT = "Mozilla/5.0 (compatible; StockNewsPredictor/2.0)";

export interface PriceRow {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
}

export interface PriceData {
  rows: PriceRow[];
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  currentPrice: number;
}

export async function resolveSymbol(query: string): Promise<string> {
  const q = query.trim();
  if (!q) throw new Error("종목명/티커를 입력해주세요.");

  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&listsCount=0`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Yahoo 검색 실패: ${res.status}`);
  const data = await res.json();

  const quotes = data?.quotes;
  if (!Array.isArray(quotes) || quotes.length === 0) {
    throw new Error(`'${q}'에 해당하는 종목을 찾지 못했습니다.`);
  }

  const isTickerLike = /^[A-Z]{1,6}$/.test(q.toUpperCase()) && !q.includes(" ");
  if (isTickerLike) {
    const exact = quotes.find(
      (item: Record<string, unknown>) =>
        typeof item.symbol === "string" && item.symbol.toUpperCase() === q.toUpperCase()
    );
    if (exact) return (exact.symbol as string).toUpperCase();
  }

  const target = q.toLowerCase().replace(/[^0-9a-z가-힣]+/g, " ").trim();

  let best: string | null = null;
  let bestScore = 0;

  for (const item of quotes) {
    if (!item.symbol) continue;
    const type = (item.quoteType || "EQUITY").toUpperCase();
    if (type !== "EQUITY" && type !== "ETF") continue;

    const names = [item.shortName, item.longName, item.name]
      .filter(Boolean)
      .map((n: string) => n.toLowerCase().replace(/[^0-9a-z가-힣]+/g, " ").trim());

    let score = 0;
    for (const name of names) {
      if (name.includes(target)) score = Math.max(score, 3);
      else if (target.split(" ").every((p: string) => name.includes(p))) score = Math.max(score, 2);
      else if (target.split(" ").some((p: string) => name.includes(p))) score = Math.max(score, 1);
    }

    if (score > bestScore) {
      bestScore = score;
      best = item.symbol;
    }
  }

  const symbol = best || quotes[0]?.symbol;
  if (!symbol) throw new Error(`'${q}'에 해당하는 종목을 찾지 못했습니다.`);
  return symbol.toUpperCase();
}

export async function fetchPriceData(
  symbol: string,
  period: string = "6mo"
): Promise<PriceData> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${encodeURIComponent(period)}&includeAdjustedClose=true`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`주가 데이터 가져오기 실패: ${res.status}`);
  const payload = await res.json();

  const results = payload?.chart?.result;
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("주가 데이터가 없습니다.");
  }

  const result = results[0];
  const timestamps: number[] = result.timestamp || [];
  const indicators = result.indicators?.quote?.[0];
  if (!indicators) throw new Error("가격 지표가 없습니다.");

  const closes: (number | null)[] = indicators.close || [];
  const opens: (number | null)[] = indicators.open || [];
  const highs: (number | null)[] = indicators.high || [];
  const lows: (number | null)[] = indicators.low || [];

  const rows: PriceRow[] = [];
  for (let i = 0; i < timestamps.length && i < closes.length; i++) {
    const close = closes[i];
    if (close == null) continue;
    const open = opens[i] ?? close;
    const high = highs[i] ?? close;
    const low = lows[i] ?? close;
    if (open == null || high == null || low == null) continue;

    const dt = new Date(timestamps[i] * 1000);
    rows.push({
      date: dt.toISOString().split("T")[0],
      close, open, high, low,
    });
  }

  if (rows.length === 0) throw new Error("유효한 가격 데이터가 없습니다.");

  const meta = result.meta || {};
  return {
    rows,
    symbol: meta.symbol || symbol,
    name: meta.longName || meta.shortName || symbol,
    currency: meta.currency || "USD",
    exchange: meta.exchangeName || "N/A",
    currentPrice: meta.regularMarketPrice ?? rows[rows.length - 1].close,
  };
}

export interface FinnhubNewsItem {
  title: string;
  link: string;
  publisher: string;
  publishedAt: string | null;
  summary: string;
}

export async function fetchNews(
  symbol: string,
  limit: number = 10
): Promise<FinnhubNewsItem[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return [];

  const today = new Date();
  const from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const toStr = today.toISOString().split("T")[0];
  const fromStr = from.toISOString().split("T")[0];

  const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(symbol)}&from=${fromStr}&to=${toStr}&token=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const seen = new Set<string>();
    const items: FinnhubNewsItem[] = [];

    for (const item of data) {
      const title = (item.headline || "").trim();
      if (!title) continue;

      const link = (item.url || "").trim();
      const key = link || title;
      if (seen.has(key)) continue;
      seen.add(key);

      items.push({
        title,
        link,
        publisher: (item.source || "unknown").trim(),
        publishedAt: item.datetime
          ? new Date(item.datetime * 1000).toISOString()
          : null,
        summary: (item.summary || "").trim(),
      });

      if (items.length >= limit) break;
    }

    items.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    });

    return items.slice(0, limit);
  } catch {
    return [];
  }
}
