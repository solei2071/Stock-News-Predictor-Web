"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MetricCards from "@/components/MetricCards";
import PriceChart from "@/components/PriceChart";
import NewsTable from "@/components/NewsTable";
import AdSenseUnit from "@/components/AdSenseUnit";
import SiteFooter from "@/components/SiteFooter";

interface AnalysisData {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  currentPrice: number;
  latestDate: string;
  candles: { date: string; open: number; high: number; low: number; close: number }[];
  horizon: number;
  trendPct: number;
  sentiment: number;
  sentimentLabel: string;
  finalPct: number;
  predicted: number;
  lower: number;
  upper: number;
  signal: string;
  confidence: number;
  newsCount: number;
  newsItems: {
    title: string;
    provider: string;
    published: string | null;
    summary: string;
    link: string;
    score: number;
  }[];
}

function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-700/50 ${className || ""}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <Pulse className="h-3 w-16 mb-3" />
            <Pulse className="h-7 w-24 mb-2" />
            <Pulse className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="glass-card p-4">
        <Pulse className="h-4 w-48 mb-4" />
        <Pulse className="h-[430px] w-full" />
      </div>
      <div className="glass-card p-4">
        <Pulse className="h-4 w-24 mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-8 w-full mb-2" />
        ))}
      </div>
    </div>
  );
}

function statusClass(status: string) {
  if (status.startsWith("Completed")) return "text-emerald-300 bg-emerald-500/15 border-emerald-500/30";
  if (status === "Failed") return "text-rose-300 bg-rose-500/15 border-rose-500/30";
  if (status === "Collecting...") return "text-cyan-200 bg-cyan-500/15 border-cyan-500/30";
  return "text-slate-300 bg-slate-700/20 border-slate-600/40";
}

export default function Home() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");

  const handleSubmit = async (query: string, horizon: number, period: string) => {
    setLoading(true);
    setError(null);
    setStatus("Collecting...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, horizon, period }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setData(result);
      setStatus(`Completed (${result.symbol} · ${result.latestDate})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStatus("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <header className="glass-card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Market Intelligence</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Market Pulse</h1>
            <p className="text-sm muted-text mt-2">
              Stock signal dashboard powered by finance data and sentiment analysis.
            </p>
          </div>
          <div
            className={`text-xs border rounded-full px-3 py-1 ${statusClass(status)} transition`}
            role="status"
          >
            {status}
          </div>
        </div>
      </header>

      <SearchBar onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="bg-rose-900/30 border border-rose-700/60 rounded-xl p-4 text-rose-200 text-sm">
          {error}
        </div>
      )}

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <MetricCards data={data} />
          {data && (
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <PriceChart
                candles={data.candles}
                predicted={data.predicted}
                lower={data.lower}
                upper={data.upper}
                horizon={data.horizon}
                currency={data.currency}
              />
              <NewsTable items={data.newsItems} />
            </div>
          )}
        </>
      )}

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOT} />
      <SiteFooter />
    </main>
  );
}
