"use client";

import { I18nProvider, useI18n } from "../i18n";
import ChartCard from "./ChartCard";

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
  indicators: IndicatorData[];
  colors: Record<string, string>;
  basePath: string;
}

function Dashboard({ indicators, colors, basePath }: Props) {
  const { locale, t, toggleLocale } = useI18n();

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "clamp(20px, 5vw, 40px) clamp(12px, 4vw, 20px)",
      }}
    >
      <header
        style={{
          marginBottom: "clamp(24px, 5vw, 40px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={`${basePath}/logo.svg`}
            alt="Logo"
            width={40}
            height={40}
            style={{ borderRadius: 8 }}
          />
          <div>
            <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700 }}>
              {t.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(12px, 3vw, 14px)",
                color: "#8888a0",
                marginTop: 4,
              }}
            >
              {t.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={toggleLocale}
          style={{
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid #2a2a3e",
            background: "transparent",
            color: "#8888a0",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {locale === "zh" ? "EN" : "中文"}
        </button>
      </header>

      {indicators.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 80,
            color: "#555570",
          }}
        >
          <p style={{ fontSize: 16 }}>{t.noData}</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            {t.noDataHint} <code>cd fetcher &amp;&amp; python main.py</code>
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "1fr",
          }}
        >
          {indicators.map((ind) => (
            <ChartCard
              key={ind.name}
              indicator={ind}
              color={colors[ind.name]}
            />
          ))}
        </div>
      )}

      <footer
        style={{
          marginTop: 60,
          paddingTop: 20,
          borderTop: "1px solid #1e1e2e",
          fontSize: 12,
          color: "#555570",
          textAlign: "center",
        }}
      >
        {t.footer}
      </footer>
    </main>
  );
}

export default function ClientApp(props: Props) {
  return (
    <I18nProvider>
      <Dashboard {...props} />
    </I18nProvider>
  );
}
