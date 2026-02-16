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

export default function Home() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("대기 중");

  const handleSubmit = async (query: string, horizon: number, period: string) => {
    setLoading(true);
    setError(null);
    setStatus("수집 중...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, horizon, period }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "분석 실패");
      }

      setData(result);
      setStatus(`완료 (${result.symbol} / ${result.latestDate})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(msg);
      setStatus("실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-400">종목 뉴스 기반 가격 예측</h1>
        <span className="text-sm text-slate-400">현재 상태: {status}</span>
      </div>

      <SearchBar onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">
          {error}
        </div>
      )}

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

      <footer className="mt-8 text-xs text-slate-500">
        ※ 이 도구는 참고용 보조 지표이며 투자 조언이 아닙니다. 실제 매매 판단은 추가 확인 후 진행하세요.
      </footer>
    </main>
  );
}
