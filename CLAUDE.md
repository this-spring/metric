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
| `preview.yml` | PR 预览部署 |
| `deploy.yml` | 正式部署到服务器 |
| `cleanup-preview.yml` | PR 关闭后清理预览 |
| `update-data.yml` | 每小时抓取数据 |

## Server Management

Claude 在 GitHub Actions 中运行时，拥有对生产服务器的 SSH 访问权限，可以直接管理服务器。

### SSH 连接方式

```bash
ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "<command>"
```

环境变量 `DEPLOY_USER` 和 `DEPLOY_HOST` 已在 workflow 中设置。

### 服务器信息

- 主机：`sspprriinngg.cn`
- 操作系统：CentOS（nginx/1.14.1）
- Web 服务器：nginx
- 站点根目录：`/var/www/html/`
- Metric 站点目录：`/var/www/html/metric/`
- Nginx 配置目录：`/etc/nginx/` （主配置 `/etc/nginx/nginx.conf`，站点配置 `/etc/nginx/conf.d/`）

### 常见运维操作

| 操作 | 命令 |
|------|------|
| 查看 nginx 配置 | `nginx -T` |
| 测试 nginx 配置 | `nginx -t` |
| 重载 nginx | `nginx -s reload` |
| 查看站点文件 | `ls -la /var/www/html/metric/` |
| 查看 nginx 错误日志 | `tail -50 /var/log/nginx/error.log` |
| 查看 nginx 访问日志 | `tail -50 /var/log/nginx/access.log` |

### 注意事项

- 修改 nginx 配置前，务必先用 `nginx -t` 验证
- 操作前先检查当前状态，避免覆盖已有配置
- 对于破坏性操作（如删除文件、修改系统配置），应在 Issue/PR 中说明原因

## 测试部署流程

当需要部署到测试目录让用户预览时，按以下步骤执行：

```bash
# 1. 准备数据
mkdir -p site/public/data && cp data/*.json site/public/data/

# 2. 构建（使用测试 basePath）
cd site && npm ci && NEXT_PUBLIC_BASE_PATH=/metric/test npm run build

# 3. 验证构建产物存在
ls site/out/index.html

# 4. 部署到测试目录
ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p /var/www/html/metric/test/"
rsync -avz --delete -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" site/out/ ${DEPLOY_USER}@${DEPLOY_HOST}:/var/www/html/metric/test/

# 5. 验证部署成功（必须返回 200）
curl -s -o /dev/null -w "%{http_code}" https://sspprriinngg.cn/metric/test/
```

**重要：每一步都必须检查返回值，任何一步失败都要如实报告错误，不能标记为完成。**

测试地址：`https://sspprriinngg.cn/metric/test/`

## 验证规则（必须遵守）

- 构建后必须确认 `site/out/index.html` 存在
- 部署后必须用 `curl` 验证 URL 返回 HTTP 200
- 如果任何命令失败或返回错误码，**禁止**在任务清单中标记为 ✅
- 如实报告错误信息，让用户知道哪一步出了问题

## Conventions

- 前端使用 TypeScript，暗色主题
- 数据文件格式见 `data/*.json`，包含 name/display_name/description/updated_at/data 字段
- 提交信息用英文，简洁描述变更
- basePath 在正式部署时为 `/metric`
- 部署目标：`https://sspprriinngg.cn/metric/`
- 部署方式：rsync over SSH 到 `/var/www/html/metric/`
