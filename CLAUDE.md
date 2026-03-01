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

## Automated Development Pipeline

本项目通过 Claude Code Action 实现 Issue 驱动自动开发：

1. 用户创建 Issue（标题/正文含 `@claude`）→ Claude 自动实现并提交 PR
2. PR 自动触发预览部署到 `sspprriinngg.cn/metric/preview/pr-N/`
3. 用户审核通过后 Merge → 自动部署到 `sspprriinngg.cn/metric/`

### GitHub Actions Workflows

| Workflow | 作用 |
|----------|------|
| `claude.yml` | Issue/PR 中 @claude 触发自动开发 |
| `preview.yml` | PR 预览部署（自动触发，Claude 不需要干预） |
| `deploy.yml` | 正式部署到服务器（合并到 main 后自动触发，Claude 不需要干预） |
| `cleanup-preview.yml` | PR 关闭后清理预览 |
| `update-data.yml` | 每小时抓取数据 |

### Claude 的职责边界

**Claude 只负责：**
- 阅读和理解代码
- 编写/修改代码
- 提交代码（git commit + push）
- 创建 Pull Request

**Claude 不要做（由 workflow 自动完成）：**
- 不要运行 `npm install` / `npm run build` 构建项目
- 不要 SSH 到服务器
- 不要执行部署操作
- 不要提供预览链接（preview.yml 会自动评论）

构建和部署完全由 `preview.yml` 和 `deploy.yml` 自动处理，Claude 提交 PR 后等待即可。

## Conventions

- 前端使用 TypeScript，暗色主题
- 数据文件格式见 `data/*.json`，包含 name/display_name/description/updated_at/data 字段
- 提交信息用英文，简洁描述变更
- basePath 在正式部署时为 `/metric`
- 部署目标：`https://sspprriinngg.cn/metric/`
- 部署方式：rsync over SSH 到 `/var/www/html/metric/`
