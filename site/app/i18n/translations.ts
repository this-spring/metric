export type Language = "zh" | "en";

export interface Translations {
  title: string;
  description: string;
  noData: string;
  runFetcher: string;
  footer: string;
  updated: string;
  dataPoints: string;
  value: string;
  langToggle: string;
  dateLocale: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    title: "市场指标",
    description: "标普500 PE、纳斯达克 PE 及 VIX 历史走势，每小时更新。",
    noData: "暂无数据",
    runFetcher: "请先运行数据抓取器：cd fetcher && python main.py",
    footer: "数据来源：multpl.com、Yahoo Finance。通过 GitHub Actions 自动更新。",
    updated: "更新时间",
    dataPoints: "个数据点",
    value: "数值",
    langToggle: "English",
    dateLocale: "zh-CN",
  },
  en: {
    title: "Market Indicators",
    description:
      "S&P 500 PE, NASDAQ PE, and VIX historical trends. Updated hourly.",
    noData: "No data available yet.",
    runFetcher:
      "Run the data fetcher first: cd fetcher && python main.py",
    footer:
      "Data sources: multpl.com, Yahoo Finance. Auto-updated via GitHub Actions.",
    updated: "Updated",
    dataPoints: "data points",
    value: "Value",
    langToggle: "中文",
    dateLocale: "en-US",
  },
};
