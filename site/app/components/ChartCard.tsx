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

  // Detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: isMobile ? 8 : 12,
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 12 : 16,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? 8 : 0,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? 16 : 18,
              fontWeight: 600,
              flex: isMobile ? "1 1 100%" : "0 0 auto",
            }}
          >
            {indicator.display_name}
          </h2>
          {latest && (
            <span
              style={{
                fontSize: isMobile ? 20 : 24,
                fontWeight: 700,
                color: color || "#6c8cff",
              }}
            >
              {latest.value.toFixed(2)}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: isMobile ? 12 : 13,
            color: "#8888a0",
            marginTop: 4,
          }}
        >
          {indicator.description}
        </p>
      </div>

      <IndicatorChart data={indicator.data} color={color} />

      <p
        style={{
          fontSize: isMobile ? 10 : 11,
          color: "#555570",
          textAlign: "right",
        }}
      >
        Updated: {timeStr} &middot; {indicator.data.length} data points
      </p>
    </div>
  );
}
