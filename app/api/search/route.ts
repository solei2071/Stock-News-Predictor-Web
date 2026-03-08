import { NextRequest, NextResponse } from "next/server";

const USER_AGENT = "Mozilla/5.0 (compatible; StockNewsPredictor/2.0)";
const FETCH_TIMEOUT = 8_000;
const CACHE_TTL = 60_000; // 1 minute
const MAX_CACHE_SIZE = 200;

const cache = new Map<string, { data: unknown; expiry: number }>();

function evictExpired() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiry) cache.delete(key);
  }
  // Hard cap: if still over limit, delete oldest entries
  if (cache.size > MAX_CACHE_SIZE) {
    const excess = cache.size - MAX_CACHE_SIZE;
    const keys = cache.keys();
    for (let i = 0; i < excess; i++) {
      const nextKey = keys.next().value;
      if (!nextKey) break;
      cache.delete(nextKey);
    }
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }
  const isTickerLike = /^[A-Z0-9]{1,6}(?:\.[A-Z]{1,2})?$/i.test(q);

  const cacheKey = q.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json(cached.data);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0&listsCount=0`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (!res.ok) return NextResponse.json([]);

    const data = await res.json();
    const quotes = data?.quotes;
    if (!Array.isArray(quotes)) return NextResponse.json([]);

    const results = quotes
      .filter((item: Record<string, unknown>) => {
        const type = String(item.quoteType || "").toUpperCase();
        return type === "EQUITY" || type === "ETF";
      })
      .slice(0, 6)
      .map((item: Record<string, unknown>) => ({
        symbol: item.symbol,
        name: item.shortname || item.shortName || item.longname || item.longName || item.symbol,
        exchange: item.exchDisp || item.exchange || "",
        type: item.quoteType,
      }));
    const symbol = q.toUpperCase();

    if (
      isTickerLike &&
      !results.some((item) => String(item.symbol).toUpperCase() === symbol)
    ) {
      results.unshift({
        symbol,
        name: q,
        exchange: "",
        type: "EQUITY",
      });
    }

    // Cache the result
    evictExpired();
    cache.set(cacheKey, { data: results, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
