# 数字传承人 (The Digital Inheritor)

## What This Is

AI 驱动的非遗 (ICH) 工艺教学与复原系统，通过多智能体协作（视觉导师、知识馆长、创意艺匠）实现"能看、能听、会画"的数字化非遗传承。移动端小程序作为轻量入口，聚焦知识学习与地理探索场景。

## Core Value

让每一位用户都能成为"数字传承人"——通过 AI 实时指导、知识图谱和创意工具，降低非遗学习门槛，实现中华优秀传统文化的数字化传承。

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Current Milestone: v1.1 移动端非遗体验

**Goal:** 在微信小程序上打造移动端非遗体验，聚焦知识学习和地理探索两大场景

**Target features:**
- [ ] 每日非遗知识 + 打卡 — 每天推送非遗知识，结合签到成就系统
- [ ] 全国非遗地图 — 中国地图视角，标点跳转文化介绍
- [ ] AR 非遗滤镜 — 摄像头叠加纹样，拍照/视频分享
- [ ] LBS 非遗地图 — 附近传承人/博物馆，导航跳转
- [ ] 微创作 + 分享社区 — 纹样拼贴/涂色，app 内分享

## Requirements

### Validated

<!-- v1.0 shipped -->

- ✓ UI 框架 — React 前端完成，东方美学设计系统
- ✓ 视觉导师 Agent (前端) — MediaPipe 手部追踪界面
- ✓ 知识馆长 Agent (前端) — 问答界面框架
- ✓ 创意艺匠 Agent (前端) — 创意工作室界面

### Active

<!-- v1.1 scope -->

- [ ] KNOW-01: 每日非遗知识推送
- [ ] KNOW-02: 签到成就系统
- [ ] MAP-01: 全国非遗地图展示
- [ ] MAP-02: 标点跳转非遗文化介绍
- [ ] AR-01: AR 非遗滤镜
- [ ] LBS-01: LBS 附近传承人/博物馆
- [ ] CREATE-01: 微创作工具
- [ ] CREATE-02: 分享社区

### Out of Scope

- 视觉导师手势练习（重量级，需配合 web） — 移动端不适合重度手势追踪
- Stable Diffusion 生图（重量级） — 保留给 web 端 Creative Artisan
- 文物扫描识别（v1.2） — 需要图像识别模型
- 非遗声音采集（v1.2） — 需要音频录制和存储

## Context

### 技术环境

- **现有 Web 后端**: FastAPI + Neo4j 知识图谱 + LangChain
- **现有数据**: shadow_puppet_* 系列 JSON（非遗知识、QA、RAG 数据）
- **现有前端**: React 19 + TypeScript + Vite + Tailwind CSS

### 移动端策略

- 微信小程序作为轻量入口
- 调用现有后端 API 获取知识数据
- 生成内容（AR 照片、创作）可同步至 web 端
- 避免将重量级 AI 功能移植到小程序

## Constraints

- **平台限制**: 微信小程序 API 限制（无桌面端能力）
- **性能限制**: 小程序包体积 ≤ 20MB
- **数据依赖**: 依赖现有 Neo4j 知识图谱 API
- **分享限制**: 微信内分享受限，需使用小程序码/海报

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 微信小程序技术栈 | 微信生态，低门槛，高传播性 | — Pending |
| 小程序做"轻量前端" | 重量级 AI 功能留在 web | — Pending |
| 知识 + 地图为 MVP | 移动端碎片化学习最适合 | — Pending |

---

*Last updated: 2026-04-01 after v1.1 milestone started*
