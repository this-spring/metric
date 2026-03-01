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

export default function IndicatorChart({ data, color = "#6c8cff" }: Props) {
  // Downsample if too many points for performance
  const sampled =
    data.length > 500
      ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
      : data;

  // Default to showing last 20% of data (recent trends)
  const defaultStartIndex = Math.floor(sampled.length * 0.8);
  const [startIndex, setStartIndex] = useState(defaultStartIndex);
  const [endIndex, setEndIndex] = useState(sampled.length - 1);

  // Detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const chartHeight = isMobile ? 250 : 300;
  const brushHeight = isMobile ? 30 : 40;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={sampled}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#8888a0", fontSize: isMobile ? 10 : 11 }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return isNaN(d.getTime()) ? v : d.getFullYear().toString();
          }}
          minTickGap={isMobile ? 40 : 60}
        />
        <YAxis
          tick={{ fill: "#8888a0", fontSize: isMobile ? 10 : 11 }}
          width={isMobile ? 40 : 50}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a2e",
            border: "1px solid #2a2a3e",
            borderRadius: 8,
            color: "#e0e0e6",
            fontSize: isMobile ? 12 : 14,
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
          strokeWidth={isMobile ? 1.2 : 1.5}
          dot={false}
          animationDuration={800}
        />
        <Brush
          dataKey="date"
          height={brushHeight}
          stroke={color}
          fill="#12121a"
          startIndex={startIndex}
          endIndex={endIndex}
          onChange={(range: { startIndex?: number; endIndex?: number }) => {
            if (range.startIndex !== undefined) setStartIndex(range.startIndex);
            if (range.endIndex !== undefined) setEndIndex(range.endIndex);
          }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return isNaN(d.getTime()) ? "" : d.getFullYear().toString();
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
