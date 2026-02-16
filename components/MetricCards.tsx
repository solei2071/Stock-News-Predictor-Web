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

function Card({
  title,
  value,
  sub,
  accent,
}: {
  title: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="glass-card p-4 min-w-0">
      <p className="text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase text-[11px]">{title}</p>
      <p className={`text-2xl font-bold truncate ${accent || "text-slate-100"}`}>{value}</p>
      <p className="text-xs text-slate-300 mt-1 truncate">{sub}</p>
    </div>
  );
}

export default function MetricCards({ data }: { data: AnalysisResult | null }) {
  if (!data) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {["Current Price", "Price Trend", "News Sentiment", "Projected Return", "Confidence", "Forecast Range"].map((t) => (
        <Card key={t} title={t} value="-" sub="-" />
      ))}
    </div>
  );
}

  const pctColor = (v: number) => (v >= 0 ? "text-emerald-400" : "text-red-400");
  const confidenceColor = data.confidence >= 70 ? "text-emerald-400" : data.confidence >= 45 ? "text-cyan-300" : "text-amber-300";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <Card
        title="Current Price"
        value={formatCurrency(data.currentPrice, data.currency)}
        sub={`${data.name} / ${data.exchange}`}
        accent="text-cyan-200"
      />
      <Card
        title="Price Trend"
        value={`${data.trendPct >= 0 ? "+" : ""}${data.trendPct.toFixed(2)}%`}
        sub={`Recent trend (based on ${data.horizon} days)`}
        accent={pctColor(data.trendPct)}
      />
      <Card
        title="News Sentiment"
        value={`${data.sentiment >= 0 ? "+" : ""}${data.sentiment.toFixed(2)}`}
        sub={`${data.sentimentLabel} · ${data.newsCount} news items`}
        accent={pctColor(data.sentiment)}
      />
      <Card
        title="Projected Return"
        value={`${data.finalPct >= 0 ? "+" : ""}${data.finalPct.toFixed(2)}%`}
        sub={`Signal: ${data.signal}`}
        accent={pctColor(data.finalPct)}
      />
      <Card
        title="Confidence"
        value={`${data.confidence.toFixed(0)}%`}
        sub={data.newsCount > 0 ? "Data + news included" : "Historical data only"}
        accent={confidenceColor}
      />
      <Card
        title="Forecast Range"
        value={formatCurrency(data.predicted, data.currency)}
        sub={`${formatCurrency(data.lower, data.currency)} ~ ${formatCurrency(data.upper, data.currency)}`}
        accent="text-indigo-300"
      />
    </div>
  );
}
