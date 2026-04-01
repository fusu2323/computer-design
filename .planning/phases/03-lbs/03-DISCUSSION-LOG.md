# Phase 3: 全国非遗地图 + LBS - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 03-lbs
**Mode:** discuss
**Areas discussed:** Map library + clustering, Markers data source + overlay content, LBS discovery scope

---

## Map Library + Clustering

| Option | Description | Selected |
|--------|-------------|----------|
| WeChat native + custom clustering | Use `<map>` component + JS grid-based clustering. No extra SDK, keeps package small. | ✓ |
| WeChat native + Tencent LBS plugin | Use `<map>` component + Tencent's LBS mini-program plugin for built-in clustering. ~1MB extra package. | |
| Amap (高德地图) SDK | Use 高德地图 SDK for better clustering OOTB. Extra package size (~2-5MB), different API. | |
| You decide | Skip detailed discussion. | |

**User's choice:** WeChat native + custom clustering
**Notes:** User confirmed recommended option.

### Clustering threshold follow-up

| Option | Description | Selected |
|--------|-------------|----------|
| Zoom-based | Cluster when zoom < 8 (province-level), individual markers at zoom ≥ 8. Natural behavior. | ✓ |
| Density-based | Cluster when >5 markers overlap in viewport. Adapts to density. | |
| Always cluster at national view | Cluster at initial load, show individual at zoom ≥ 10. Simple rule. | |

**User's choice:** Zoom-based (Recommended)
**Notes:** Cluster at zoom < 8, individual markers at zoom ≥ 8.

---

## Markers Data Source + Overlay Content

### Overlay content

| Option | Description | Selected |
|--------|-------------|----------|
| Rich overlay | ICH name + category tag + location + description + image + "导航" button. Most engaging. | ✓ |
| Minimal overlay | ICH name + category tag + "查看详情" link only. Simpler. | |
| You decide | | |

**User's choice:** Rich overlay (Recommended)
**Notes:** User confirmed recommended option.

### Overlay UX

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom sheet | Slides up from bottom — more content space, native mobile pattern. | ✓ |
| Marker callout bubble | Small bubble above marker pin — limited space. | |
| Full-screen card | Takes over whole screen — max content, interrupts map flow. | |

**User's choice:** Bottom sheet (Recommended)
**Notes:** User confirmed recommended option.

### Data loading

| Option | Description | Selected |
|--------|-------------|----------|
| All markers upfront | Load all ICH site markers from API on map load. Fast local filtering. | ✓ |
| Viewport-based lazy load | Load only visible viewport markers. Triggers API on pan/zoom. | |
| Region-bounded initial load | Load markers for user's current province only on first load. | |

**User's choice:** All markers upfront (Recommended)
**Notes:** User confirmed recommended option.

---

## LBS Discovery Scope

### Radius selector

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed presets | 1km, 5km, 10km, 20km. User taps to select. Simple and sufficient. | ✓ |
| Slider for custom radius | Continuous slider 1km to 50km. More flexible but complex UI. | |
| Fixed 5km only | Always 5km. Simplest but least flexible. | |

**User's choice:** Fixed presets (Recommended)
**Notes:** User confirmed recommended option.

### Category filter

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — category filter chips | Horizontal scrollable chips above map. Tap to filter. | ✓ |
| No filter | Show all ICH categories at once. Busier at national zoom. | |
| Advanced filter page | Dedicated full-screen filter. More powerful but more clicks. | |

**User's choice:** Yes — category filter chips (Recommended)
**Notes:** User confirmed recommended option.

### Navigation behavior

| Option | Description | Selected |
|--------|-------------|----------|
| wx.openLocation | Opens WeChat native map with navigation. Seamless, no extra permissions. | ✓ |
| In-app map navigation | Stay inside mini-program using WeChat's navigateToMap API. | |

**User's choice:** wx.openLocation (Recommended)
**Notes:** User confirmed recommended option.

---

## Deferred Ideas

None — all discussion stayed within Phase 3 scope.

---

*Discussion log: 2026-04-01*
