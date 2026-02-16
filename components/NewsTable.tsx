"use client";

interface NewsItem {
  title: string;
  provider: string;
  published: string | null;
  summary: string;
  link: string;
  score: number;
}

export default function NewsTable({ items }: { items: NewsItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#101a33] rounded-xl p-6">
        <h2 className="text-[#93c5fd] text-sm font-bold mb-3">Latest news</h2>
        <p className="text-slate-500 text-sm">No news data.</p>
      </div>
    );
  }

  const scoreColor = (s: number) => {
    if (s >= 0.18) return "text-emerald-400";
    if (s <= -0.18) return "text-red-400";
    return "text-slate-300";
  };

  const formatDate = (d: string | null) => {
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
  };

  return (
    <div className="bg-[#101a33] rounded-xl p-4">
      <h2 className="text-[#93c5fd] text-sm font-bold mb-3">Latest news</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-2 px-2 font-semibold w-40">Time</th>
              <th className="text-left py-2 px-2 font-semibold w-24">Source</th>
              <th className="text-center py-2 px-2 font-semibold w-16">Sentiment</th>
              <th className="text-left py-2 px-2 font-semibold">Title</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-800 hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => item.link && window.open(item.link, "_blank")}
              >
                <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{formatDate(item.published)}</td>
                <td className="py-2 px-2 text-slate-400 truncate max-w-[120px]">{item.provider}</td>
                <td className={`py-2 px-2 text-center font-mono ${scoreColor(item.score)}`}>
                  {item.score >= 0 ? "+" : ""}{item.score.toFixed(2)}
                </td>
                <td className="py-2 px-2 text-slate-200 hover:text-blue-300 transition-colors">
                  {item.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
