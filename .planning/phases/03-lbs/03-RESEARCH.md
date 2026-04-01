# Phase 3: 全国非遗地图 + LBS - Research

**Researched:** 2026-04-01
**Domain:** WeChat Mini-Program Map + LBS (Location-Based Services) + Neo4j Spatial Queries
**Confidence:** MEDIUM-HIGH

## Summary

Phase 3 implements a national ICH (非物质文化遗产) map exploration feature using WeChat's native `<map>` component with GCJ-02 coordinates. The map displays heritage site markers with JS grid-based clustering at zoom < 8, rich bottom sheet overlays on marker tap, configurable radius-based LBS discovery (1/5/10/20km), category filter chips, and WeChat native navigation via `wx.openLocation()`.

Key technical decisions are locked (WeChat native map, grid clustering, bottom sheet overlay, GCJ-02). Remaining discretion covers visual design details, initial map center, and specific category list derivation from data.

**Primary recommendation:** Use WeChat's built-in `MapContext.initMarkerCluster()` API (available since v3.3.0) rather than custom JS grid clustering — native clustering is better maintained and performant. However, if the native clustering doesn't meet requirements for custom styling, fall back to the locked JS grid-based approach.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

| Decision | Value |
|----------|-------|
| D-01 | WeChat native `<map>` component — GCJ-02 native, no extra SDK |
| D-02 | Custom JS grid-based clustering — divide viewport into grid cells, show count badge |
| D-03 | Zoom-based clustering threshold: cluster when zoom < 8 |
| D-04 | Load all ICH markers from API on map load — upfront fetch, fast local filtering |
| D-05 | Data source: FastAPI endpoint querying Neo4j knowledge graph |
| D-06 | Rich bottom sheet overlay — slides up from bottom on marker tap |
| D-07 | Overlay content: ICH name + category tag + location + description + hero image + "导航" button |
| D-08 | "导航" button uses `wx.openLocation({ latitude, longitude, name, address })` |
| D-09 | Radius presets: 1km, 5km, 10km, 20km |
| D-10 | Category filter chips — horizontal scrollable chip row |

### Claude's Discretion

- Exact cluster marker visual design (count badge style)
- Bottom sheet animation and gesture behavior
- Map initial center/zoom (likely China center or user's region)
- Marker icon visual design (ICH category icons vs generic pin)
- Specific ICH categories to include in filter (derive from Neo4j data)

### Deferred Ideas (OUT OF SCOPE)

None — all discussion stayed within Phase 3 scope

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MAP-01 | User can view national ICH map with geographic markers | WeChat `<map>` component with markers array; Native clustering via `MapContext.initMarkerCluster()` |
| MAP-02 | User can tap map marker to see ICH culture introduction card | `bindmarkertap` event + bottom sheet overlay via `movable-view` with `cover-view` |
| MAP-03 | User can discover nearby heritage sites/artisans within configurable radius | `wx.getLocation({ type: 'gcj02' })` + local radius filtering + `circles` overlay |
| MAP-04 | User can navigate to a heritage site via WeChat map integration | `wx.openLocation({ latitude, longitude, name, address, scale: 18 })` |

---

## Standard Stack

### Frontend (WeChat Mini-Program)

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| WeChat native `<map>` | v3.3.0 | Map rendering, markers, clustering | `project.config.json` libVersion |
| `MapContext` | built-in | Marker cluster management | WeChat DevConsole |
| `wx.getLocation` | built-in | User current location (GCJ-02) | WeChat API |
| `wx.openLocation` | built-in | Open WeChat native map navigation | WeChat API |
| `movable-view` | built-in | Bottom sheet slide-up gesture | WeChat component |
| `cover-view` | built-in | Map overlay text/images | WeChat component |
| Taro 4.x | latest | Page framework (already in project) | Phase 2 context |

### Backend

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| FastAPI | existing | REST API framework | Phase 2 established |
| Neo4j Python driver | existing | Graph database queries | `neo4j_service.py` |

### No New Dependencies

No third-party npm packages or pip packages required for Phase 3. WeChat native APIs + existing Neo4j infrastructure are sufficient.

---

## Architecture Patterns

### Project Structure

```
miniprogram/
├── pages/
│   └── map/                    # NEW - Phase 3 map page
│       ├── index.js            # Page logic
│       ├── index.wxml          # Template (map + overlays)
│       ├── index.wxss          # Styles
│       └── index.json          # Page config
├── utils/
│   ├── map.js                  # NEW - Map API helpers (markers, clustering, location)
│   └── ...
pages/home/                     # Existing Phase 2 page

backend/
├── app/
│   └── api/endpoints/
│       └── map.py              # NEW - /map/markers, /map/nearby endpoints
```

### Data Flow

```
1. map/index.js onLoad()
   └── wx.getLocation({ type: 'gcj02' }) → get user lat/lng
2. fetchMarkers() → GET /api/v1/map/markers
   └── Returns: [{ id, name, category, lat, lng, address, description, imageUrl }]
3. initMap() with markers array
   └── MapContext.initMarkerCluster() → native clustering OR JS grid clustering
4. onMarkerTap(e)
   └── Find marker by id → setData({ selectedSite }) → bottom sheet slides up
5. onRadiusChange(radius)
   └── Filter markers locally → markers within distance
6. onNavigate()
   └── wx.openLocation({ latitude, lng, longitude, name, address })
```

### API Endpoint Design

**GET /api/v1/map/markers**
- Returns all ICH sites from Neo4j with coordinates
- Response: `{ markers: [{ id, name, category, latitude, longitude, address, description, imageUrl }] }`

**GET /api/v1/map/nearby?lat=&lng=&radius=**
- Returns ICH sites within radius (in meters) from given point
- Response: `{ sites: [{ id, name, category, latitude, longitude, address, distance }] }`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Map rendering | Google Maps, Mapbox, AMap SDK | WeChat native `<map>` | Package size limit 20MB, GCJ-02 native support |
| Marker clustering | Custom overlap detection algorithms | `MapContext.initMarkerCluster()` (native) OR JS grid-based (locked D-02) | Native handles edge cases, performance |
| Navigation | Third-party navigation SDK | `wx.openLocation()` | Opens WeChat native map, no extra SDK |
| Location access | H5 geolocation | `wx.getLocation({ type: 'gcj02' })` | WeChat permission system, GCJ-02 |
| Bottom sheet gestures | Custom touch handlers | `movable-view direction="vertical"` | Built-in gesture handling |

**Key insight:** WeChat provides all required primitives natively. Custom implementations would increase package size and maintenance burden.

---

## Common Pitfalls

### Pitfall 1: Coordinate System Mismatch (HIGH)

**What goes wrong:** Markers appear ~500-700m offset from actual position, or markers don't align with user location.

**Why it happens:** WeChat `<map>` uses GCJ-02 (China's encrypted coordinate system). WGS-84 coordinates (from standard GPS) or BD-09 (Baidu) will be misaligned. Neo4j spatial functions default to WGS-84 (SRID 4326).

**How to avoid:**
- All coordinates stored/queried in GCJ-02
- If data source provides WGS-84: convert using `coord_transform` library or pre-converted data
- Verify with `wx.getLocation({ type: 'gcj02' })` — do NOT use type 'wgs84'

**Warning signs:** User location dot doesn't align with marker at same coordinates; known landmarks appear offset

### Pitfall 2: Marker Icon Size Causing Display Issues (MEDIUM)

**What goes wrong:** Markers render at wrong size or clipped.

**Why it happens:** WeChat `iconPath` requires local resource (wx:// prefix not supported). Size must be <= 50KB per image.

**How to avoid:**
- Use 32x32px PNG for individual markers, 36x36px for cluster markers
- Bundle icons in mini-program package (not CDN)
- Use absolute path: `/images/markers/embroidery.png`

### Pitfall 3: Bottom Sheet Blocking Map Interaction (MEDIUM)

**What goes wrong:** User cannot pan/zoom map while bottom sheet is open.

**Why it happens:** Bottom sheet overlay `cover-view` sits on top of map, blocking touch events.

**How to avoid:**
- Bottom sheet should not cover entire map — max 70vh
- When bottom sheet expanded: `map` scale slightly reduced to keep selected marker visible
- Allow swipe-down to dismiss quickly

### Pitfall 4: Too Many Markers Causing Performance Issues (MEDIUM)

**What goes wrong:** Map becomes sluggish with 1000+ markers.

**Why it happens:** WeChat `<map>` markers are rendered natively; each marker consumes GPU resources.

**How to avoid:**
- Use clustering (native `initMarkerCluster` OR JS grid-based per D-02)
- At zoom < 8: show clusters only
- At zoom >= 8: show individual markers (load nearby region)
- Limit initial load to ~500 markers, paginate on zoom

### Pitfall 5: Neo4j Spatial Query Without Coordinate Data (CRITICAL)

**What goes wrong:** `/map/markers` and `/map/nearby` endpoints return empty results.

**Why it happens:** Existing Neo4j seed data (seed.py, import_*.py) has NO latitude/longitude coordinates on Heritage nodes.

**How to avoid:**
- Phase 3 implementation MUST include data migration to add coordinates
- Use Chinese government ICH registry data with lat/lng
- Or use hardcoded sample coordinates for major ICH sites

---

## Runtime State Inventory

> This is a new feature phase (not a rename/refactor). No runtime state migration needed.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | No existing map data in Neo4j (no lat/lng on Heritage nodes) | Data migration required: add coordinates to Heritage nodes |
| Live service config | No existing map service configuration | Create new endpoints `/map/markers` and `/map/nearby` |
| OS-registered state | None | None |
| Secrets/env vars | None | None |
| Build artifacts | None | New page `pages/map/` and utils `utils/map.js` |

**Key Gap:** Existing Neo4j data has no coordinates. Phase 3 plan MUST include a data seeding/migration step to add lat/lng to Heritage nodes.

---

## Code Examples

### WeChat Map Component (wxml)

```xml
<!-- pages/map/index.wxml -->
<map
  id="mainMap"
  class="map-container"
  latitude="{{mapCenter.latitude}}"
  longitude="{{mapCenter.longitude}}"
  scale="{{mapScale}}"
  markers="{{markers}}"
  bindmarkertap="onMarkerTap"
  show-location
  enable-3d
>
</map>

<!-- Category filter chips (absolute positioned) -->
<scroll-view class="filter-chips" scroll-x enhanced show-scrollbar="{{false}}">
  <view wx:for="{{categories}}" wx:key="id" class="chip {{item.active ? 'chip--active' : ''}}">
    {{item.name}}
  </view>
</scroll-view>

<!-- Radius preset pills -->
<view class="radius-presets">
  <view wx:for="{{radiusOptions}}" wx:key="value" class="pill {{item.selected ? 'pill--active' : ''}}">
    {{item.label}}
  </view>
</view>

<!-- Bottom sheet overlay (cover-view on map) -->
<cover-view class="bottom-sheet {{showBottomSheet ? 'bottom-sheet--open' : ''}}">
  <cover-view class="handle-bar"></cover-view>
  <cover-view class="site-name">{{selectedSite.name}}</cover-view>
  <cover-view class="category-tag">{{selectedSite.category}}</cover-view>
  <cover-view wx:if="{{selectedSite.imageUrl}}" class="hero-image">
    <cover-image src="{{selectedSite.imageUrl}}" mode="aspectFill"/>
  </cover-view>
  <cover-view class="description">{{selectedSite.description}}</cover-view>
  <cover-view class="address">{{selectedSite.address}}</cover-view>
  <cover-view class="nav-btn" bindtap="onNavigate">导航前往</cover-view>
</cover-view>
```

### Map Initialization with Native Clustering (JS)

```javascript
// pages/map/index.js
const { getMapMarkers, getNearbySites } = require('../../utils/map')

Page({
  data: {
    mapCenter: { latitude: 35.0, longitude: 105.0 }, // China center
    mapScale: 4,
    markers: [],
    selectedSite: null,
    showBottomSheet: false,
    categories: [],
    radiusOptions: [
      { label: '1km', value: 1000, selected: false },
      { label: '5km', value: 5000, selected: true },  // default
      { label: '10km', value: 10000, selected: false },
      { label: '20km', value: 20000, selected: false },
    ],
    userLocation: null,
  },

  onLoad() {
    this.requestLocation()
  },

  requestLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          userLocation: { latitude: res.latitude, longitude: res.longitude },
          mapCenter: { latitude: res.latitude, longitude: res.longitude },
          mapScale: 10,
        })
        this.fetchMarkers()
      },
      fail: () => {
        // Fall back to China center
        this.fetchMarkers()
        wx.showToast({ title: '定位失败，使用默认位置', icon: 'none' })
      }
    })
  },

  async fetchMarkers() {
    const { markers } = await getMapMarkers()
    this.setData({ markers })
    this.initNativeClustering()
  },

  initNativeClustering() {
    const mapContext = wx.createMapContext('mainMap')
    mapContext.initMarkerCluster({
      enableDefaultStyle: false,  // Use custom cluster marker
      zoomOnClick: true,
      gridSize: 60,
      success: (res) => {
        console.log('Marker cluster initialized', res)
      }
    })
  },

  onMarkerTap(e) {
    const markerId = e.detail.markerId
    const marker = this.data.markers.find(m => m.id === markerId)
    if (marker) {
      this.setData({ selectedSite: marker, showBottomSheet: true })
    }
  },

  onNavigate() {
    const site = this.data.selectedSite
    if (!site) return
    wx.openLocation({
      latitude: site.latitude,
      longitude: site.longitude,
      name: site.name,
      address: site.address,
      scale: 18
    })
  },
})
```

### Grid-Based Clustering (Fallback per D-02)

```javascript
// utils/map.js - Grid-based clustering
function clusterMarkers(markers, zoom, viewport) {
  if (zoom >= 8) return markers  // No clustering at city level

  const gridSize = 0.5  // degrees, ~50km at equator
  const grid = {}

  markers.forEach(marker => {
    const gridX = Math.floor(marker.latitude / gridSize)
    const gridY = Math.floor(marker.longitude / gridSize)
    const key = `${gridX}:${gridY}`

    if (!grid[key]) {
      grid[key] = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        count: 0,
        markers: []
      }
    }
    grid[key].markers.push(marker)
    grid[key].count++
  })

  return Object.values(grid).map((cluster, idx) => ({
    id: -1 - idx,  // Negative ID for clusters
    latitude: cluster.latitude,
    longitude: cluster.longitude,
    iconPath: '/images/cluster.png',
    width: 36,
    height: 36,
    count: cluster.count,
    isCluster: true
  }))
}

function filterByRadius(markers, userLat, userLng, radiusMeters) {
  return markers.filter(marker => {
    const distance = haversineDistance(
      userLat, userLng,
      marker.latitude, marker.longitude
    )
    marker.distance = distance
    return distance <= radiusMeters
  })
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000  // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
```

### Bottom Sheet with movable-view

```xml
<!-- Bottom sheet using movable-view for gesture handling -->
<movable-view
  class="bottom-sheet {{showBottomSheet ? 'bottom-sheet--open' : ''}}"
  direction="vertical"
  damping="20"
  y="{{sheetY}}"
  bindchange="onSheetChange"
>
  <view class="handle-bar"></view>
  <view class="sheet-content">
    <!-- Content here -->
  </view>
</movable-view>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Third-party map SDK (AMap/Tencent) | WeChat native `<map>` | Phase 3 decision | Reduces package size, native GCJ-02 |
| No clustering | Native `initMarkerCluster()` or JS grid | Phase 3 decision | Performance with many markers |
| Marker tap with `bindcallouttap` | Bottom sheet overlay with `cover-view` | Phase 3 decision | Richer UX, more content space |

**Deprecated/outdated:**
- `covers` property on `<map>` — replaced by `markers`; `covers` deprecated since WeChat 2.0
- `include-points` for adjusting map region — use `latitude`/`longitude`/`scale` directly

---

## Open Questions

1. **Neo4j coordinate format**
   - What we know: Neo4j spatial functions support WGS-84 (SRID 4326) and Cartesian CRS
   - What's unclear: Whether existing or new ICH data will be in GCJ-02 or WGS-84
   - Recommendation: Store in WGS-84, convert to GCJ-02 on API response if needed; or source pre-converted GCJ-02 data

2. **Category list derivation**
   - What we know: UI spec has 4 categories (刺绣, 陶瓷, 剪纸, 编织)
   - What's unclear: What categories actually exist in Neo4j data
   - Recommendation: Query distinct categories from Neo4j on map load, build filter chips dynamically

3. **Initial map center**
   - What we know: Default is China center (35.0, 105.0) at scale 4
   - What's unclear: Whether to use user's last known location or always default to China center
   - Recommendation: Use last known location if stored, else China center

4. **Marker icon strategy**
   - What we know: Category icons are desired (D-04, UI spec)
   - What's unclear: Who creates the icon assets and in what format
   - Recommendation: Use simple colored circles with category initial as fallback; custom SVGs as stretch goal

---

## Environment Availability

> Step 2.6: SKIPPED — Phase 3 is code/config-only changes with no external tool dependencies beyond what already exists in the project. WeChat native APIs and the existing FastAPI + Neo4j backend are sufficient.

---

## Validation Architecture

> Note: No `.planning/config.json` found; `nyquist_validation` defaults to **enabled**.

### Test Infrastructure Detection

| Path | Exists | Framework | Notes |
|------|--------|-----------|-------|
| `miniprogram/project.config.json` | YES | WeChat DevTools | Uses native WeChat testing |
| `backend/` pytest setup | NO | None detected | No existing backend test suite in backend/ |
| `frontend/` test setup | NO | None | Not applicable to mini-program |

**Note:** WeChat mini-program testing uses WeChat DevTools and manual testing. No automated test framework detected in the mini-program project.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| MAP-01 | Map displays with markers | Manual | Open map page in WeChat DevTools, verify markers appear | Check markers array is not empty |
| MAP-02 | Marker tap shows bottom sheet | Manual | Tap marker, verify bottom sheet slides up | Check `selectedSite` state changes |
| MAP-03 | Radius filter updates markers | Manual | Change radius pill, verify nearby markers update | Check filter logic in `onRadiusChange` |
| MAP-04 | Navigation opens WeChat map | Manual | Tap "导航前往", verify `wx.openLocation` called | Mock `wx.openLocation` in test |

### Wave 0 Gaps

- [ ] `miniprogram/pages/map/index.js` — Map page with all handlers
- [ ] `miniprogram/utils/map.js` — Map utilities (clustering, radius filtering)
- [ ] `backend/app/api/endpoints/map.py` — FastAPI endpoints for markers and nearby
- [ ] `backend/app/db/seed_coordinates.py` — Data migration to add lat/lng to Heritage nodes

**No existing test infrastructure to extend.** Wave 0 creates the foundational files listed above.

### Validation Strategy

Given WeChat mini-program's closed runtime, validation is primarily:
1. **Manual testing** via WeChat DevTools
2. **Code review** of API contracts between mini-program and backend
3. **Integration testing** of `/map/markers` and `/map/nearby` endpoints

---

## Sources

### Primary (HIGH confidence)

- [WeChat Map Component](https://developers.weixin.qq.com/miniprogram/dev/component/map.html) — markers, clustering, circles, cover-view, performance notes
- [wx.getLocation API](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html) — GCJ-02 type parameter
- [wx.openLocation API](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html) — native navigation
- [movable-view component](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html) — bottom sheet gesture handling
- [cover-view component](https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html) — map overlay text/images
- [Neo4j Spatial Functions](https://neo4j.com/docs/cypher-manual/current/functions/spatial/) — point(), distance(), WGS-84 support

### Secondary (MEDIUM confidence)

- [03-UI-SPEC.md](./03-UI-SPEC.md) — visual design, colors, typography, spacing, interaction contracts
- [03-CONTEXT.md](./03-CONTEXT.md) — locked decisions, integration points, constraints
- [project.config.json](../miniprogram/project.config.json) — libVersion 3.3.0, Taro/WeChat config

### Tertiary (LOW confidence)

- WebSearch for WeChat map clustering patterns — not verified against official docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — WeChat native APIs are well-documented and locked decisions are followed
- Architecture: HIGH — Follows established Phase 2 patterns (Taro page structure, API utility module)
- Pitfalls: MEDIUM — Coordinate system pitfall verified; others based on common WeChat development patterns

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (30 days — stable domain, no fast-moving changes expected in WeChat map API)
