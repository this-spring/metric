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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Downsample if too many points for performance
  const sampled =
    data.length > 500
      ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
      : data;

  // Default to showing last 20% for recent trends
  const defaultStartIndex = Math.floor(sampled.length * 0.8);

  const chartHeight = isMobile ? 250 : 300;
  const fontSize = isMobile ? 10 : 11;
  const brushHeight = isMobile ? 30 : 40;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={sampled}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#8888a0", fontSize }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return isNaN(d.getTime()) ? v : d.getFullYear().toString();
          }}
          minTickGap={isMobile ? 40 : 60}
        />
        <YAxis tick={{ fill: "#8888a0", fontSize }} width={isMobile ? 40 : 50} />
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
          height={brushHeight}
          stroke={color}
          fill="#12121a"
          startIndex={defaultStartIndex}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return isNaN(d.getTime()) ? v : d.getFullYear().toString();
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
