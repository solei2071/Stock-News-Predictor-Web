import type { Metadata } from "next";
import ContentPageShell from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Market Pulse handles search queries, technical logs, cookies, and ad-related disclosures.",
};

export default function PrivacyPage() {
  return (
    <ContentPageShell
      eyebrow="Legal and data handling"
      title="Privacy Policy"
      description="This policy explains what limited information Market Pulse handles when you use the site and how that information is used to operate the service."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card p-6">
          <p className="section-title">Information processed</p>
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            <li>Search inputs such as ticker symbols or company names submitted to generate an analysis.</li>
            <li>Basic request metadata, including IP address, browser details, and timestamps, used for security and uptime.</li>
            <li>Temporary caching needed to improve responsiveness and reduce duplicate upstream requests.</li>
          </ul>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">How the information is used</p>
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            <li>To resolve a query to a supported market symbol and fetch the corresponding data.</li>
            <li>To monitor service reliability, rate limits, and abuse prevention.</li>
            <li>To improve page performance and reduce repeated requests to third-party data providers.</li>
          </ul>
        </article>
      </section>

      <section className="glass-card p-6">
        <p className="section-title">Cookies, analytics, and advertising</p>
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>
            Market Pulse may use essential cookies or similar technologies needed for security, delivery, and performance.
            If analytics or advertising products are enabled in the future, they may set additional identifiers according
            to their own policies and applicable consent requirements.
          </p>
          <p>
            When advertising is enabled, third-party providers such as Google may use cookies or similar technologies to
            personalize or measure ads. Those providers operate under their own privacy policies, and users should review
            them directly for current details.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card p-6">
          <p className="section-title">Third-party sources</p>
          <p className="text-sm leading-7 text-slate-300">
            The site depends on external market data and news providers. Queries submitted through Market Pulse may cause
            requests to be made to those providers in order to return a result. Their availability and data practices are
            outside the direct control of this site.
          </p>
        </article>

        <article className="glass-card p-6">
          <p className="section-title">Retention</p>
          <p className="text-sm leading-7 text-slate-300">
            Market Pulse is designed to minimize long-term retention. Query handling and caching are limited to normal
            service operation unless longer retention is required for legal, security, or abuse-prevention reasons.
          </p>
        </article>
      </section>
    </ContentPageShell>
  );
}
