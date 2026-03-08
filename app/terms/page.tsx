import type { Metadata } from "next";
import ContentPageShell from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Market Pulse website and its educational stock research tools.",
};

export default function TermsPage() {
  return (
    <ContentPageShell
      eyebrow="Legal terms"
      title="Terms of Service"
      description="These terms govern access to Market Pulse and explain the limits of the service, the intended use of the content, and the responsibilities of site visitors."
    >
      <section className="glass-card p-6">
        <div className="space-y-5 text-sm leading-7 text-slate-300">
          <article>
            <h2 className="section-title">1. Service purpose</h2>
            <p>
              Market Pulse provides educational stock research tools and explanatory content. The site is not a broker,
              exchange, investment adviser, or fiduciary. Nothing on the site should be treated as personalized investment
              advice or a guarantee of future performance.
            </p>
          </article>

          <article>
            <h2 className="section-title">2. Source dependency</h2>
            <p>
              The service depends on external price, symbol, and news sources. Delays, inaccuracies, outages, or changes
              in those sources can affect the outputs displayed on the site.
            </p>
          </article>

          <article>
            <h2 className="section-title">3. No warranty</h2>
            <p>
              Market Pulse is provided on an as-is basis without warranties regarding accuracy, completeness,
              merchantability, fitness for a particular purpose, or uninterrupted availability.
            </p>
          </article>

          <article>
            <h2 className="section-title">4. Responsible use</h2>
            <p>
              You remain solely responsible for any financial or operational decision you make based on site content. You
              should perform independent due diligence and seek qualified professional advice where appropriate.
            </p>
          </article>

          <article>
            <h2 className="section-title">5. Prohibited conduct</h2>
            <p>
              You may not use the site to abuse rate limits, reverse engineer protected systems, interfere with service
              operations, or misrepresent Market Pulse content as regulated financial advice.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card p-6">
          <p className="section-title">Changes to the service</p>
          <p className="text-sm leading-7 text-slate-300">
            Features, layouts, methodology notes, and monetization settings may change over time as the site evolves or
            as compliance requirements change.
          </p>
        </article>
        <article className="glass-card p-6">
          <p className="section-title">Acceptance</p>
          <p className="text-sm leading-7 text-slate-300">
            By continuing to access the site, you accept these terms as they exist at the time of use. If you do not
            agree with them, you should discontinue use of the service.
          </p>
        </article>
      </section>
    </ContentPageShell>
  );
}
