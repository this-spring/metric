import fs from "fs";
import path from "path";
import ChartCard from "./components/ChartCard";

const COLORS: Record<string, string> = {
  sp500_pe: "#6c8cff",
  nasdaq_pe: "#ff6ca8",
  vix: "#ffa84c",
};

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

function loadIndicators(): IndicatorData[] {
  // Try multiple paths: ../data (repo root) and public/data (copied by CI)
  const candidates = [
    path.join(process.cwd(), "..", "data"),
    path.join(process.cwd(), "public", "data"),
  ];

  for (const dataDir of candidates) {
    if (!fs.existsSync(dataDir)) continue;

    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
    if (files.length === 0) continue;

    const indicators: IndicatorData[] = [];
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
        indicators.push(JSON.parse(raw));
      } catch {
        continue;
      }
    }
    if (indicators.length > 0) return indicators;
  }

  return [];
}

export default function Home() {
  const indicators = loadIndicators();

  // Detect mobile (server-side safe)
  const isMobile = false; // Will be handled by CSS media queries

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
          marginBottom: "clamp(24px, 6vw, 40px)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(20px, 5vw, 28px)",
            fontWeight: 700,
          }}
        >
          Market Indicators
        </h1>
        <p
          style={{
            fontSize: "clamp(12px, 3vw, 14px)",
            color: "#8888a0",
            marginTop: 8,
          }}
        >
          S&amp;P 500 PE, NASDAQ PE, and VIX historical trends. Updated hourly.
        </p>
      </header>

      {indicators.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 80,
            color: "#555570",
          }}
        >
          <p style={{ fontSize: 16 }}>No data available yet.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Run the data fetcher first: <code>cd fetcher &amp;&amp; python main.py</code>
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "clamp(16px, 4vw, 24px)",
            gridTemplateColumns: "1fr",
          }}
        >
          {indicators.map((ind) => (
            <ChartCard
              key={ind.name}
              indicator={ind}
              color={COLORS[ind.name]}
            />
          ))}
        </div>
      )}

      <footer
        style={{
          marginTop: "clamp(40px, 8vw, 60px)",
          paddingTop: "clamp(16px, 4vw, 20px)",
          borderTop: "1px solid #1e1e2e",
          fontSize: "clamp(11px, 2.5vw, 12px)",
          color: "#555570",
          textAlign: "center",
        }}
      >
        Data sources: multpl.com, Yahoo Finance. Auto-updated via GitHub Actions.
      </footer>
    </main>
  );
}
