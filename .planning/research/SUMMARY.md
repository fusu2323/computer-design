# Project Research Summary

**Project:** 数字传承人 (Digital Inheritor) - Mobile WeChat Mini-Program
**Domain:** AI-driven Intangible Cultural Heritage (ICH) teaching platform with mobile client
**Researched:** 2026-04-01
**Confidence:** MEDIUM

## Executive Summary

The Digital Inheritor platform is adding a WeChat Mini-Program to provide lightweight mobile access to ICH learning features. Research confirms that expert teams implement this by using Taro as a cross-platform framework bridging the existing React 19 codebase to WeChat, while keeping all AI processing (MediaPipe, Stable Diffusion, LangChain RAG) on the existing FastAPI + Neo4j backend. The mini-program acts as a "thin client" that makes API calls and renders native WeChat components.

The recommended approach prioritizes mobile-specific strengths: daily knowledge push, spatial exploration via national ICH map, LBS discovery of nearby heritage sites, and simple micro-creation sharing. AR features are intentionally de-scoped from MVP due to package size constraints (20MB limit) and performance concerns on mid-range devices. The existing Neo4j knowledge graph and RAG system provide the content foundation, requiring only new thin backend endpoints rather than new services.

Key risks center on WeChat-specific pitfalls: setData performance abuse causing UI jank, coordinate system mismatches (GCJ-02 vs WGS-84) causing map marker drift, package size pressure from bundling ML libraries, and subscription message UX that users often block. These must be addressed proactively in Phase 1 foundation work.

## Key Findings

### Recommended Stack

**Summary from STACK.md**

Taro 4.x is the recommended cross-platform framework, chosen over native WXML/WXSS development to leverage existing React 19 codebase and enable future deployment to H5 and other platforms. It compiles React components to WeChat's WXML/WXSS format with minimal adaptation. WeChat's native components (Map, Camera, Canvas) provide better performance than third-party alternatives for the target feature set.

**Core technologies:**
- **Taro 4.x**: Cross-platform framework — compiles React to WXML/WXSS; bridges existing React codebase
- **XR-FRAME**: Official WeChat AR framework for camera AR (face/body tracking, plane detection)
- **Canvas 2D API**: Native canvas for 2D pattern overlay (simpler than 3D AR, lower package cost)
- **WeChat Map Component**: Native GCJ-02 map with markers, callouts, navigation integration
- **ECharts 6.x**: Already in project for ICH map visualization with geoJSON
- **WeChat Subscription Messages**: Built-in push notification API (template-based, no third-party needed)
- **TensorFlow.js 4.x**: Already in project for hand tracking; reuse for body/face mesh (web version only)
- **Tencent LBS (wx.getLocation)**: Native location API with GCJ-02 coordinates

**What NOT to use:**
- UniApp (prefer Taro for React ecosystem)
- Third-party push SDKs (WeChat built-in is sufficient)
- Google ARCore/WebXR (not supported in WeChat)
- AR.js (browser-based, incompatible with mini-program)
- Mapbox GL (licensing issues in China; use Tencent/高德 maps)

### Expected Features

**Summary from FEATURES.md**

**Must have (table stakes):**
- **每日知识推送** — Daily ICH knowledge card; users expect "daily dose" learning content
- **打卡成就系统** — Gamified check-in streaks and achievement badges; standard for Chinese learning apps
- **全国非遗地图** — National ICH map with spatial exploration; natural for cultural/ geographic content
- **LBS附近功能** — "Near me" discovery of heritage sites; standard mobile pattern

**Should have (competitive differentiators):**
- **AR非遗滤镜** — Camera overlay with traditional pattern effects; high shareability but HIGH complexity
- **微创作+社区** — Micro-creation tools (pattern collage/coloring) with social sharing; transforms passive to active learning

**Defer to v2+:**
- Real-time AR video (static overlay filters only for MVP)
- Full UGC social network (moderation complexity, WeChat policy)
- Cross-device streak sync (requires account system)
- Heavy AI features (MediaPipe hand tracking, Stable Diffusion)

**MVP Definition (v1.1):**
- Daily knowledge card (in-app only, no push notification yet)
- Local-only check-in streak tracking with basic badges
- Static markers on national ICH map with tap-for-info cards
- Micro-creation coloring tool (pre-defined line art + palette)

### Architecture Approach

**Summary from ARCHITECTURE.md**

The mini-program integrates as a lightweight frontend client calling existing FastAPI backend APIs via HTTPS. All sensitive operations (Neo4j access, AI processing) remain backend-only. New backend endpoints are needed for mini-program-specific features organized under `/api/v1/mini/*`.

**Major components:**

1. **Mini-Program Frontend (Taro)** — Pages for daily knowledge, map, AR camera, nearby discovery, micro-creation canvas, user profile. Reuses design tokens (东方美学 theme) from existing frontend.

2. **FastAPI Backend Endpoints (new)** — `mini_program.py` module with: `/mini/daily`, `/mini/checkin`, `/mini/streak`, `/mini/achievements`, `/mini/map/heritage-points`, `/mini/nearby`, `/mini/ar/save`, `/mini/create/save`, `/mini/create/list`

3. **Service Layer (new/modified)** — `checkin_service.py` (streak/achievement logic), `location_service.py` (spatial queries), spatial index additions to `neo4j_service.py`

4. **Existing Systems (reused)** — Neo4j knowledge graph (ICH data), LangChain RAG (Q&A), shadow_puppet_* data files

**Build order rationale:**
- Phase 1 (Foundation): Auth + daily knowledge validates mini-backend connection with lowest risk
- Phase 2 (Map + Location): Map is core feature, depends on Phase 1 auth
- Phase 3 (AR Filters): Higher complexity, camera permission, depends on Phase 1
- Phase 4 (Community): Least critical, depends on Phase 3 sharing infrastructure

### Critical Pitfalls

**Top 5 from PITFALLS.md**

1. **setData Performance Abuse** — Treating setData like React state; passing entire objects causes UI jank. Only update changed data paths, batch updates, use wx:if for conditional heavy components.

2. **Secrets in Mini-Program Code** — Embedding API keys/credentials in downloadable JS. Never expose Neo4j credentials or tokens; all sensitive ops via FastAPI backend.

3. **Map Coordinate System Mismatch** — Using WGS-84 GPS coordinates with WeChat's GCJ-02 Mars system causes 500m+ marker drift. Always use `wx.getLocation({type: 'gcj02'})` and convert stored coordinates.

4. **Package Size Overflow** — WeChat enforces 20MB limit; bundling TensorFlow.js/MediaPipe blows budget. Use CDN-hosted models, lazy load features, enable code splitting in devtools.

5. **Subscription Message UX Trap** — Users block push notifications when requested without context. Request one-time subscriptions, explain value first, build in-app fallback.

## Implications for Roadmap

Based on research, the recommended phase structure:

### Phase 1: Mini-Program Foundation
**Rationale:** Establishes mini-backend connection, auth flow, and performance patterns before UI development. Addresses secrets-in-code and package-size pitfalls proactively.

**Delivers:**
- Taro project scaffold with CI/CD pipeline
- WeChat login integration with FastAPI session management
- Daily knowledge endpoint and in-app display (no push yet)
- Check-in system with local storage
- Package size budget enforcement (<15MB main package)

**Addresses:** Table stakes features (daily knowledge, check-in), critical pitfalls (secrets, setData, package size)

**Avoids:** Subscription message UX trap (defer push until Phase 2)

### Phase 2: Map + Location Services
**Rationale:** Map is core spatial learning feature. Depends on Phase 1 auth but is architecturally straightforward with established WeChat map patterns.

**Delivers:**
- National ICH map with markers from Neo4j geo-tagged data
- LBS nearby discovery within configurable radius
- Coordinate validation utility (GCJ-02 enforcement)
- wx.openLocation integration for navigation

**Uses:** WeChat Map component, ECharts overlay, Tencent LBS APIs

**Implements:** `/api/v1/mini/map/heritage-points`, `/api/v1/mini/nearby` endpoints

### Phase 3: AR Filters (Lite)
**Rationale:** High differentiation but high complexity. Deferred until foundation and map phases validate user engagement. Uses simple 2D pattern overlay, not full AR.

**Delivers:**
- Camera page with frame listener (30fps)
- 2D纹样 (pattern) overlay on camera feed
- Photo capture and save to album
- Share to WeChat moments/chat

**Avoids:** Heavy MediaPipe/TensorFlow.js in bundle; tests on low-end devices first

### Phase 4: Micro-Creation + Community
**Rationale:** Least critical path; depends on sharing infrastructure from Phase 3. No standalone social feed to avoid moderation complexity.

**Delivers:**
- Canvas-based coloring tool (pre-defined line art)
- Creation save/upload to backend
- Share menu integration
- Simple community feed (creations list, not full UGC social)

### Phase Ordering Rationale

- **Auth validates connection first**: Mini-program cannot function without valid WeChat login and backend session
- **Map before AR**: Map uses established WeChat components with well-documented patterns; AR is experimental
- **Simple creation before complex community**: Coloring tool is scope-appropriate; full social feed deferred
- **Push notifications deferred**: Subscription UX requires user trust building; in-app display first

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (AR Filters):** AR approach (server-side frame processing vs client-side) needs prototype validation; performance on 3+ year old devices unverified
- **Phase 4 (Community):** WeChat content policy for UGC needs legal review; moderation approach not finalized

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Taro scaffolding, WeChat auth, setData patterns well-documented
- **Phase 2 (Map):** WeChat Map component has extensive official documentation and community examples

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Taro, WeChat components verified via official docs; version numbers from training data, not latest release |
| Features | MEDIUM | Feature priorities based on PRD and competitive analysis; user research not conducted |
| Architecture | MEDIUM | Integration patterns verified; new endpoint design based on existing codebase structure |
| Pitfalls | MEDIUM | WeChat docs verified; some community patterns from training data, not web search |

**Overall confidence:** MEDIUM

### Gaps to Address

- **AR approach validation**: Real-time AR vs static overlay performance tradeoffs need prototype on target devices
- **User research**: Feature priorities assume user expectations based on competitive analysis; no direct user validation
- **WeChat policy**: Community UGC content policy compliance needs legal review before Phase 4
- **Existing data geo-tagging**: Neo4j knowledge graph may lack GPS coordinates for map markers; data audit needed

## Sources

### Primary (HIGH confidence)
- WeChat Mini-Program Official Documentation — Framework, Map, Camera, Location, Subscription Message APIs
- WeChat Mini-Program Performance Guidelines — setData optimization, package size limits
- WeChat Mini-Program Security Guidance — Secrets protection, client/server architecture

### Secondary (MEDIUM confidence)
- Taro Documentation — React-to-WeChat compilation patterns
- Apache ECharts — Charting library (already in project)
- PRD.md — Feature requirements baseline

### Tertiary (LOW confidence)
- AR implementation approach — Training data knowledge; needs prototype validation
- Community moderation patterns — General knowledge; needs WeChat policy review

---

*Research completed: 2026-04-01*
*Ready for roadmap: yes*
