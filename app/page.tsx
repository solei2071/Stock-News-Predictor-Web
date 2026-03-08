"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import MetricCards from "@/components/MetricCards";
import PriceChart from "@/components/PriceChart";
import NewsTable from "@/components/NewsTable";
import AdSenseUnit from "@/components/AdSenseUnit";
import HomeContentSections from "@/components/HomeContentSections";
import AnalysisBrief from "@/components/AnalysisBrief";

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

  const adSlot =
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOT;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:py-10">
      <div className="hero-shell">
        <header className="hero-card p-6 lg:p-8">
          <p className="hero-kicker">Market Intelligence</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="hero-title">Market Pulse</h1>
              <p className="mt-2 max-w-2xl hero-copy">
                Educational stock research that blends recent price direction, headline sentiment, and volatility-aware
                ranges into an explainable daily briefing.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/methodology"
                  className="rounded-full border border-cyan-500/40 px-4 py-2 text-cyan-200 transition hover:bg-cyan-500/10 hover:text-white"
                >
                  Review methodology
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Why this site exists
                </Link>
              </div>
            </div>
            <div className={`status-chip ${statusClass(status)} transition`} role="status">
              {status}
            </div>
          </div>
        </header>
      </div>

      <SearchBar onSubmit={handleSubmit} loading={loading} />

      {error && <div className="alert-error">{error}</div>}

      <HomeContentSections />

      <section className="space-y-4">
        <div className="glass-card p-6 lg:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-title">Live analysis workspace</p>
              <h2 className="font-['Sora'] text-2xl font-semibold tracking-[-0.02em] text-slate-100">
                Run a fresh read on a supported stock
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Each run generates a new dashboard from the selected price history, recent company headlines, and a
                volatility-derived forecast band. The analysis is meant to be read alongside the chart and linked news,
                not in isolation.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/25 px-4 py-3 text-sm text-slate-400">
              Try symbols like <span className="text-slate-200">AAPL</span>, <span className="text-slate-200">MSFT</span>,
              {" "}
              <span className="text-slate-200">TSLA</span>, or <span className="text-slate-200">NVDA</span>.
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : data ? (
          <>
            <MetricCards data={data} />
            <AnalysisBrief data={data} />
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
            <AdSenseUnit
              slot={adSlot}
              className="ad-shell"
              enabled={Boolean(data)}
              label="Advertisement"
            />
          </>
        ) : (
          <MetricCards data={data} />
        )}
      </section>
    </main>
  );
}
