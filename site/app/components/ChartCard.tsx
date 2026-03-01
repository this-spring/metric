"use client";

import IndicatorChart from "./IndicatorChart";

interface DataPoint {
  date: string;
  value: number;
}

interface IndicatorData {
  name: string;
  display_name: string;
  description: string;
  updated_at: string;
  data: DataPoint[];
}

interface Props {
  indicator: IndicatorData;
  color?: string;
}

export default function ChartCard({ indicator, color }: Props) {
  const latest = indicator.data[indicator.data.length - 1];
  const updatedAt = new Date(indicator.updated_at);
  const timeStr = updatedAt.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: "clamp(16px, 4vw, 24px)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h2 style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 600 }}>
            {indicator.display_name}
          </h2>
          {latest && (
            <span style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: 700, color: color || "#6c8cff" }}>
              {latest.value.toFixed(2)}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#8888a0", marginTop: 4 }}>
          {indicator.description}
        </p>
      </div>

      <IndicatorChart data={indicator.data} color={color} />

      <p style={{ fontSize: 11, color: "#555570", textAlign: "right" }}>
        Updated: {timeStr} &middot; {indicator.data.length} data points
      </p>
    </div>
  );
}
