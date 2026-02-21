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
    <div className="chart-card">
      <div>
        <div className="chart-card-header">
          <h2 className="chart-card-title">{indicator.display_name}</h2>
          {latest && (
            <span
              className="chart-card-value"
              style={{ color: color || "#6c8cff" }}
            >
              {latest.value.toFixed(2)}
            </span>
          )}
        </div>
        <p className="chart-card-desc">{indicator.description}</p>
      </div>

      <IndicatorChart data={indicator.data} color={color} />

      <p className="chart-card-meta">
        Updated: {timeStr} &middot; {indicator.data.length} data points
      </p>
    </div>
  );
}
