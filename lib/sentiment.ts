import { clamp } from "./forecast";

const POSITIVE: Record<string, number> = {
  beat: 2, surge: 2, surged: 2, rally: 2, rallies: 2, growth: 2,
  record: 1, upgrade: 2, upside: 1, profit: 1, strong: 1,
  expansion: 1, improve: 1, improved: 1, success: 1, buy: 1,
  bullish: 2, innovation: 1,
  "혁신": 2, "성장": 2, "호재": 2, "상승": 2, "개선": 1, "흑자": 1,
};

const NEGATIVE: Record<string, number> = {
  miss: 2, missed: 2, drop: 2, dropped: 2, fall: 2, fell: 2,
  loss: 2, losses: 2, downgrade: 2, warning: 1, weak: 1,
  weakness: 1, risk: 1, lawsuit: 2, investigation: 1, recession: 2,
  decline: 2, downside: 1, bearish: 2,
  "부진": 2, "감소": 2, "적자": 2, "우려": 1,
};

function tokenize(text: string): string[] {
  return (text || "").toLowerCase().match(/[a-z가-힣]+/g) || [];
}

export interface NewsItem {
  title: string;
  summary?: string;
  provider?: string;
  published?: string | null;
  link?: string;
  score?: number;
}

export interface SentimentResult {
  overall: number;
  perItem: { title: string; score: number }[];
}

export function sentimentScore(items: NewsItem[]): SentimentResult {
  if (!items.length) return { overall: 0, perItem: [] };

  let total = 0;
  const perItem: { title: string; score: number }[] = [];

  for (const item of items) {
    const text = `${item.title || ""} ${item.summary || ""}`;
    const tokens = tokenize(text);
    let score = 0;
    if (tokens.length > 0) {
      for (const token of tokens) {
        score += POSITIVE[token] || 0;
        score -= NEGATIVE[token] || 0;
      }
      score = clamp(score / tokens.length, -1, 1);
    }
    total += score;
    perItem.push({ title: item.title || "", score });
  }

  return {
    overall: clamp(total / items.length, -1, 1),
    perItem,
  };
}
