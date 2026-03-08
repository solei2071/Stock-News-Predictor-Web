import type { Metadata } from "next";
import ContentPageShell from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How Market Pulse handles attribution, original content, corrections, and advertising boundaries.",
};

export default function EditorialPolicyPage() {
  return (
    <ContentPageShell
      eyebrow="Publishing standards"
      title="Editorial policy"
      description="Market Pulse publishes original explanatory content around market data. This page outlines how attribution, corrections, advertising, and content quality are handled."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card p-6">
          <p className="section-title">Original content standard</p>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              The site does not aim to bulk-publish generic market articles. Its original content includes methodology
              explanations, interpretation notes, policy pages, dashboard guidance, and the site structure that connects
              each forecast to source context.
            </p>
            <p>
              Market Pulse is built to avoid thin pages whose only purpose is to display ads around a search widget or a
              copied data feed.
            </p>
          </div>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">Source attribution</p>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Price and symbol data come from public market data providers. News items are displayed with their source
              names and outbound links so readers can inspect the original reporting directly.
            </p>
            <p>
              Summaries shown on the site are brief contextual aids, not substitutes for the full article or publisher
              page.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card p-6">
          <p className="section-title">Corrections and updates</p>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Market data and news inputs can change as upstream providers update their feeds. If a linked story changes,
              disappears, or is corrected by the original publisher, Market Pulse reflects that dependency rather than
              rewriting the source into a permanent article archive.
            </p>
            <p>
              When the site description, methodology, or policy wording changes in a material way, those changes are made
              directly in the site code so the public pages remain consistent with the live product.
            </p>
          </div>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">Advertising boundaries</p>
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            <li>Advertising should not appear on empty or under-construction screens.</li>
            <li>Ads should remain secondary to the published research content.</li>
            <li>Policy, legal, and trust pages exist to inform users, not to carry ad-heavy layouts.</li>
            <li>Any future monetization changes should preserve a content-first experience.</li>
          </ul>
        </article>
      </section>

      <section className="glass-card p-6">
        <p className="section-title">What the site does not publish</p>
        <ul className="space-y-3 text-sm leading-7 text-slate-300">
          <li>Anonymous guest posts or paid stock promotion disguised as analysis.</li>
          <li>Auto-generated filler pages built only to target search traffic.</li>
          <li>Promises of guaranteed returns, financial advice, or broker-like recommendations.</li>
          <li>Pages whose primary purpose is navigation, alerts, or ad delivery without substantive content.</li>
        </ul>
      </section>
    </ContentPageShell>
  );
}
