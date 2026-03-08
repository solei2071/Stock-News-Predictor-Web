"use client";

interface NewsItem {
  title: string;
  provider: string;
  published: string | null;
  summary: string;
  link: string;
  score: number;
}

function scoreClass(score: number) {
  if (score >= 0.18) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (score <= -0.18) return "bg-red-500/20 text-red-300 border-red-500/30";
  return "bg-slate-500/20 text-slate-200 border-slate-500/30";
}

function formatDate(d: string | null) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export default function NewsTable({ items }: { items: NewsItem[] }) {
  if (!items || items.length === 0) {
    return (
      <section className="glass-card section-card p-4">
        <div className="section-title">Latest news</div>
        <p className="text-sm leading-7 text-slate-400">
          No recent company headlines were returned for this symbol. In this case, the dashboard leans more heavily on
          price history and volatility than on news sentiment.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-card section-card p-4 h-full">
      <div className="section-title">Latest news</div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <article
            key={`${item.title}-${idx}`}
            className="rounded-lg border border-slate-700/40 bg-slate-950/20 p-3 hover:bg-slate-900/40 transition-colors cursor-pointer"
            onClick={() => item.link && window.open(item.link, "_blank")}
          >
            <div className="flex flex-wrap items-start gap-2 justify-between">
              <h3 className="text-sm text-slate-200 leading-snug flex-1 min-w-[220px]">{item.title}</h3>
              <span className={`px-2 py-0.5 text-[11px] border rounded-full ${scoreClass(item.score)} shrink-0`}>
                {item.score >= 0 ? "+" : ""}
                {item.score.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 news-summary">{item.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span>{item.provider}</span>
              <span>·</span>
              <span>{formatDate(item.published)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
