"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "zh" | "en";

const translations = {
  zh: {
    title: "市场指标仪表盘",
    subtitle: "美股、A股、港股核心指标历史走势，每小时更新",
    noData: "暂无数据",
    noDataHint: "请先运行数据抓取器：",
    updated: "更新于",
    dataPoints: "个数据点",
    footer: "数据来源：multpl.com、Yahoo Finance。通过 GitHub Actions 自动更新。",
    loading: "加载图表中...",
    categories: {
      us: "美股",
      cn: "A 股",
      hk: "港股",
    },
    indicators: {
      sp500_pe: { display_name: "标普500 市盈率 (TTM)", description: "标普500 滚动十二个月市盈率，数据始于 1871 年（Shiller 数据集）。" },
      nasdaq_pe: { display_name: "纳斯达克综合指数 市盈率", description: "纳斯达克综合指数市盈率（基于 QQQ ETF 估算），数据始于 1999 年。" },
      vix: { display_name: "VIX 恐慌指数", description: "CBOE 波动率指数——市场恐慌情绪指标，数据始于 1990 年。" },
      sse_composite: { display_name: "上证综合指数", description: "上海证券交易所综合股价指数，反映沪市整体走势。" },
      csi300: { display_name: "沪深300指数", description: "沪深两市市值最大、流动性最好的 300 只股票组成的指数。" },
      hsi: { display_name: "恒生指数", description: "香港恒生指数，反映港股市场整体表现。" },
    },
  },
  en: {
    title: "Market Indicators",
    subtitle: "US, China A-share & HK market indicators. Updated hourly.",
    noData: "No data available yet.",
    noDataHint: "Run the data fetcher first:",
    updated: "Updated",
    dataPoints: "data points",
    footer: "Data sources: multpl.com, Yahoo Finance. Auto-updated via GitHub Actions.",
    loading: "Loading chart...",
    categories: {
      us: "US Market",
      cn: "China A-Shares",
      hk: "Hong Kong",
    },
    indicators: {
      sp500_pe: { display_name: "S&P 500 PE Ratio (TTM)", description: "S&P 500 trailing twelve months price-to-earnings ratio. Data from 1871 (Shiller dataset)." },
      nasdaq_pe: { display_name: "NASDAQ Composite PE Ratio", description: "NASDAQ Composite index price-to-earnings ratio estimated from QQQ ETF. Data from 1999." },
      vix: { display_name: "VIX (Volatility Index)", description: "CBOE Volatility Index - market fear gauge. Data from 1990." },
      sse_composite: { display_name: "SSE Composite Index", description: "Shanghai Stock Exchange Composite Index, reflecting overall Shanghai market performance." },
      csi300: { display_name: "CSI 300 Index", description: "Index of the 300 largest and most liquid stocks on Shanghai and Shenzhen exchanges." },
      hsi: { display_name: "Hang Seng Index", description: "Hang Seng Index, reflecting overall Hong Kong stock market performance." },
    },
  },
};

interface IndicatorI18n {
  display_name: string;
  description: string;
}

interface Translations {
  title: string;
  subtitle: string;
  noData: string;
  noDataHint: string;
  updated: string;
  dataPoints: string;
  footer: string;
  loading: string;
  categories: Record<string, string>;
  indicators: Record<string, IndicatorI18n>;
}

interface I18nContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  t: translations.zh,
  toggleLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "zh" ? "en" : "zh"));
  }, []);
  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
