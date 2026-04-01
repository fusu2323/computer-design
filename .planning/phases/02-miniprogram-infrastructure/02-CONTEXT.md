# Phase 2: 小程序基础架构 - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

WeChat Mini-Program foundation using Taro 4.x — scaffold, WeChat login flow, and daily ICH knowledge card on home page. Users can open the app, log in via WeChat auth, and see a daily non-heritage fact each time they open. This is Phase 2 of v1.1 (first phase in the mobile milestone).

</domain>

<decisions>
## Implementation Decisions

### Project Structure
- **D-01:** Taro 4.x project — Claude's discretion on exact directory structure (separate `miniprogram/` vs Taro within `frontend/`)

### Daily Knowledge Card
- **D-02:** Data source: Backend API (`/knowledge/daily` on FastAPI) — returns list of ICH facts
- **D-03:** Daily rotation: Client-side date hashing — `hash(date + userId)` to deterministically select one fact from API response
- **D-04:** Card content: Title + category tag + hero image + ICH fact text (no extra fields for Phase 2)

### WeChat Auth
- **D-05:** WeChat login via `wx.login()` — button triggers auth flow, session stored in WeChat storage

### Navigation & Pages
- **D-06:** Phase 2 scope: Home page only (daily card + login button)
- **D-07:** No tab bar in Phase 2 — navigation minimal

### Claude's Discretion
- Exact Taro project directory structure
- Taro + React 19 compatibility approach
- Specific UI component implementation details (login button styling, card layout)
- Package size optimization strategy

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### v1.1 Milestone
- `.planning/ROADMAP.md` §Phase 2 — Phase 2 goal, success criteria, requirements
- `.planning/REQUIREMENTS.md` — KNOW-01, KNOW-02 requirements for Phase 2

### Technical Decisions
- `.planning/STATE.md` §Technical Decisions — Taro 4.x, AI on FastAPI, GCJ-02 coordinates
- `.planning/STATE.md` §Technical Constraints — Package size <20MB, sharing restrictions

### v1.0 Completed
- `.planning/PROJECT.md` — Eastern aesthetics design system, component library
- `.planning/phases/01-ui-enhancement/01-CONTEXT.md` — Design system decisions (colors, components)
- `frontend/tailwind.config.js` — 6-color palette, custom fonts
- `frontend/src/index.css` — Existing utility classes (card-shadow, seal-border)

### Data Sources
- `shadow_puppet_knowledge_graph.json` — ICH knowledge data (crafts, facts, images)
- `shadow_puppet_simplified.json` — Simplified ICH data format

[No external specs — requirements fully captured in decisions above]

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 6-color Tailwind palette (墨黑, 朱红, 天青, 茶绿, 宣纸白, charcoal) — reuse in Taro mini-program
- Card component pattern — existing Card with hover shadow, can replicate in Taro
- Button component variants (primary, outline, ghost) — can be adapted for WeChat components
- framer-motion animations — NOT available in WeChat mini-program (different runtime)

### Established Patterns
- Eastern aesthetics: rice-paper backgrounds, ink gradients, seal-border decorations
- Card-shadow utility class: `0 4px 12px rgba(43, 43, 43, 0.08)`
- Font usage: calligraphy for headings, xiaowei for labels, serif for body

### Integration Points
- FastAPI backend already exists at port 8002
- `/knowledge/daily` endpoint needs to be created (new for Phase 2)
- WeChat login uses `wx.login()` API — no backend OAuth needed for Phase 2

### Constraints
- Taro compiles to WXML/WXSS — React patterns must be adapted
- WeChat storage (`wx.setStorage`) vs browser localStorage
- No framer-motion in mini-program — use Taro's animation APIs or CSS animations

</code_context>

<specifics>
## Specific Ideas

- Home page should feel like the existing web app — consistent Eastern aesthetics
- Daily card should be visually prominent — hero image, clean typography
- Login button should be natural — "微信登录" with WeChat icon, not intrusive

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-miniprogram-infrastructure*
*Context gathered: 2026-04-01*
