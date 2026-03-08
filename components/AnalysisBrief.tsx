interface AnalysisBriefProps {
  data: {
    symbol: string;
    name: string;
    horizon: number;
    finalPct: number;
    signal: string;
    confidence: number;
    sentimentLabel: string;
    sentiment: number;
    trendPct: number;
    newsCount: number;
    latestDate: string;
  };
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function AnalysisBrief({ data }: AnalysisBriefProps) {
  const confidenceLabel =
    data.confidence >= 70 ? "fairly stable" : data.confidence >= 45 ? "mixed" : "fragile";
  const newsLabel =
    data.newsCount > 0
      ? `${data.newsCount} recent headlines with a ${data.sentimentLabel.toLowerCase()} tone`
      : "no recent company headlines, so the result leans on price history";

  return (
    <section className="glass-card p-6 lg:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-title">Analysis brief</p>
          <h2 className="font-['Sora'] text-2xl font-semibold tracking-[-0.02em] text-slate-100">
            What the current {data.symbol} read actually means
          </h2>
        </div>
        <div className="rounded-full border border-slate-800/70 px-4 py-2 text-sm text-slate-300">
          Latest market date: {data.latestDate}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>
            The current run for {data.name} points to a {data.signal.toLowerCase()} setup over the next {data.horizon} trading
            days, with a combined return estimate of {formatPercent(data.finalPct)}. That output is built from a recent price
            trend of {formatPercent(data.trendPct)} and {newsLabel}.
          </p>
          <p>
            Confidence is {data.confidence.toFixed(0)}%, which we would describe as {confidenceLabel}. In practice, that means
            the model sees some directional evidence, but the result should still be checked against catalysts, earnings timing,
            liquidity, and the broader tape before it is treated as actionable.
          </p>
          <p>
            This page is designed to create context around the number. A forecast is most useful when it is read together with
            the source headlines, the price chart, and the width of the projected range.
          </p>
        </div>

        <aside className="rounded-2xl border border-slate-800/60 bg-slate-950/25 p-5">
          <p className="section-title">Manual checks</p>
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            <li>Compare the signal with the upcoming earnings or macro calendar.</li>
            <li>Read the linked headlines instead of relying on the sentiment score alone.</li>
            <li>Watch for outsized volatility when the forecast range is much wider than usual.</li>
            <li>Use position sizing and risk limits that match your own time horizon.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
