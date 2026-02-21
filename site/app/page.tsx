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
  const dataDir = path.join(process.cwd(), "..", "data");
  if (!fs.existsSync(dataDir)) return [];

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  const indicators: IndicatorData[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
      indicators.push(JSON.parse(raw));
    } catch {
      continue;
    }
  }

  return indicators;
}

export default function Home() {
  const indicators = loadIndicators();

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Market Indicators</h1>
        <p style={{ fontSize: 14, color: "#8888a0", marginTop: 8 }}>
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
            gap: 24,
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
          marginTop: 60,
          paddingTop: 20,
          borderTop: "1px solid #1e1e2e",
          fontSize: 12,
          color: "#555570",
          textAlign: "center",
        }}
      >
        Data sources: multpl.com, Yahoo Finance. Auto-updated via GitHub Actions.
      </footer>
    </main>
  );
}
