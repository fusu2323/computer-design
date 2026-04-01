# Feature Research: 移动端非遗体验 (Mobile ICH Experience)

**Domain:** WeChat Mini-Program for Intangible Cultural Heritage Learning
**Researched:** 2026-04-01
**Confidence:** MEDIUM (official WeChat docs verified, community patterns from training data)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| **每日知识推送** | Mobile apps in China universally offer daily content; users expect "daily dose" of learning | MEDIUM | Neo4j knowledge data, push service | WeChat supports template messages but requires user opt-in; push timing should respect user behavior patterns |
| **打卡成就系统** | Gamification is expected in Chinese learning apps (Duolingo model); streak tracking is baseline | MEDIUM | User profile system, local storage | Simple: local storage for streak count. Complex: distributed streak sync, anti-cheat |
| **全国非遗地图** | Map exploration is natural for cultural/geographic content; users expect spatial context | MEDIUM | Knowledge data with geo-tags, map SDK | Use WeChat's built-in map component with custom markers |
| **LBS附近功能** | "Near me" is standard mobile pattern; users expect to discover nearby heritage sites | MEDIUM | Location permissions, POI database | Requires wx.getLocation + map integration; POI data from existing knowledge graph |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| **AR非遗滤镜** | Unique "try on culture" experience; highly shareable; visual engagement | HIGH | Camera API (wx.createCameraContext), AR overlay rendering | WeChat's CameraFrameListener enables real-time frame access; overlay traditional patterns on camera feed |
| **微创作+社区** | Transforms passive learning into active creation; social sharing drives organic growth | MEDIUM-HIGH | Canvas API, image manipulation, sharing APIs (wx.showShareImageMenu) | Start with simple pattern overlay/coloring, not complex drawing |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Full UGC Social Network** | "Build community" sounds valuable | Complex moderation, content policy, anti-spam; WeChat's closed ecosystem makes virality hard | Focus on "micro-creation sharing" instead: single images shared to Moments/chat, no standalone social feed |
| **Real-time Collaborative Creation** | "Co-create with friends" seems engaging | Synchronization complexity, conflict resolution, WeChat doesn't support WebSocket in mini-programs easily | Offline creation with async sharing instead |
| **Complex AR Interactions** | "Full AR experience" impresses judges | Performance on mid-range phones, battery drain, camera frame processing is battery-intensive | Static overlay filters (photo mode) over live AR video |
| **Push Notifications for Everything** | "Stay engaged" | WeChat template message limits; users mute/dismiss; trust issues | Push only for check-in reminders and significant achievements |

## Feature Dependencies

```
[每日知识推送]
    └──requires──> [Neo4j Knowledge Graph] (existing data)

[打卡成就系统]
    └──requires──> [User Profile System] (basic structure exists in MyPractice.jsx)
    └──requires──> [Local Storage / Backend Sync]

[全国非遗地图]
    └──requires──> [Knowledge Data with Geo-tags] (needs to be added to Neo4j)
    └──requires──> [WeChat Map Component]

[AR非遗滤镜]
    └──requires──> [WeChat Camera API] (wx.createCameraContext + onCameraFrame)
    └──requires──> [Pattern Overlay Assets] (PNG/SVG overlays)
    └──requires──> [Canvas Rendering]

[LBS附近功能]
    └──requires──> [WeChat Location API] (wx.getLocation)
    └──requires──> [POI Database with Coordinates]
    └──enhances──> [全国非遗地图] (same map component, different view mode)

[微创作+社区]
    └──requires──> [Canvas API] (wx.createCanvasContext)
    └──requires──> [Sharing APIs] (wx.showShareImageMenu, onShareAppMessage)
    └──conflicts──> [Complex Social Features] (scope - keep simple)
```

### Dependency Notes

- **打卡成就 requires User Profile:** Basic structure exists but needs backend sync for cross-device streaks
- **AR滤镜 enhances 微创作:** Both use camera/canvas, but AR is "try on" while 微创作 is "make something"
- **全国非遗地图 and LBS附近 share map component:** Same WeChat MapContext, different data views (all-China vs nearby)

## MVP Definition

### Launch With (v1.1)

Minimum viable product for mobile heritage experience validation.

- [ ] **每日知识推送** - Simple daily card with cultural fact; no push notification (users open app to see)
- [ ] **打卡成就系统** - Local-only streak tracking; basic badge icons (3-5 achievements)
- [ ] **全国非遗地图** - Static markers for major ICH items; tap shows basic info card
- [ ] **微创作-涂色卡** - Pre-defined line art + color palette; save to album

### Add After Validation (v1.2)

Features to add once core is working.

- [ ] **每日推送** - WeChat template message push for check-in reminder (requires user opt-in)
- [ ] **LBS附近** - Show nearby heritage sites within 50km radius
- [ ] **微创作-纹样叠加** - Choose pattern overlay, adjust opacity, save/share

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **AR滤镜** - Camera overlay with real-time pattern rendering (HIGH complexity, performance concerns)
- [ ] **社区 Feed** - Full UGC feed with likes/comments (requires moderation, WeChat policy compliance)
- [ ] **跨设备同步** - Cloud streak storage with account system

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Rationale |
|---------|------------|---------------------|----------|-----------|
| 每日知识推送 | HIGH | MEDIUM | P1 | Core learning value; leverages existing Neo4j data |
| 打卡成就系统 | HIGH | MEDIUM | P1 | Engagement driver; table stakes for Chinese learning apps |
| 全国非遗地图 | HIGH | MEDIUM | P1 | Spatial learning context; natural for cultural content |
| 微创作-涂色卡 | MEDIUM | MEDIUM | P2 | Engagement multiplier; shareable content |
| LBS附近功能 | MEDIUM | MEDIUM | P2 | Natural extension of map; discovery use case |
| AR非遗滤镜 | HIGH | HIGH | P3 | High differentiation but high complexity; defer |
| 社区功能 | MEDIUM | HIGH | P3 | Scope creep risk; complex moderation |

**Priority key:**
- P1: Must have for launch (v1.1)
- P2: Should have, add when possible (v1.2)
- P3: Nice to have, future consideration (v2+)

## Competitor Feature Analysis

| Feature | 故宫博物馆 Mini | 敦煌研究院 Mini | 我们的方案 |
|---------|----------------|-----------------|------------|
| 每日知识 | 故宫每日壁纸+故事 | 壁画鉴赏 | 知识卡片 + 打卡 |
| 地图功能 | 展厅地图 | 洞窟导览 | 全国非遗地图 + LBS |
| AR/滤镜 | 宫廷换装AR | 洞窟游览AR | 纹样滤镜叠加 (simplified) |
| 创作功能 | 绘画涂色 | 壁画填色 | 微创作 + 分享 |
| 成就系统 | 印章收集 | 成就徽章 | 打卡天数 + 技艺徽章 |

**Our differentiation:** Focus on "learning through doing" with check-in streaks + spatial exploration vs. passive content consumption.

## Technical Implementation Notes

### WeChat Mini-Program APIs Required

| Feature | Key APIs |
|---------|----------|
| 每日推送 | wx.request (call backend), template message API (future) |
| 打卡成就 | wx.setStorage/getStorage (local), wx.getUserProfile (future auth) |
| 全国地图 | wx.createMapContext, addMarkers, openLocation |
| LBS附近 | wx.getLocation, map markers with callout |
| AR滤镜 | wx.createCameraContext, onCameraFrame, canvas drawing |
| 微创作 | wx.createCanvasContext, wx.canvasToTempFilePath, showShareImageMenu |

### Complexity Drivers

- **AR滤镜 HIGH complexity because:** Camera frame processing at 30fps requires optimization; overlay rendering must not block UI thread; PNG assets add to package size (limit to 5-10 patterns)
- **社区 HIGH complexity because:** Content moderation required; WeChat policy restrictions on user-generated content; spam/duplicate detection

## Sources

- WeChat Mini-Program Official Docs: Location APIs, Camera APIs, Share APIs, Map Component
- PRD.md: Feature requirements from PROJECT.md v1.1 milestone
- Competitive analysis: 故宫博物馆, 敦煌研究院 public mini-programs

---
*Feature research for: 移动端非遗体验 (Mobile ICH Experience)*
*Researched: 2026-04-01*
