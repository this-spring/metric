"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  color?: string;
}

const TIME_RANGES = [
  { label: "1Y", years: 1 },
  { label: "2Y", years: 2 },
  { label: "5Y", years: 5 },
  { label: "All", years: 0 },
];

export default function IndicatorChart({ data, color = "#6c8cff" }: Props) {
  const [activeRange, setActiveRange] = useState("All");

  // Filter data by selected time range
  const filteredData = useMemo(() => {
    const range = TIME_RANGES.find((r) => r.label === activeRange);
    if (!range || range.years === 0) return data;
    const now = new Date();
    const cutoff = new Date(
      now.getFullYear() - range.years,
      now.getMonth(),
      now.getDate()
    );
    return data.filter((d) => new Date(d.date) >= cutoff);
  }, [data, activeRange]);

  // Downsample for rendering performance
  const sampled = useMemo(() => {
    if (filteredData.length <= 300) return filteredData;
    const step = Math.ceil(filteredData.length / 300);
    const result = filteredData.filter((_, i) => i % step === 0);
    // Always include the last point
    const last = filteredData[filteredData.length - 1];
    if (result[result.length - 1] !== last) result.push(last);
    return result;
  }, [filteredData]);

  // Compute visible time span for tick formatting
  const spanYears = useMemo(() => {
    if (sampled.length < 2) return 1;
    const start = new Date(sampled[0].date).getTime();
    const end = new Date(sampled[sampled.length - 1].date).getTime();
    return (end - start) / (365.25 * 24 * 3600 * 1000);
  }, [sampled]);

  function formatXTick(v: string) {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    if (spanYears <= 1) {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }
    if (spanYears <= 5) {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }
    return d.getFullYear().toString();
  }

  // Shorter ranges → denser ticks
  const minGap =
    spanYears <= 1 ? 30 : spanYears <= 2 ? 40 : spanYears <= 5 ? 50 : 80;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        {TIME_RANGES.map(({ label }) => (
          <button
            key={label}
            onClick={() => setActiveRange(label)}
            style={{
              padding: "3px 12px",
              borderRadius: 6,
              border: `1px solid ${activeRange === label ? color : "#2a2a3e"}`,
              background:
                activeRange === label ? `${color}22` : "transparent",
              color: activeRange === label ? color : "#8888a0",
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampled}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8888a0", fontSize: 11 }}
            tickFormatter={formatXTick}
            minTickGap={minGap}
          />
          <YAxis tick={{ fill: "#8888a0", fontSize: 11 }} width={50} />
          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid #2a2a3e",
              borderRadius: 8,
              color: "#e0e0e6",
            }}
            labelFormatter={(label: string) => {
              const d = new Date(label);
              return isNaN(d.getTime())
                ? label
                : d.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  });
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
