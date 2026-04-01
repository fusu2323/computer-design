# Phase 3: 全国非遗地图 + LBS - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

用户在地图上探索全国非遗点位，发现附近的传承人和博物馆，并导航前往。交付：全国地图视图、附近 LBS 发现、非遗文化介绍卡片、微信地图导航。创作（Phase 4）和知识学习（Phase 2）是独立 phases。

</domain>

<decisions>
## Implementation Decisions

### Map Library
- **D-01:** WeChat native `<map>` component — GCJ-02 native, no extra SDK, keeps package under 20MB
- **D-02:** Custom JS grid-based clustering — divide viewport into grid cells, show count badge on cluster markers

### Clustering Behavior
- **D-03:** Zoom-based clustering threshold: cluster when map zoom < 8 (province-level), individual markers at zoom ≥ 8 (city/street level)

### Map Data Loading
- **D-04:** Load all ICH site markers from API on map load — all upfront fetch, fast local filtering for LBS
- **D-05:** Data source: FastAPI endpoint querying Neo4j knowledge graph for ICH sites with coordinates (follows Phase 2 API pattern)

### Marker Tap Overlay
- **D-06:** Rich bottom sheet overlay — slides up from bottom on marker tap
- **D-07:** Overlay content: ICH name + category tag + location + short description + hero image (if available) + "导航" button

### Navigation
- **D-08:** "导航" button uses `wx.openLocation({ latitude, longitude, name, address })` — opens WeChat native map with navigation

### LBS Discovery
- **D-09:** Radius presets: 1km, 5km, 10km, 20km — horizontal tab/pill selector, user taps to select
- **D-10:** Category filter chips — horizontal scrollable chip row above map, tap to filter by ICH category (刺绣, 陶瓷, 剪纸, etc.)

### Claude's Discretion
- Exact cluster marker visual design (count badge style)
- Bottom sheet animation and gesture behavior
- Map initial center/zoom (likely China center or user's region)
- Marker icon visual design (ICH category icons vs generic pin)
- Specific ICH categories to include in filter (derive from Neo4j data)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### v1.1 Milestone
- `.planning/ROADMAP.md` §Phase 3 — Phase 3 goal, success criteria, requirements (MAP-01 through MAP-04)
- `.planning/REQUIREMENTS.md` — MAP-01, MAP-02, MAP-03, MAP-04 requirements

### Phase 2 Context (carried forward)
- `.planning/phases/02-miniprogram-infrastructure/02-CONTEXT.md` — Taro project structure, WeChat API patterns, Eastern aesthetics decisions
- `.planning/STATE.md` §Technical Decisions — GCJ-02 coordinate system, AI on FastAPI, Phase order
- `.planning/STATE.md` §Technical Constraints — Package size <20MB, sharing restrictions

### v1.0 Completed
- `.planning/PROJECT.md` — Eastern aesthetics design system, 6-color Tailwind palette
- `.planning/phases/01-ui-enhancement/01-CONTEXT.md` — Design system decisions
- `frontend/tailwind.config.js` — 6-color palette (墨黑, 朱红, 天青, 茶绿, 宣纸白, charcoal)

### Backend Integration
- `.planning/codebase/INTEGRATIONS.md` — Neo4j connection details, existing endpoint patterns
- `backend/app/api/endpoints/knowledge_curator.py` — Existing RAG/knowledge endpoint to follow as pattern

[No external specs — requirements fully captured in decisions above]

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 6-color Tailwind palette — apply to marker category colors and bottom sheet styling
- Card component pattern from Phase 2 — bottom sheet can reuse card styling
- Eastern aesthetics: rice-paper backgrounds, ink gradients — apply to map markers and overlay

### Established Patterns
- WeChat API patterns: `wx.login()`, `wx.getLocation({type: 'gcj02'})`, `wx.openLocation()`
- Taro page structure: `pages/<name>/index.js` + `.wxml` + `.wxss` + `.json`
- FastAPI endpoint pattern: existing in `backend/app/api/endpoints/`

### Integration Points
- New FastAPI endpoint needed: `/map/markers` — returns list of ICH sites with lat/lng/category/name
- New FastAPI endpoint needed: `/map/nearby?lat=&lng=&radius=` — returns ICH sites within radius
- WeChat `wx.getLocation({type: 'gcj02'})` for user's current location (requires user permission)
- Neo4j knowledge graph for ICH site coordinates (already exists)

### Constraints
- WeChat native map `<map>` component only — no third-party SDK for package size
- GCJ-02 coordinates only — all lat/lng stored and displayed in GCJ-02
- Package size limit 20MB — no heavy map SDK dependencies

</code_context>

<specifics>
## Specific Ideas

- Map markers should feel consistent with the app's Eastern aesthetics — consider using traditional pattern icons for different ICH categories
- Bottom sheet should feel native — smooth slide-up animation, swipe down to dismiss
- Category chips should be visually prominent — horizontal scroll with clear active/inactive states

</specifics>

<deferred>
## Deferred Ideas

None — all discussion stayed within Phase 3 scope

</deferred>

---

*Phase: 03-lbs*
*Context gathered: 2026-04-01*
