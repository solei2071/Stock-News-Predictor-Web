import { clamp } from "./forecast";

/* ── 기존 키워드 사전 (폴백용) ── */
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

/* ── 한국어 포함 여부 체크 ── */
function containsKorean(text: string): boolean {
  return /[가-힣]/.test(text);
}

/* ── 키워드 기반 감성 분석 (폴백) ── */
function keywordSentiment(text: string): number {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;
  let score = 0;
  for (const token of tokens) {
    score += POSITIVE[token] || 0;
    score -= NEGATIVE[token] || 0;
  }
  return clamp(score / tokens.length, -1, 1);
}

/* ── FinBERT (Hugging Face Inference API) ── */
interface HFLabel {
  label: string;
  score: number;
}

async function finbertScores(texts: string[]): Promise<number[] | null> {
  const token = process.env.HF_API_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/ProsusAI/finbert",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: texts, options: { wait_for_model: true } }),
      }
    );

    if (!res.ok) return null;

    const data: HFLabel[][] = await res.json();
    if (!Array.isArray(data)) return null;

    return data.map((labels) => {
      if (!Array.isArray(labels)) return 0;
      const pos = labels.find((l) => l.label === "positive")?.score ?? 0;
      const neg = labels.find((l) => l.label === "negative")?.score ?? 0;
      return clamp(pos - neg, -1, 1);
    });
  } catch {
    return null;
  }
}

/* ── 메인 감성 분석 함수 ── */
export async function sentimentScore(items: NewsItem[]): Promise<SentimentResult> {
  if (!items.length) return { overall: 0, perItem: [] };

  const texts = items.map((item) =>
    `${item.title || ""} ${item.summary || ""}`.trim()
  );

  // 영어 뉴스만 FinBERT 대상으로 분류
  const englishIndices: number[] = [];
  const englishTexts: string[] = [];
  for (let i = 0; i < texts.length; i++) {
    if (!containsKorean(texts[i])) {
      englishIndices.push(i);
      englishTexts.push(texts[i]);
    }
  }

  // FinBERT로 영어 뉴스 일괄 분석 시도
  const scores = new Array<number>(items.length).fill(0);
  let usedFinbert = false;

  if (englishTexts.length > 0) {
    const fbScores = await finbertScores(englishTexts);
    if (fbScores && fbScores.length === englishTexts.length) {
      usedFinbert = true;
      for (let j = 0; j < englishIndices.length; j++) {
        scores[englishIndices[j]] = fbScores[j];
      }
    }
  }

  // FinBERT 실패 시 또는 한국어 뉴스 → 키워드 폴백
  for (let i = 0; i < texts.length; i++) {
    const isEnglish = englishIndices.includes(i);
    if (isEnglish && usedFinbert) continue; // 이미 FinBERT로 처리됨
    scores[i] = keywordSentiment(texts[i]);
  }

  const perItem = items.map((item, i) => ({
    title: item.title || "",
    score: scores[i],
  }));

  const overall = clamp(
    scores.reduce((a, b) => a + b, 0) / scores.length,
    -1,
    1
  );

  return { overall, perItem };
}
