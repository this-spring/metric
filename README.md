# Market Indicators

A lightweight dashboard that tracks key market valuation and volatility indicators, with data auto-updated hourly via GitHub Actions and deployed to `https://sspprriinngg.cn/ai-me/`.

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions                                │
│                                                                      │
│  ┌─────────────────┐          ┌───────────────────────────────────┐  │
│  │ update-data.yml │ triggers │ deploy.yml                        │  │
│  │ (hourly cron)   │────────► │ (build & rsync to server)         │  │
│  └────────┬────────┘          └──────────────────┬────────────────┘  │
│           │                                      │                   │
│  ┌─────────────────┐   ┌─────────────────────────────────────────┐  │
│  │ claude.yml      │   │ preview.yml                             │  │
│  │ (Issue → PR)    │──►│ (PR preview deploy)                     │  │
│  └─────────────────┘   └─────────────────────────────────────────┘  │
└──────────│───────────────────────────────────────│────────────────────┘
           │                                      │
           ▼                                      ▼
    ┌──────────────┐     ┌──────────┐    ┌──────────────────────┐
    │ fetcher/     │────►│ data/    │───►│ sspprriinngg.cn      │
    │ Python 抓取器 │     │ JSON 数据 │    │ /ai-me/              │
    └──────────────┘     └──────────┘    └──────────────────────┘
```

**数据流：**

1. **Fetcher** — Python 脚本从外部数据源抓取市场指标数据，输出 JSON 文件到 `data/`
2. **Data** — JSON 文件作为中间存储，提交到 Git 仓库
3. **Site** — Next.js 在构建时读取 `data/*.json`，生成静态 HTML
4. **Deploy** — 静态产物通过 rsync 部署到 `sspprriinngg.cn`

## Automated Development Pipeline

本项目支持 **Issue 驱动自动开发**，完整流程如下：

```
创建 Issue（标题/正文含 @claude）
    │
    ▼
Claude Code Action 自动触发
    ├─ 读取 Issue 需求
    ├─ 创建分支、实现代码
    └─ 自动提交 PR
    │
    ▼
PR 触发 Preview Deploy
    ├─ 构建 Next.js
    ├─ rsync 部署到 sspprriinngg.cn/ai-me/preview/pr-N/
    └─ 在 PR 评论中贴出预览链接
    │
    ▼
用户审核 PR
    ├─ 需要修改 → PR 评论 @claude 继续迭代
    └─ 通过 → Merge 到 main
    │
    ▼
main 触发 Deploy to Production
    ├─ 构建 Next.js（basePath=/ai-me）
    ├─ rsync 部署到 sspprriinngg.cn/ai-me/
    └─ 清理所有预览目录
```

### GitHub Actions Workflows

| Workflow | 触发条件 | 说明 |
|----------|---------|------|
| `claude.yml` | Issue/PR 评论中 `@claude` | Claude 自动读取需求、实现代码、提交 PR |
| `preview.yml` | PR 创建/更新 | 构建预览并部署到 `sspprriinngg.cn/ai-me/preview/pr-N/` |
| `deploy.yml` | push 到 main / 数据更新后 | 构建并部署到 `sspprriinngg.cn/ai-me/` |
| `cleanup-preview.yml` | PR 关闭 | 清理对应 PR 的预览目录 |
| `update-data.yml` | 每小时 cron / 手动触发 | 抓取最新市场数据并提交 |

### Required GitHub Secrets

| Secret | 说明 |
|--------|------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code OAuth Token（本地运行 `claude setup-token` 生成） |
| `DEPLOY_SSH_KEY` | 服务器 SSH 私钥（用于 rsync 部署） |
| `DEPLOY_USER` | 服务器 SSH 用户名 |

### Setup Steps

1. **安装 Claude GitHub App**: https://github.com/apps/claude
2. **配置 Secrets**: 在仓库 Settings → Secrets and variables → Actions 中添加上述 3 个 Secret
3. **服务器准备**:
   - 将 SSH 公钥加入服务器 `~/.ssh/authorized_keys`
   - 确保 `/var/www/html/ai-me/` 目录存在且有写入权限
4. **测试**: 创建一个 Issue，标题包含 `@claude`，观察自动化流程

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
│   ├── claude.yml            # Issue 驱动自动开发（Claude Code Action）
│   ├── preview.yml           # PR 预览部署
│   ├── deploy.yml            # 正式部署到 sspprriinngg.cn
│   ├── cleanup-preview.yml   # PR 关闭后清理预览
│   └── update-data.yml       # 每小时抓取数据并提交
├── fetcher/
│   ├── main.py               # 入口：遍历所有 indicator 并输出 JSON
│   ├── config.py             # Indicator 注册表
│   ├── requirements.txt      # Python 依赖
│   └── indicators/
│       ├── base.py           # BaseIndicator 抽象基类
│       ├── sp500_pe.py       # S&P 500 PE 抓取器
│       ├── nasdaq_pe.py      # NASDAQ PE 抓取器 (yfinance)
│       └── vix.py            # VIX 抓取器 (yfinance)
├── data/                     # 自动生成的 JSON 数据文件
├── site/                     # Next.js 前端
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── components/
│   ├── next.config.js
│   └── package.json
├── CLAUDE.md                 # Claude Code Action 项目上下文
└── README.md
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

执行后会在 `data/` 目录生成 JSON 文件。

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

产物输出到 `site/out/`。

## Adding a New Indicator

1. 在 `fetcher/indicators/` 下新建 Python 文件，继承 `BaseIndicator`：

```python
from .base import BaseIndicator

class MyIndicator(BaseIndicator):
    name = "my_indicator"
    display_name = "My Indicator"
    description = "Description of what this indicator measures"

    def fetch(self) -> list[dict]:
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

3. （可选）在 `site/app/page.tsx` 的 `COLORS` 中添加对应颜色。

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Data Fetcher | Python 3.12, requests, BeautifulSoup4, yfinance |
| Frontend | Next.js 14, React 18, Recharts, TypeScript |
| Hosting | Self-hosted (`sspprriinngg.cn`) via rsync |
| CI/CD | GitHub Actions |
| AI Development | Claude Code Action (`anthropics/claude-code-action@v1`) |
