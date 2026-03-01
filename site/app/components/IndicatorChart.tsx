"use client";

import { useState, useMemo, useCallback } from "react";
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
  // Downsample full dataset once for Brush overview + chart
  const sampled = useMemo(() => {
    if (data.length <= 300) return data;
    const step = Math.ceil(data.length / 300);
    const result = data.filter((_, i) => i % step === 0);
    const last = data[data.length - 1];
    if (result[result.length - 1] !== last) result.push(last);
    return result;
  }, [data]);

  // Compute start index for each time range
  const rangeStartIndex = useCallback(
    (years: number) => {
      if (years === 0) return 0;
      const now = new Date();
      const cutoff = new Date(
        now.getFullYear() - years,
        now.getMonth(),
        now.getDate()
      );
      for (let i = 0; i < sampled.length; i++) {
        if (new Date(sampled[i].date) >= cutoff) return i;
      }
      return 0;
    },
    [sampled]
  );

  const [activeRange, setActiveRange] = useState("All");
  const [brushStart, setBrushStart] = useState(0);
  const [brushEnd, setBrushEnd] = useState(sampled.length - 1);

  function handleRangeClick(label: string, years: number) {
    const start = rangeStartIndex(years);
    setActiveRange(label);
    setBrushStart(start);
    setBrushEnd(sampled.length - 1);
  }

  // Compute visible time span for tick formatting
  const spanYears = useMemo(() => {
    if (sampled.length < 2) return 1;
    const s = sampled[brushStart]?.date;
    const e = sampled[brushEnd]?.date;
    if (!s || !e) return 1;
    return (
      (new Date(e).getTime() - new Date(s).getTime()) /
      (365.25 * 24 * 3600 * 1000)
    );
  }, [sampled, brushStart, brushEnd]);

  function formatXTick(v: string) {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    if (spanYears <= 2) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    }
    if (spanYears <= 5) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    }
    return d.getFullYear().toString();
  }

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
        {TIME_RANGES.map(({ label, years }) => (
          <button
            key={label}
            onClick={() => handleRangeClick(label, years)}
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

      <ResponsiveContainer width="100%" height={340}>
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
          <Brush
            dataKey="date"
            height={28}
            stroke="#2a2a3e"
            fill="#0d0d1a"
            travellerWidth={8}
            startIndex={brushStart}
            endIndex={brushEnd}
            onChange={(range) => {
              if (
                !range ||
                range.startIndex === undefined ||
                range.endIndex === undefined
              )
                return;
              setBrushStart(range.startIndex);
              setBrushEnd(range.endIndex);
              setActiveRange("");
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
