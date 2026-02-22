# Project Context for Claude

## Overview

Market Indicators Dashboard - 轻量级市场指标仪表盘，展示标普500、纳斯达克 PE 走势及 VIX 指数走势图。

## Project Structure

- `fetcher/` — Python 数据抓取模块
  - `indicators/base.py` — BaseIndicator 抽象基类
  - `indicators/` — 各指标抓取器（sp500_pe, nasdaq_pe, vix）
  - `config.py` — 指标注册表
  - `main.py` — 入口脚本
- `data/` — JSON 数据文件（自动生成，勿手动编辑）
- `site/` — Next.js 前端（App Router + TypeScript + Recharts）
  - `site/app/page.tsx` — 主页，读取 data/ 渲染图表
  - `site/app/components/` — React 组件
  - `site/next.config.js` — 静态导出配置

## Build & Test Commands

```bash
# 抓取数据
cd fetcher && pip install -r requirements.txt && python main.py

# 前端开发
cd site && npm install && npm run dev

# 前端构建（静态导出到 site/out/）
cd site && npm run build
```

## Adding a New Indicator

1. 在 `fetcher/indicators/` 下新建 Python 文件，继承 `BaseIndicator`
2. 实现 `fetch()` 方法，返回 `[{"date": "...", "value": ...}, ...]`
3. 在 `fetcher/config.py` 的 `INDICATORS` 列表中注册
4. （可选）在 `site/app/page.tsx` 的 `COLORS` 中添加颜色

## Conventions

- 前端使用 TypeScript，暗色主题
- 数据文件格式见 `data/*.json`，包含 name/display_name/description/updated_at/data 字段
- 提交信息用英文，简洁描述变更
- basePath 在正式部署时为 `/ai-me`
- 部署目标：`https://sspprriinngg.cn/ai-me/`
