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

type RangePreset = "1Y" | "5Y" | "10Y" | "MAX";

function getPresetStartIndex(
  data: DataPoint[],
  preset: RangePreset
): number {
  if (preset === "MAX") return 0;
  const years = preset === "1Y" ? 1 : preset === "5Y" ? 5 : 10;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].date <= cutoffStr) return i;
  }
  return 0;
}

export default function IndicatorChart({ data, color = "#6c8cff" }: Props) {
  const [preset, setPreset] = useState<RangePreset>("MAX");
  const [brushRange, setBrushRange] = useState<{
    startIndex: number;
    endIndex: number;
  } | null>(null);

  // Downsample if too many points for performance
  const sampled = useMemo(() => {
    if (data.length <= 500) return data;
    const step = Math.ceil(data.length / 500);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data]);

  const presetStart = useMemo(
    () => getPresetStartIndex(sampled, preset),
    [sampled, preset]
  );

  const startIndex = brushRange ? brushRange.startIndex : presetStart;
  const endIndex = brushRange ? brushRange.endIndex : sampled.length - 1;

  const handlePreset = useCallback(
    (p: RangePreset) => {
      setPreset(p);
      setBrushRange(null);
    },
    []
  );

  const handleBrushChange = useCallback(
    (range: { startIndex?: number; endIndex?: number }) => {
      if (range.startIndex !== undefined && range.endIndex !== undefined) {
        setBrushRange({
          startIndex: range.startIndex,
          endIndex: range.endIndex,
        });
        setPreset("MAX"); // clear preset highlight when user drags
      }
    },
    []
  );

  const presets: RangePreset[] = ["1Y", "5Y", "10Y", "MAX"];

  return (
    <div>
      {/* Time range presets */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            style={{
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border:
                preset === p && !brushRange
                  ? `1px solid ${color}`
                  : "1px solid #2a2a3e",
              background:
                preset === p && !brushRange ? `${color}22` : "transparent",
              color: preset === p && !brushRange ? color : "#8888a0",
              cursor: "pointer",
              transition: "all 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {p === "MAX" ? "All" : p}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampled}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8888a0", fontSize: 11 }}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return isNaN(d.getTime()) ? v : d.getFullYear().toString();
            }}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: "#8888a0", fontSize: 11 }}
            width={50}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid #2a2a3e",
              borderRadius: 8,
              color: "#e0e0e6",
              fontSize: 13,
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
            height={36}
            fill="#0e0e16"
            stroke="#2a2a3e"
            startIndex={startIndex}
            endIndex={endIndex}
            onChange={handleBrushChange}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return isNaN(d.getTime()) ? v : d.getFullYear().toString();
            }}
            travellerWidth={10}
          >
            <LineChart data={sampled}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
