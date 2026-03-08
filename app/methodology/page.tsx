import type { Metadata } from "next";
import ContentPageShell from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How Market Pulse resolves symbols, scores sentiment, estimates trend, and calculates forecast ranges.",
};

export default function MethodologyPage() {
  return (
    <ContentPageShell
      eyebrow="Research process"
      title="Methodology and model notes"
      description="This page explains the actual workflow used by Market Pulse so readers can understand what each metric means, where the data comes from, and what the model does not claim to know."
    >
      <section className="glass-card p-6">
        <p className="section-title">Overview</p>
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>
            Market Pulse produces an educational stock read by combining three inputs: recent price history, recent
            company headlines, and observed volatility. The model is intentionally lightweight and explainable. It is
            designed to summarize context, not to emulate a full institutional forecasting stack.
          </p>
          <p>
            Each analysis is generated on demand from the current request. Results are not editorial stock picks and are
            not stored as a permanent recommendation archive.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card p-6">
          <p className="section-title">1. Symbol resolution</p>
          <p className="text-sm leading-7 text-slate-300">
            A user query is matched to a listed ticker using public market search data. The resolver prefers exact ticker
            matches when the input looks like a symbol and otherwise ranks likely equity or ETF matches by company name.
          </p>
        </article>
        <article className="glass-card p-6">
          <p className="section-title">2. Price trend estimate</p>
          <p className="text-sm leading-7 text-slate-300">
            The selected price history window is converted into closing-price series data. Market Pulse applies a
            log-linear trend estimate to those closes and extends that recent direction over the chosen forecast horizon.
          </p>
        </article>
        <article className="glass-card p-6">
          <p className="section-title">3. News sentiment</p>
          <p className="text-sm leading-7 text-slate-300">
            Recent company headlines are fetched and deduplicated. When an English financial language model is available,
            the site uses it to score tone. If that model is unavailable, or when Korean text is present, a keyword-based
            fallback is used instead.
          </p>
        </article>
        <article className="glass-card p-6">
          <p className="section-title">4. Combined signal</p>
          <p className="text-sm leading-7 text-slate-300">
            The trend estimate and sentiment adjustment are blended into a projected return. The result is clamped so one
            noisy input cannot create unrealistic extremes. A simple label such as Buy watch, Hold, or Caution is then
            assigned for readability.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card p-6">
          <p className="section-title">Confidence and range</p>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Confidence is a context score derived from three broad factors: how much price history is available, how
              many recent headlines were found, and how unstable the recent return series has been. It is not a
              probability of profit.
            </p>
            <p>
              The projected range expands with observed volatility and the requested forecast horizon. That means a wider
              band is expected when a stock has been moving sharply or when the reader asks for a longer horizon.
            </p>
          </div>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">Practical interpretation</p>
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            <li>A strong trend with weak sentiment often signals conflicting evidence.</li>
            <li>A narrow range with low confidence still deserves caution.</li>
            <li>No-news cases can be informative, but they rely more heavily on price action.</li>
            <li>The chart and linked articles should be reviewed before trusting the summary.</li>
          </ul>
        </article>
      </section>

      <section className="glass-card p-6">
        <p className="section-title">Known limitations</p>
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>
            This methodology does not incorporate valuation, options positioning, insider transactions, full earnings call
            transcripts, macro regime detection, or portfolio construction. It also depends on third-party market and news
            sources being available at request time.
          </p>
          <p>
            For those reasons, the site should be treated as a compact research layer rather than a complete trading
            system. The absence of a warning signal is not evidence that a stock is safe.
          </p>
        </div>
      </section>
    </ContentPageShell>
  );
}

