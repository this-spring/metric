# Market Indicators

A lightweight dashboard that tracks key market valuation and volatility indicators, with data auto-updated hourly via GitHub Actions and deployed as a static site to GitHub Pages.

**Live site:** `https://<your-username>.github.io/metric/`

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     GitHub Actions                           │
│                                                              │
│  ┌─────────────────┐          ┌───────────────────────────┐  │
│  │ update-data.yml │ triggers │ deploy.yml                │  │
│  │ (hourly cron)   │────────► │ (build & deploy to Pages) │  │
│  └────────┬────────┘          └───────────────┬───────────┘  │
│           │                                   │              │
└───────────│───────────────────────────────────│──────────────┘
            │                                   │
            ▼                                   ▼
     ┌──────────────┐     ┌──────────┐    ┌──────────────┐
     │ fetcher/     │────►│ data/    │───►│ site/        │
     │ Python 抓取器 │     │ JSON 数据 │    │ Next.js 前端  │
     └──────────────┘     └──────────┘    └──────────────┘
```

**数据流：**

1. **Fetcher** — Python 脚本从外部数据源抓取市场指标数据，输出 JSON 文件到 `data/`
2. **Data** — JSON 文件作为中间存储，提交到 Git 仓库
3. **Site** — Next.js 在构建时读取 `data/*.json`，生成静态 HTML
4. **Deploy** — 静态产物部署到 GitHub Pages

## Data Sources

| Indicator | File | Source | Method |
|-----------|------|--------|--------|
| S&P 500 PE Ratio (TTM) | `data/sp500_pe.json` | [multpl.com](https://www.multpl.com/s-p-500-pe-ratio/table/by-month) | HTML table scraping (requests + BeautifulSoup) |
| NASDAQ Composite PE | `data/nasdaq_pe.json` | Yahoo Finance (QQQ ETF proxy) | [yfinance](https://github.com/ranaroussi/yfinance) API |
| VIX Volatility Index | `data/vix.json` | Yahoo Finance (^VIX) | [yfinance](https://github.com/ranaroussi/yfinance) API |

### Data JSON Format

每个 JSON 文件结构如下：

```json
{
  "name": "sp500_pe",
  "display_name": "S&P 500 PE Ratio (TTM)",
  "description": "S&P 500 trailing twelve months price-to-earnings ratio",
  "updated_at": "2025-02-21T12:00:00+00:00",
  "data": [
    { "date": "Jan 2015", "value": 20.02 },
    { "date": "Feb 2015", "value": 20.51 }
  ]
}
```

## Project Structure

```
metric/
├── .github/workflows/
│   ├── update-data.yml     # 每小时抓取数据并提交
│   └── deploy.yml          # 构建并部署到 GitHub Pages
├── fetcher/
│   ├── main.py             # 入口：遍历所有 indicator 并输出 JSON
│   ├── config.py           # Indicator 注册表
│   ├── requirements.txt    # Python 依赖
│   └── indicators/
│       ├── base.py         # BaseIndicator 抽象基类
│       ├── sp500_pe.py     # S&P 500 PE 抓取器
│       ├── nasdaq_pe.py    # NASDAQ PE 抓取器 (yfinance)
│       └── vix.py          # VIX 抓取器 (yfinance)
├── data/                   # 自动生成的 JSON 数据文件
│   ├── sp500_pe.json
│   ├── nasdaq_pe.json
│   └── vix.json
└── site/                   # Next.js 前端
    ├── app/
    │   ├── layout.tsx      # 全局布局
    │   ├── page.tsx        # 首页：读取数据 & 渲染图表
    │   ├── globals.css     # 全局样式（暗色主题）
    │   └── components/
    │       ├── ChartCard.tsx       # 指标卡片组件
    │       └── IndicatorChart.tsx  # Recharts 折线图组件
    ├── next.config.js      # Next.js 配置（静态导出 + basePath）
    └── package.json
```

## How to Run

### Prerequisites

- Python 3.12+
- Node.js 20+

### 1. Fetch Data

```bash
cd fetcher
pip install -r requirements.txt
python main.py
```

执行后会在 `data/` 目录生成 3 个 JSON 文件。如果某个数据源不可用，脚本会报错但继续处理其他指标。

### 2. Run Frontend (Dev Mode)

```bash
cd site
npm install
npm run dev
```

访问 `http://localhost:3000` 查看仪表盘。

### 3. Build Static Site

```bash
cd site
npm run build
```

产物输出到 `site/out/`，可部署到任何静态托管服务。

## GitHub Actions Workflows

### Update Market Data (`update-data.yml`)

- **触发方式：** 每小时自动运行（cron）；支持手动触发（workflow_dispatch）
- **流程：** 安装 Python 依赖 → 运行 `fetcher/main.py` → 将 `data/` 的变更提交并推送到 main
- **手动触发：** GitHub 仓库页面 → Actions → "Update Market Data" → Run workflow

### Deploy to GitHub Pages (`deploy.yml`)

- **触发方式：** push 到 main 且 `site/` 或 `data/` 有变更时；Update Market Data 完成后
- **流程：** 安装 Node 依赖 → `npm run build` → 部署到 GitHub Pages

## Adding a New Indicator

1. 在 `fetcher/indicators/` 下新建 Python 文件，继承 `BaseIndicator`：

```python
from .base import BaseIndicator

class MyIndicator(BaseIndicator):
    name = "my_indicator"
    display_name = "My Indicator"
    description = "Description of what this indicator measures"

    def fetch(self) -> list[dict]:
        # Fetch data from your source
        return [{"date": "2025-01-01", "value": 42.0}, ...]
```

2. 在 `fetcher/config.py` 的 `INDICATORS` 列表中注册：

```python
INDICATORS = [
    "indicators.sp500_pe.SP500PE",
    "indicators.nasdaq_pe.NasdaqPE",
    "indicators.vix.VIX",
    "indicators.my_indicator.MyIndicator",  # new
]
```

3. （可选）在 `site/app/page.tsx` 的 `COLORS` 中添加对应颜色：

```typescript
const COLORS: Record<string, string> = {
  sp500_pe: "#6c8cff",
  nasdaq_pe: "#ff6ca8",
  vix: "#ffa84c",
  my_indicator: "#4cffb0",  // new
};
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Data Fetcher | Python 3.12, requests, BeautifulSoup4, yfinance |
| Frontend | Next.js 14, React 18, Recharts, TypeScript |
| Hosting | GitHub Pages (static export) |
| CI/CD | GitHub Actions |
