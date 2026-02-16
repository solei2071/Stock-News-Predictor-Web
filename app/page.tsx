"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MetricCards from "@/components/MetricCards";
import PriceChart from "@/components/PriceChart";
import NewsTable from "@/components/NewsTable";

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
    <>
      {/* MetricCards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#111a33] rounded-xl p-4">
            <Pulse className="h-3 w-16 mb-3" />
            <Pulse className="h-7 w-24 mb-2" />
            <Pulse className="h-3 w-20" />
          </div>
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="bg-[#101a33] rounded-xl p-4 mb-6">
        <Pulse className="h-4 w-48 mb-4" />
        <Pulse className="h-[380px] w-full" />
      </div>
      {/* News skeleton */}
      <div className="bg-[#101a33] rounded-xl p-4">
        <Pulse className="h-4 w-24 mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-8 w-full mb-2" />
        ))}
      </div>
    </>
  );
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
      setStatus(`Completed (${result.symbol} / ${result.latestDate})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStatus("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-400">News-based Stock Price Forecast</h1>
        <span className="text-sm text-slate-400">Current status: {status}</span>
      </div>

      <SearchBar onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <MetricCards data={data} />
          {data && (
            <>
              <PriceChart
                candles={data.candles}
                predicted={data.predicted}
                lower={data.lower}
                upper={data.upper}
                horizon={data.horizon}
                currency={data.currency}
              />
              <NewsTable items={data.newsItems} />
            </>
          )}
        </>
      )}

      <footer className="mt-8 text-xs text-slate-500">
        This tool is for reference only and is not financial advice. Verify signals with additional checks before making trading decisions.
      </footer>
    </main>
  );
}
