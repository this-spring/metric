"use client";

import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Downsample if too many points for performance
  const sampled =
    data.length > 500
      ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
      : data;

  // Default to showing last 20% of data for recent trend view
  const startIndex = Math.max(0, Math.floor(sampled.length * 0.8));

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
      <LineChart
        data={sampled}
        margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
      >
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
          width={isMobile ? 38 : 50}
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
          strokeWidth={1.5}
          dot={false}
          animationDuration={800}
        />
        <Brush
          dataKey="date"
          height={isMobile ? 24 : 30}
          stroke="#2a2a3e"
          fill="#12121a"
          travellerWidth={isMobile ? 6 : 8}
          startIndex={startIndex}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return isNaN(d.getTime()) ? v : d.getFullYear().toString();
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
