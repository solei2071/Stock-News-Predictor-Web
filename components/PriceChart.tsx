"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
} from "recharts";

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PriceChartProps {
  candles: Candle[];
  predicted: number;
  lower: number;
  upper: number;
  horizon: number;
  currency: string;
}

interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  bodyBottom: number;
  bodyHeight: number;
  wickRange: [number, number];
  color: string;
  predicted?: number;
  isForecast?: boolean;
}

export default function PriceChart({ candles, predicted, lower, upper, horizon, currency }: PriceChartProps) {
  if (!candles || candles.length < 2) {
    return (
      <div className="bg-[#101a33] rounded-xl p-6 mb-6 h-[400px] flex items-center justify-center text-slate-500">
        차트 데이터가 없습니다
      </div>
    );
  }

  const chartData: ChartDataPoint[] = candles.map((c) => {
    const isUp = c.close >= c.open;
    return {
      date: c.date,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      bodyBottom: Math.min(c.open, c.close),
      bodyHeight: Math.abs(c.close - c.open) || 0.01,
      wickRange: [c.low, c.high] as [number, number],
      color: isUp ? "#22c55e" : "#ef4444",
    };
  });

  const lastCandle = candles[candles.length - 1];
  chartData.push({
    date: `예측(${horizon}일)`,
    open: lastCandle.close,
    high: upper,
    low: lower,
    close: predicted,
    bodyBottom: Math.min(lastCandle.close, predicted),
    bodyHeight: Math.abs(predicted - lastCandle.close) || 0.01,
    wickRange: [lower, upper],
    color: predicted >= lastCandle.close ? "#22c55e" : "#ef4444",
    predicted,
    isForecast: true,
  });

  const allValues = candles.flatMap((c) => [c.high, c.low]).concat([upper, lower]);
  const minY = Math.min(...allValues) * 0.995;
  const maxY = Math.max(...allValues) * 1.005;

  const unit = currency === "USD" ? "$" : "";

  return (
    <div className="bg-[#101a33] rounded-xl p-4 mb-6">
      <h2 className="text-[#93c5fd] text-sm font-bold mb-3">
        가격 트렌드 · 최근 {candles.length}거래일 + 예측 {horizon}영업일
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickFormatter={(v: string) => {
              if (v.startsWith("예측")) return v;
              const parts = v.split("-");
              return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : v;
            }}
            interval={Math.max(0, Math.floor(chartData.length / 6))}
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickFormatter={(v: number) => `${unit}${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any, name: any) => {
              if (value == null) return ["-", name ?? ""];
              const labels: Record<string, string> = {
                close: "종가",
                open: "시가",
                high: "고가",
                low: "저가",
                predicted: "예측가",
              };
              const n = String(name ?? "");
              return [`${unit}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, labels[n] || n];
            }) as never}
          />

          <Bar dataKey="bodyBottom" stackId="candle" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="bodyHeight" stackId="candle" isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isForecast ? "#3b82f6" : entry.color}
                fillOpacity={entry.isForecast ? 0.6 : 1}
                stroke={entry.isForecast ? "#60a5fa" : entry.color}
                strokeDasharray={entry.isForecast ? "4 2" : undefined}
              />
            ))}
          </Bar>

          <Line
            type="monotone"
            dataKey="close"
            stroke="#7dd3fc"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />

          {predicted && (
            <ReferenceLine
              y={predicted}
              stroke="#3b82f6"
              strokeDasharray="6 3"
              label={{
                value: `예측: ${unit}${predicted.toFixed(2)}`,
                fill: "#93c5fd",
                fontSize: 11,
                position: "right",
              }}
            />
          )}

          <ReferenceArea
            y1={lower}
            y2={upper}
            x1={chartData[chartData.length - 2]?.date}
            x2={chartData[chartData.length - 1]?.date}
            fill="#3b82f6"
            fillOpacity={0.08}
            stroke="#3b82f6"
            strokeOpacity={0.3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
