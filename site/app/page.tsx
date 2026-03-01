import fs from "fs";
import path from "path";
import ChartCard from "./components/ChartCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmptyState from "./components/EmptyState";

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

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <Header />

      {indicators.length === 0 ? (
        <EmptyState />
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

      <Footer />
    </main>
  );
}
