# Phase 4: 微创作 + 分享 - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

用户可以使用预设纹样线稿进行填色创作，保存到相册，并通过微信分享。交付：纹样模板选择、填色画布、颜色调色板、保存相册、微信分享。属于 v1.1 第三个 phase，与地图和知识学习平行。

</domain>

<decisions>
## Implementation Decisions (Draft — to be confirmed in planning)

### Canvas Library
- **D-01:** WeChat native `<canvas>` component — no third-party canvas SDK, keeps package under 20MB
- **D-02:** Flood-fill algorithm (scanline) — for tap-to-fill areas in line art

### Template System
- **D-03:** 4–6 predefined ICH pattern line art templates (SVG → PNG/canvas paths stored as JSON)
- **D-04:** Templates cover different ICH categories: 刺绣轮廓, 剪纸窗花, 陶瓷纹样, 编织图案

### Color Palette
- **D-05:** 12-color preset palette derived from Eastern aesthetics — 朱红, 天青, 茶绿, 墨黑, 宣纸白, 赭石, 石绿, 藤黄, 绛紫, 湖蓝, 泥金, 铅白
- **D-06:** Each color stored as {name, hex} — palette displayed as tappable swatches

### Canvas Interaction
- **D-07:** Tap on a closed region → fills with selected color
- **D-08:** Flood-fill via `canvasContext.getImageData` + scanline algorithm (not quadratic expansion)
- **D-09:** Line art rendered as canvas paths (semi-transparent fill on white background)

### Save to Album
- **D-10:** `wx.canvasToTempFilePath` → `wx.saveImageToPhotosAlbum` (requires user authorization)
- **D-11:** Auto-generate a thumbnail for creation history

### Sharing
- **D-12:** `wx.showShareMenu` + `onShareAppMessage` — share as mini-program card with canvas as background
- **D-13:** `wx.shareFileMessage` NOT available — use canvas-generated poster image via `wx.canvasToTempFilePath` + "发送给朋友" API

### Creation History
- **D-14:** Local storage via `wx.setStorage` / `wx.getStorage` — store array of {id, templateId, colorMap, thumbnail, timestamp}
- **D-15:** New page: `/pages/history/index` — gallery grid of saved creations, tap to view full size

### Claude's Discretion
- Exact line art SVG templates (which patterns to include)
- Flood-fill tolerance threshold for tap accuracy
- UI layout of palette (horizontal strip vs popup)
- Canvas tap detection (point-in-region algorithm)

</decisions>

<canonical_refs>
## Canonical References

### v1.1 Milestone
- `.planning/ROADMAP.md` §Phase 4 — Phase 4 goal, success criteria, requirements (CREATE-01 through CREATE-03)
- `.planning/REQUIREMENTS.md` — CREATE-01, CREATE-02, CREATE-03 requirements

### Phase 2 & 3 Context (carried forward)
- `.planning/phases/02-miniprogram-infrastructure/02-CONTEXT.md` — Taro project structure, WeChat API patterns, Eastern aesthetics decisions
- `.planning/phases/03-lbs/03-CONTEXT.md` — WeChat native component patterns, storage patterns
- `.planning/STATE.md` §Technical Decisions — GCJ-02 coordinate system, AI on FastAPI, Phase order
- `.planning/STATE.md` §Technical Constraints — Package size <20MB, sharing restrictions

### v1.0 Completed
- `.planning/PROJECT.md` — Eastern aesthetics design system, 6-color Tailwind palette
- `.planning/phases/01-ui-enhancement/01-CONTEXT.md` — Design system decisions
- `frontend/tailwind.config.js` — 6-color palette (墨黑, 朱红, 天青, 茶绿, 宣纸白, charcoal)

### Existing Miniprogram Code
- `miniprogram/pages/map/index.js` — WeChat API usage patterns (wx.getLocation, wx.request, wx.showToast, wx.openLocation)
- `miniprogram/utils/map.js` — API calling pattern, utility module structure
- `miniprogram/app.json` — Page routing and window config

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 6-color Tailwind palette — extend to 12-color Eastern aesthetics palette for coloring
- WeChat API patterns from Phase 3: `wx.request`, `wx.showToast`, `wx.getStorage`/`wx.setStorage`
- Eastern aesthetics design patterns from home page: rice-paper backgrounds, ink gradients

### Established Patterns
- Taro page structure: `pages/<name>/index.js` + `.wxml` + `.wxss` + `.json`
- WeChat API callback pattern: `wx.someAPI({ success: () => {}, fail: () => {} })`
- Utils modules: `utils/<name>.js` with `module.exports = { ... }`

### Integration Points
- No new backend endpoints needed for Phase 4 — all local
- `wx.canvasToTempFilePath` for canvas export
- `wx.saveImageToPhotosAlbum` for album save
- `wx.showShareMenu` + `onShareAppMessage` for WeChat sharing
- `wx.getStorage`/`wx.setStorage` for creation history

### Constraints
- Canvas flood-fill must be performant on mid-range devices (avoid O(n²) algorithms)
- WeChat `canvasToTempFilePath` requires canvas to be rendered (not hidden)
- Album save requires user authorization (use `wx.authorize` for `scope.writePhotosAlbum`)
- Package size: keep canvas logic in main package, no new SDKs

</code_context>

<specifics>
## Specific Ideas

- Line art templates should feel authentically ICH — 刺绣针法轮廓, 传统窗花, 青花瓷纹
- Color palette should have a "more colors" expander — 12 colors visible, 24 total available
- Canvas should have "undo" (restore last state) and "clear" (reset to original line art)
- Creation history as a gallery — masonry or grid layout with creation thumbnails
- Share generates a "poster" — canvas with the colored art + app QR code overlay

</specifics>

<deferred>
## Deferred Ideas

- AR overlay of pattern on camera (CREATE-04, MAP-05) — defer to v2
- Community feed of user creations — defer to v2 (UGC policy)
- Stable Diffusion re-coloring suggestions — heavy AI, stays on FastAPI

</deferred>

---

*Phase: 04-creation*
*Context gathered: 2026-04-05*
