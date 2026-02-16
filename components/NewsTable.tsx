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
      <section className="glass-card p-4">
        <div className="section-title">Latest news</div>
        <p className="text-slate-500 text-sm">No news data.</p>
      </section>
    );
  }

  return (
    <section className="glass-card p-4">
      <div className="section-title">Latest news</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-2 px-2 font-semibold w-40">Time</th>
              <th className="text-left py-2 px-2 font-semibold w-28">Source</th>
              <th className="text-left py-2 px-2 font-semibold w-20">Sentiment</th>
              <th className="text-left py-2 px-2 font-semibold">Title</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={`${item.title}-${idx}`}
                className="border-b border-slate-800 hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => item.link && window.open(item.link, "_blank")}
              >
                <td className="py-2 px-2 text-slate-400 whitespace-nowrap text-xs">{formatDate(item.published)}</td>
                <td className="py-2 px-2 text-slate-400 truncate max-w-[120px] text-xs">{item.provider}</td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 text-[11px] border rounded-full ${scoreClass(item.score)}`}>
                    {item.score >= 0 ? "+" : ""}
                    {item.score.toFixed(2)}
                  </span>
                </td>
                <td className="py-2 px-2 text-slate-200 hover:text-cyan-300 transition-colors text-sm">
                  {item.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
