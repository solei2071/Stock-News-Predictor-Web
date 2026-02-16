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
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-10 space-y-6">
      <div className="hero-shell">
        <header className="hero-card p-6 lg:p-8">
          <p className="hero-kicker">Market Intelligence</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="hero-title">Market Pulse</h1>
              <p className="mt-2 max-w-2xl hero-copy">
                Stock signal dashboard with price forecasting and sentiment analysis across multiple data sources.
              </p>
            </div>
            <div
              className={`status-chip ${statusClass(status)} transition`}
              role="status"
            >
              {status}
            </div>
          </div>
        </header>
      </div>

      <SearchBar onSubmit={handleSubmit} loading={loading} />

      {error && <div className="alert-error">{error}</div>}

      <section>
        <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} className="ad-shell" />
      </section>

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

      <section>
        <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOT} className="ad-shell" />
      </section>
      <SiteFooter />
    </main>
  );
}
