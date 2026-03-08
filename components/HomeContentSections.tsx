import Link from "next/link";

const focusAreas = [
  {
    title: "Price trend context",
    body:
      "The app fits a simple trend model on recent closing prices so visitors can see whether the latest move is supported by the selected history window.",
  },
  {
    title: "Headline sentiment",
    body:
      "Recent company headlines are scored to capture whether the current news flow is supportive, neutral, or negative before it is blended into the forecast.",
  },
  {
    title: "Risk-aware range",
    body:
      "Outputs are shown as a range instead of a single target so the page remains useful even when volatility expands or coverage is thin.",
  },
];

const workflow = [
  {
    step: "1",
    title: "Resolve the ticker",
    body:
      "A company name or ticker is matched to a supported listed symbol before any forecast is generated.",
  },
  {
    step: "2",
    title: "Measure recent direction",
    body:
      "Closing prices from the selected lookback window are transformed into a trend estimate over your chosen forecast horizon.",
  },
  {
    step: "3",
    title: "Read fresh headlines",
    body:
      "Recent news is pulled in, deduplicated, and scored so the model can adjust for a positive or negative information flow.",
  },
  {
    step: "4",
    title: "Publish the signal",
    body:
      "The page combines trend, sentiment, and volatility into an educational signal, a confidence score, and a projected range.",
  },
];

const interpretationNotes = [
  "A positive projected return means the recent trend and headline tone are aligned, not that the trade is guaranteed to work.",
  "Low confidence usually means the price history is noisy, recent news coverage is thin, or volatility is elevated.",
  "The forecast range matters more than the point estimate when you compare setups with very different risk profiles.",
];

const faqItems = [
  {
    question: "Is this an investment recommendation?",
    answer:
      "No. Market Pulse is an educational research aid. It is designed to help users inspect price action and headline context, not to tell them to buy or sell a security.",
  },
  {
    question: "How much of the site is original content?",
    answer:
      "The data is sourced from public market feeds, but the site structure, explanations, methodology notes, signal rules, and summary guidance are original publisher content.",
  },
  {
    question: "Why does the forecast sometimes disagree with the latest headline?",
    answer:
      "A single headline rarely outweighs the broader price trend and volatility regime. The combined output is intentionally conservative when the inputs conflict.",
  },
  {
    question: "What should I verify elsewhere?",
    answer:
      "You should still check filings, earnings dates, company guidance, valuation, liquidity, and broader market conditions before taking action.",
  },
];

export default function HomeContentSections() {
  return (
    <div className="space-y-6">
      <section className="glass-card p-6 lg:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="section-title">Why this site exists</p>
            <h2 className="font-['Sora'] text-2xl font-semibold tracking-[-0.02em] text-slate-100">
              A stock tool should explain itself, not just print a number.
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p>
              Market Pulse is built for readers who want a compact research workflow. Instead of sending users to a thin
              landing page with a search box and ads, the site explains what the model reads, how the signal is formed,
              and where the result can fail.
            </p>
            <p>
              Every analysis is generated on demand from price history, recent news coverage, and a volatility-based
              range. The goal is not to promise certainty. The goal is to make a fast market check more transparent.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {focusAreas.map((item) => (
          <article key={item.title} className="glass-card p-5">
            <p className="section-title">{item.title}</p>
            <p className="text-sm leading-7 text-slate-300">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="glass-card p-6 lg:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-title">Method overview</p>
            <h2 className="font-['Sora'] text-2xl font-semibold tracking-[-0.02em] text-slate-100">
              What happens after you submit a ticker
            </h2>
          </div>
          <Link
            href="/methodology"
            className="rounded-full border border-cyan-500/40 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/10 hover:text-white"
          >
            Read full methodology
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflow.map((item) => (
            <article key={item.step} className="rounded-2xl border border-slate-800/60 bg-slate-950/25 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{item.step}</p>
              <h3 className="mt-3 text-base font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card p-6">
          <p className="section-title">How to interpret the output</p>
          <h2 className="font-['Sora'] text-2xl font-semibold tracking-[-0.02em] text-slate-100">
            Treat the dashboard as a briefing, not a verdict.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            {interpretationNotes.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">FAQ</p>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-2xl border border-slate-800/60 bg-slate-950/25 p-4">
                <summary className="cursor-pointer list-none font-medium text-slate-100">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-slate-800/60 bg-slate-950/25 p-4 text-sm leading-7 text-slate-400">
            Need more detail on how the site handles sources, corrections, and attribution? Read the{" "}
            <Link href="/editorial-policy" className="text-cyan-200 transition hover:text-white">
              editorial policy
            </Link>{" "}
            and the{" "}
            <Link href="/about" className="text-cyan-200 transition hover:text-white">
              about page
            </Link>
            .
          </div>
        </article>
      </section>
    </div>
  );
}

