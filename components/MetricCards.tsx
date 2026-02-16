"use client";

interface AnalysisResult {
  currency: string;
  currentPrice: number;
  name: string;
  exchange: string;
  trendPct: number;
  horizon: number;
  sentiment: number;
  sentimentLabel: string;
  newsCount: number;
  finalPct: number;
  signal: string;
  confidence: number;
  predicted: number;
  lower: number;
  upper: number;
}

function formatCurrency(value: number, currency: string): string {
  if (currency === "USD") return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function Card({ title, value, sub, valueColor }: { title: string; value: string; sub: string; valueColor?: string }) {
  return (
    <div className="bg-[#111a33] rounded-xl p-4 min-w-0">
      <p className="text-xs font-bold text-slate-400 mb-2">{title}</p>
      <p className={`text-2xl font-bold truncate ${valueColor || "text-slate-100"}`}>{value}</p>
      <p className="text-xs text-slate-300 mt-1 truncate">{sub}</p>
    </div>
  );
}

export default function MetricCards({ data }: { data: AnalysisResult | null }) {
  if (!data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {["현재가", "가격 추세", "뉴스 감성", "예측 수익률", "신뢰도", "예측 구간"].map((t) => (
          <Card key={t} title={t} value="-" sub="-" />
        ))}
      </div>
    );
  }

  const pctColor = (v: number) => (v >= 0 ? "text-emerald-400" : "text-red-400");

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <Card
        title="현재가"
        value={formatCurrency(data.currentPrice, data.currency)}
        sub={`${data.name} / ${data.exchange}`}
      />
      <Card
        title="가격 추세"
        value={`${data.trendPct >= 0 ? "+" : ""}${data.trendPct.toFixed(2)}%`}
        sub={`최근 추세 (기반: ${data.horizon}일)`}
        valueColor={pctColor(data.trendPct)}
      />
      <Card
        title="뉴스 감성"
        value={`${data.sentiment >= 0 ? "+" : ""}${data.sentiment.toFixed(2)}`}
        sub={`${data.sentimentLabel} · 뉴스 ${data.newsCount}건`}
        valueColor={pctColor(data.sentiment)}
      />
      <Card
        title="예측 수익률"
        value={`${data.finalPct >= 0 ? "+" : ""}${data.finalPct.toFixed(2)}%`}
        sub={`신호: ${data.signal}`}
        valueColor={pctColor(data.finalPct)}
      />
      <Card
        title="신뢰도"
        value={`${data.confidence.toFixed(0)}%`}
        sub={data.newsCount > 0 ? "데이터 + 뉴스 반영" : "과거 데이터만 사용"}
      />
      <Card
        title="예측 구간"
        value={formatCurrency(data.predicted, data.currency)}
        sub={`${formatCurrency(data.lower, data.currency)} ~ ${formatCurrency(data.upper, data.currency)}`}
      />
    </div>
  );
}
