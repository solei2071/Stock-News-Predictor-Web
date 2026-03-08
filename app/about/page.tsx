import type { Metadata } from "next";
import Link from "next/link";
import ContentPageShell from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "About",
  description: "What Market Pulse publishes, who it is for, and how to use the site responsibly.",
};

export default function AboutPage() {
  return (
    <ContentPageShell
      eyebrow="About the publisher"
      title="Why Market Pulse was built"
      description="Market Pulse exists to make short-form stock research more explainable. The site focuses on transparent inputs, clear limitations, and original guidance around each output."
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card p-6">
          <p className="section-title">Mission</p>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Many market tools are either too shallow to be useful or too opaque to trust. Market Pulse aims to sit in
              the middle. It gives readers a compact view of recent price direction, a fresh read on headline tone, and a
              volatility-aware range without pretending the market is easy to predict.
            </p>
            <p>
              The site is intentionally educational. It does not execute trades, accept user-generated stock tips, or
              publish anonymous filler articles. Each page is designed to help a reader ask better questions before they
              make a decision elsewhere.
            </p>
          </div>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">Who it is for</p>
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            <li>Investors who want a quick first-pass view before deeper due diligence.</li>
            <li>Readers comparing how trend, news, and risk interact for the same ticker.</li>
            <li>Users who prefer clear methodology and limitations over black-box promises.</li>
          </ul>
        </article>
      </section>

      <section className="glass-card p-6">
        <p className="section-title">What makes the site different</p>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800/60 bg-slate-950/25 p-5">
            <h2 className="text-base font-semibold text-slate-100">Explainable workflow</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Readers can inspect the price chart, the linked headlines, the confidence score, and the forecast range in
              one place instead of receiving a bare output with no context.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800/60 bg-slate-950/25 p-5">
            <h2 className="text-base font-semibold text-slate-100">Original guidance</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              The educational copy, interpretation notes, methodology pages, and editorial standards are written for this
              site rather than syndicated from another source.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800/60 bg-slate-950/25 p-5">
            <h2 className="text-base font-semibold text-slate-100">Conservative framing</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Market Pulse presents ranges and limitations because a single point target can hide uncertainty and create a
              false sense of precision.
            </p>
          </article>
        </div>
      </section>

      <section className="glass-card p-6">
        <p className="section-title">Responsible use</p>
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>
            Market Pulse is not a broker, investment adviser, or research desk. The service is meant to support learning
            and idea triage. It should not replace earnings transcripts, regulatory filings, valuation work, or position
            sizing discipline.
          </p>
          <p>
            Readers who want to understand how the analysis is assembled should review the{" "}
            <Link href="/methodology" className="text-cyan-200 transition hover:text-white">
              methodology page
            </Link>
            . Readers who want to understand publishing standards, attribution, and corrections should review the{" "}
            <Link href="/editorial-policy" className="text-cyan-200 transition hover:text-white">
              editorial policy
            </Link>
            .
          </p>
        </div>
      </section>
    </ContentPageShell>
  );
}

