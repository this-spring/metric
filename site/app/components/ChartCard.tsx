"use client";

import dynamic from "next/dynamic";
import { useI18n } from "../i18n";

const IndicatorChart = dynamic(() => import("./IndicatorChart"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555570",
        fontSize: 13,
      }}
    >
      Loading...
    </div>
  ),
});

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
  const { locale, t } = useI18n();
  const latest = indicator.data[indicator.data.length - 1];
  const updatedAt = new Date(indicator.updated_at);
  const timeStr = updatedAt.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const indicatorKey = indicator.name as keyof typeof t.indicators;
  const localizedIndicator = t.indicators[indicatorKey];
  const displayName = localizedIndicator?.display_name || indicator.display_name;
  const description = localizedIndicator?.description || indicator.description;

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
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <h2 style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 600 }}>
            {displayName}
          </h2>
          {latest && (
            <span
              style={{
                fontSize: "clamp(20px, 5vw, 24px)",
                fontWeight: 700,
                color: color || "#6c8cff",
              }}
            >
              {latest.value.toFixed(2)}
            </span>
          )}
        </div>
        <p style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#8888a0", marginTop: 4 }}>
          {description}
        </p>
      </div>

      <IndicatorChart data={indicator.data} color={color} locale={locale} />

      <p style={{ fontSize: 11, color: "#555570", textAlign: "right" }}>
        {t.updated}: {timeStr} &middot; {indicator.data.length} {t.dataPoints}
      </p>
    </div>
  );
}
