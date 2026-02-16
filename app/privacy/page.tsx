export const metadata = {
  title: "Privacy Policy | Market Pulse",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="muted-text text-sm mb-4">
        This policy explains how we handle your data when you use Market Pulse.
      </p>
      <section className="glass-card p-5 space-y-3">
        <h2 className="section-title">Information we collect</h2>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
          <li>Search input (ticker symbols or company names) to generate forecasts.</li>
          <li>Technical logs required for operating the service (IP, user-agent, timestamps).</li>
        </ul>

        <h2 className="section-title mt-6">Cookies and analytics</h2>
        <p className="text-sm text-slate-300">
          We may use cookies or third-party analytics scripts only where required for site security and performance.
        </p>

        <h2 className="section-title mt-6">Ad-related disclosure</h2>
        <p className="text-sm text-slate-300">
          Third-party ads may appear through Google AdSense and can use advertising identifiers for personalized ads where enabled.
        </p>

        <h2 className="section-title mt-6">Data retention</h2>
        <p className="text-sm text-slate-300">
          We do not store your input values beyond normal request processing unless required by local legal obligations.
        </p>
      </section>
    </main>
  );
}
