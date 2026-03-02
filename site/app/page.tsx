import fs from "fs";
import path from "path";
import ClientApp from "./components/ClientApp";

const COLORS: Record<string, string> = {
  sp500_pe: "#6c8cff",
  nasdaq_pe: "#ff6ca8",
  vix: "#ffa84c",
  sse_composite: "#ff5555",
  csi300: "#55cc77",
  hsi: "#cc66ff",
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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <ClientApp indicators={indicators} colors={COLORS} basePath={basePath} />
  );
}
