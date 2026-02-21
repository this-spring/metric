# Market Indicators Dashboard - 产品计划

## 目标

构建一个轻量级市场指标仪表盘，展示标普500、纳斯达克的 PE 走势及 VIX 指数历年走势图，每小时自动更新，支持自动化部署和指标扩展。

---

## 一、技术选型

| 层级 | 选择 | 理由 |
|------|------|------|
| **前端** | Next.js (App Router) + React | SSG/ISR 支持好，适合静态图表站点；Vercel 一键部署 |
| **图表** | Recharts | 轻量、React 原生、声明式 API，足够画折线图 |
| **数据获取** | Python 脚本 (data fetcher) | 生态成熟，yfinance / FRED API 获取金融数据方便 |
| **数据存储** | JSON 文件 (存入 `data/` 目录) | 零成本、Git 可追踪、前端直接 fetch |
| **定时任务** | GitHub Actions (cron) | 免费、可靠、每小时触发一次 |
| **部署** | GitHub Pages / Vercel | 自动化、零运维 |

---

## 二、数据源

| 指标 | 数据源 | 说明 |
|------|--------|------|
| S&P 500 PE (TTM) | multpl.com 抓取 / FRED API | 历史 PE 数据 |
| NASDAQ PE | Wall Street Journal / Yahoo Finance | 纳指 PE |
| VIX | Yahoo Finance (`^VIX`) | 恐慌指数，yfinance 直接拉取 |

---

## 三、项目结构

```
metric/
├── .github/
│   └── workflows/
│       └── update-data.yml        # GitHub Actions: 每小时抓取数据
├── fetcher/                       # Python 数据抓取模块
│   ├── requirements.txt
│   ├── config.py                  # 指标注册表 (可扩展)
│   ├── main.py                    # 入口：遍历指标、抓取、写 JSON
│   └── indicators/                # 各指标抓取器 (可扩展)
│       ├── __init__.py
│       ├── base.py                # 抽象基类 BaseIndicator
│       ├── sp500_pe.py            # S&P 500 PE
│       ├── nasdaq_pe.py           # NASDAQ PE
│       └── vix.py                 # VIX
├── data/                          # 抓取后的 JSON 数据
│   ├── sp500_pe.json
│   ├── nasdaq_pe.json
│   └── vix.json
├── site/                          # Next.js 前端
│   ├── package.json
│   ├── next.config.js
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # 主页：展示所有图表
│   │   └── components/
│   │       ├── ChartCard.tsx       # 通用图表卡片组件
│   │       └── IndicatorChart.tsx  # 折线图组件 (Recharts)
│   └── public/
└── README.md
```

---

## 四、核心设计：指标扩展机制

新增指标只需 **两步**：

### 1. 新建抓取器

在 `fetcher/indicators/` 下新建文件，继承 `BaseIndicator`：

```python
# fetcher/indicators/base.py
class BaseIndicator:
    name: str           # 指标英文名，也是 JSON 文件名
    display_name: str   # 前端显示名
    description: str    # 描述

    def fetch(self) -> list[dict]:
        """返回 [{"date": "2024-01-01", "value": 25.3}, ...] 格式数据"""
        raise NotImplementedError
```

### 2. 注册指标

在 `fetcher/config.py` 中添加到指标列表：

```python
INDICATORS = [
    "indicators.sp500_pe.SP500PE",
    "indicators.nasdaq_pe.NasdaqPE",
    "indicators.vix.VIX",
    # 新增: "indicators.your_new.YourNew",
]
```

前端会自动扫描 `data/*.json` 并渲染，无需改动前端代码。

---

## 五、自动化流水线

```
GitHub Actions (每小时 cron)
    │
    ├─ 1. checkout 代码
    ├─ 2. 安装 Python 依赖
    ├─ 3. 运行 fetcher/main.py → 更新 data/*.json
    ├─ 4. 如果数据有变化 → git commit + push
    └─ 5. 触发前端部署 (Vercel webhook 或 GitHub Pages build)
```

GitHub Actions cron 表达式: `0 * * * *` (每小时整点)

---

## 六、实施步骤

### Phase 1: 数据层
- [ ] 初始化项目结构
- [ ] 实现 `BaseIndicator` 抽象基类
- [ ] 实现 S&P 500 PE 抓取器
- [ ] 实现 NASDAQ PE 抓取器
- [ ] 实现 VIX 抓取器
- [ ] 编写 `main.py` 入口，生成 JSON 数据文件

### Phase 2: 前端
- [ ] 初始化 Next.js 项目
- [ ] 实现 `IndicatorChart` 折线图组件
- [ ] 实现 `ChartCard` 卡片组件
- [ ] 实现主页，自动加载所有指标数据并渲染图表
- [ ] 响应式布局适配

### Phase 3: 自动化与部署
- [ ] 编写 GitHub Actions workflow (每小时抓取)
- [ ] 配置 GitHub Pages 或 Vercel 自动部署
- [ ] 端到端测试整条流水线

### Phase 4: 后续可选扩展
- [ ] 添加更多指标 (席勒 PE、巴菲特指标、国债收益率等)
- [ ] 添加时间范围筛选 (1Y / 5Y / 10Y / MAX)
- [ ] 添加指标对比叠加功能
- [ ] 添加暗色主题
