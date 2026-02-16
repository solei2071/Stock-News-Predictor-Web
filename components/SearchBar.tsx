"use client";

interface SearchBarProps {
  onSubmit: (query: string, horizon: number, period: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSubmit, loading }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const query = (form.get("query") as string) || "";
    const horizon = parseInt(form.get("horizon") as string) || 7;
    const period = (form.get("period") as string) || "6mo";
    if (query.trim()) onSubmit(query.trim(), horizon, period);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#101a33] rounded-xl p-5 mb-6">
      <h2 className="text-[#93c5fd] text-sm font-bold mb-4">Analysis settings</h2>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Symbol / Company</label>
          <input
            name="query"
            type="text"
            defaultValue="AAPL"
            className="bg-[#0f172a] text-slate-100 border border-slate-700 rounded-lg px-3 py-2 w-36 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Forecast horizon (trading days)</label>
          <input
            name="horizon"
            type="number"
            defaultValue={7}
            min={1}
            max={60}
            className="bg-[#0f172a] text-slate-100 border border-slate-700 rounded-lg px-3 py-2 w-20 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Price history</label>
          <select
            name="period"
            defaultValue="6mo"
            className="bg-[#0f172a] text-slate-100 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="1mo">1 month</option>
            <option value="3mo">3 months</option>
            <option value="6mo">6 months</option>
            <option value="1y">1 year</option>
            <option value="2y">2 years</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-2 text-sm transition-colors"
        >
          {loading ? "Analyzing..." : "Run prediction"}
        </button>
      </div>
    </form>
  );
}
