export const metadata = {
  title: "Terms of Service | Market Pulse",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm muted-text mb-4">
        By using Market Pulse, you agree to the terms below.
      </p>
      <section className="glass-card p-5 space-y-4">
        <article>
          <h2 className="section-title">1. Service purpose</h2>
          <p className="text-sm text-slate-300">
            The site provides analytical data for education and reference only. Results are model outputs and not investment recommendations.
          </p>
        </article>
        <article>
          <h2 className="section-title">2. No guarantee</h2>
          <p className="text-sm text-slate-300">
            We do not guarantee forecasting accuracy, completeness, or uptime. Market conditions can change rapidly and materially.
          </p>
        </article>
        <article>
          <h2 className="section-title">3. Responsible use</h2>
          <p className="text-sm text-slate-300">
            You are responsible for your own financial decisions and may seek professional advice before trading.
          </p>
        </article>
      </section>
    </main>
  );
}
