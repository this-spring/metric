"use client";

import IndicatorChart from "./IndicatorChart";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { t, lang } = useLanguage();
  const latest = indicator.data[indicator.data.length - 1];
  const updatedAt = new Date(indicator.updated_at);
  const timeStr = updatedAt.toLocaleString(t.dateLocale, {
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
        padding: "24px",
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
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>
            {indicator.display_name}
          </h2>
          {latest && (
            <span style={{ fontSize: 24, fontWeight: 700, color: color || "#6c8cff" }}>
              {latest.value.toFixed(2)}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#8888a0", marginTop: 4 }}>
          {indicator.description}
        </p>
      </div>

      <IndicatorChart data={indicator.data} color={color} lang={lang} />

      <p style={{ fontSize: 11, color: "#555570", textAlign: "right" }}>
        {t.updated}: {timeStr} &middot; {indicator.data.length} {t.dataPoints}
      </p>
    </div>
  );
}
