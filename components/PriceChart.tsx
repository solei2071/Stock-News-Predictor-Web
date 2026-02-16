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
      <section className="glass-card p-4 mb-6">
        <h2 className="section-title">Price trend</h2>
        <div className="h-[300px] flex items-center justify-center text-slate-500">No chart data</div>
      </section>
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
      color: isUp ? "#34d399" : "#f87171",
    };
  });

  const lastCandle = candles[candles.length - 1];
  chartData.push({
    date: `Forecast (${horizon}d)`,
    open: lastCandle.close,
    high: upper,
    low: lower,
    close: predicted,
    bodyBottom: Math.min(lastCandle.close, predicted),
    bodyHeight: Math.abs(predicted - lastCandle.close) || 0.01,
    wickRange: [lower, upper],
    color: predicted >= lastCandle.close ? "#34d399" : "#f87171",
    predicted,
    isForecast: true,
  });

  const allValues = candles
    .flatMap((c) => [c.open, c.high, c.low, c.close])
    .concat([predicted, lower, upper])
    .filter((value) => Number.isFinite(value));
  if (allValues.length === 0) {
    return (
      <section className="glass-card p-4 mb-6">
        <h2 className="section-title">Price trend</h2>
        <div className="h-[300px] flex items-center justify-center text-slate-500">No valid chart data</div>
      </section>
    );
  }

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  const padding = valueRange > 0 ? valueRange * 0.03 : Math.max(minValue * 0.01, 0.1);

  const minY = minValue - padding;
  const maxY = maxValue + padding;
  const unit = currency === "USD" ? "$" : "";

  return (
    <section className="glass-card p-4 mb-6 fade-in">
      <h2 className="section-title">Price trend</h2>
      <p className="text-xs muted-text mb-4">
        Last {candles.length} trading days · Forecast interval: {horizon} days
      </p>
      <ResponsiveContainer width="100%" height={430}>
        <ComposedChart data={chartData} margin={{ top: 12, right: 24, left: 6, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickFormatter={(v: string) => {
              if (v.startsWith("Forecast")) return v;
              const parts = v.split("-");
              return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : v;
            }}
            interval={Math.max(0, Math.floor(chartData.length / 6))}
          />
          <YAxis
            domain={[minY, maxY]}
            allowDataOverflow
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickFormatter={(v: number) => `${unit}${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            width={78}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            formatter={((value: unknown, name: unknown) => {
              if (value == null) return ["-", name ?? ""];
              const labels: Record<string, string> = {
                close: "Close",
                open: "Open",
                high: "High",
                low: "Low",
                predicted: "Forecast",
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
                fillOpacity={entry.isForecast ? 0.65 : 1}
                stroke={entry.isForecast ? "#60a5fa" : entry.color}
                strokeDasharray={entry.isForecast ? "4 2" : undefined}
              />
            ))}
          </Bar>

          <Line
            type="monotone"
            dataKey="close"
            stroke="#93c5fd"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />

          <ReferenceLine
            y={predicted}
            stroke="#3b82f6"
            strokeDasharray="6 3"
            strokeWidth={1.1}
            label={{
              value: `Forecast: ${unit}${predicted.toFixed(2)}`,
              fill: "#93c5fd",
              fontSize: 11,
              position: "right",
            }}
          />

          <ReferenceArea
            y1={lower}
            y2={upper}
            x1={chartData[chartData.length - 2]?.date}
            x2={chartData[chartData.length - 1]?.date}
            fill="#3b82f6"
            fillOpacity={0.09}
            stroke="#3b82f6"
            strokeOpacity={0.32}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}
