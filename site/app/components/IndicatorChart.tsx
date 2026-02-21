"use client";

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

export default function IndicatorChart({ data, color = "#6c8cff" }: Props) {
  // Downsample if too many points for performance
  const sampled =
    data.length > 500
      ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
      : data;

  return (
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
      </LineChart>
    </ResponsiveContainer>
  );
}
