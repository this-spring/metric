"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
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
  // Downsample if too many points for performance
  const sampled =
    data.length > 500
      ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
      : data;

  // Default to showing last 20% of data (recent trends)
  const defaultStart = Math.floor(sampled.length * 0.8);
  const [brushRange, setBrushRange] = useState({
    startIndex: defaultStart,
    endIndex: sampled.length - 1,
  });
  const [activeRange, setActiveRange] = useState<string | null>(null);

  function setTimeRange(years: number, label: string) {
    if (years === 0) {
      setBrushRange({ startIndex: 0, endIndex: sampled.length - 1 });
      setActiveRange(label);
      return;
    }
    const now = new Date();
    const cutoff = new Date(
      now.getFullYear() - years,
      now.getMonth(),
      now.getDate()
    );
    let startIdx = 0;
    for (let i = 0; i < sampled.length; i++) {
      if (new Date(sampled[i].date) >= cutoff) {
        startIdx = i;
        break;
      }
    }
    setBrushRange({ startIndex: startIdx, endIndex: sampled.length - 1 });
    setActiveRange(label);
  }

  // Determine visible time span to pick the right X-axis format
  const visibleStart = sampled[brushRange.startIndex]?.date;
  const visibleEnd = sampled[brushRange.endIndex]?.date;
  const spanYears =
    visibleStart && visibleEnd
      ? (new Date(visibleEnd).getTime() - new Date(visibleStart).getTime()) /
        (365.25 * 24 * 3600 * 1000)
      : 99;

  function formatXTick(v: string) {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    if (spanYears <= 2) {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }
    return d.getFullYear().toString();
  }

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
        {TIME_RANGES.map(({ label, years }) => (
          <button
            key={label}
            onClick={() => setTimeRange(years, label)}
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
            minTickGap={60}
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
            animationDuration={800}
          />
          <Brush
            dataKey="date"
            height={24}
            stroke="#2a2a3e"
            fill="#0d0d1a"
            travellerWidth={6}
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            onChange={(range) => {
              if (
                range &&
                range.startIndex !== undefined &&
                range.endIndex !== undefined
              ) {
                setBrushRange({
                  startIndex: range.startIndex,
                  endIndex: range.endIndex,
                });
                setActiveRange(null);
              }
            }}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return isNaN(d.getTime()) ? "" : d.getFullYear().toString();
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
