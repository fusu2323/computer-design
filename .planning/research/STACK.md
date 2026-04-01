# Stack Research

**Domain:** 微信小程序 + 移动端非遗体验
**Researched:** 2026-04-01
**Confidence:** MEDIUM (verified core WeChat docs; version numbers based on training data)

## Executive Summary

Adding 微信小程序 (WeChat Mini Program) as mobile lightweight entry to existing web app. The mini program reuses existing backend APIs (FastAPI + Neo4j) for knowledge data while providing native mobile experiences: daily knowledge push, national ICH map, AR pattern filters, LBS discovery, and micro-creation sharing community.

**Key insight:** Existing TensorFlow.js and ECharts stack is already partially compatible. AR filter development can leverage MediaPipe models already in use. Taro framework bridges React 19 codebase to WeChat Mini Program.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Taro** | 4.x (latest) | Cross-platform framework | Write React once, deploy to WeChat Mini Program + H5 + others. Bridges existing React 19 codebase. Actively maintained by JD/Youzan. |
| **微信小程序原生组件** | Built-in | Map, Camera, Canvas, AR | Native WeChat components provide best performance and AR via XR-FRAME. No third-party alternative needed. |
| **XR-FRAME** | Built-in | AR 2D/3D rendering, face/body/hand tracking | Official WeChat AR framework. Supports plane detection, marker tracking,纹样叠加. Integrated with camera component. |
| **ECharts** | 6.x (already installed) | China ICH map visualization | Already in project. Use with geoJSON for China provinces map. Combine with Map component for markers. |
| **TensorFlow.js** | 4.x (already installed) | AR filter ML inference | Already in project for hand tracking. Reuse for body/face mesh overlay models in AR mode. |
| **Canvas 2D API** | Built-in | Micro-creation drawing tools | Native canvas in mini program supports 2D drawing for pattern collage/coloring. Touch events supported. |
| **微信订阅消息** | Built-in API | 每日知识推送 | `subscribeMessage.send` backend API. Template-based. Requires user opt-in but no third-party service needed. |
| **Tencent LBS** | Built-in + `wx.getLocation` | LBS nearby discovery | Native location API returns GCJ-02 coordinates. Use with Tencent Maps SDK for distance calculations and navigation. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **html2canvas** | 1.4.x | Screenshot creation | Already in project. For micro-creation output preview before share. |
| **framer-motion** | 12.x (already installed) | Animations | Page transitions, element animations in mini program. |
| **React Router DOM** | 7.x (already installed) | Navigation | Reuse routing patterns via Taro's router. |
| **axios** | 1.x (already installed) | HTTP client | Connect to existing FastAPI backend for knowledge API calls. |
| **lodash** | 4.x | Utility functions | Throttle/debounce for map markers, collection operations. |
| **dayjs** | 1.x | Date handling |签到成就 dates, daily knowledge timestamps. |
| **jimp** or **sharp** | Backend only | Image processing | Server-side resizing for AR filter outputs before storage. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **微信开发者工具** | Mini program debugging, preview, upload | Required. Enable "使用npm模块" and "关闭 ES6 转 ES5" for better compatibility. |
| **Taro CLI** | Project scaffolding, build | `npm install -g @tarojs/cli`. Use `taro init` to scaffold. |
| **WeChat Mini Program Cloud** (可选) | File storage, database | If community features need backend-less storage. Consider existing Neo4j first. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **UniApp** vs Taro | Both are valid cross-platform frameworks. Taro chosen for better React 19 support and JD backing. UniApp preferred if Vue ecosystem stronger on team. | Taro (React) |
| **第三方推送SDK** (极光/友盟) | WeChat subscription messages are built-in, free within limits, and better送达率. Third-party adds complexity. | 微信订阅消息 |
| **Google ARCore** | Not supported in WeChat mini program. AR must use XR-FRAME. | XR-FRAME |
| **原生 React + webpack** | Cannot run React directly in WeChat mini program. Must use Taro ormpvue to compile to WXML/WXSS. | Taro |
| **AR.js** | Browser-based AR not compatible with mini program. | XR-FRAME + Canvas overlay |
| **Mapbox GL** | Requires separate map tiles licensing in China. Use Tencent/高德/百度 maps instead. | 微信Map组件 + ECharts |
| **LeanCloud / Bmob** | Unless team lacks backend capability. Project already has FastAPI + Neo4j. | Existing backend |
| **Canvas 3D (WebGL) for AR** | Complex to debug on iOS,鸿蒙 OS has issues with external textures. | XR-FRAME for 3D AR, Canvas 2D for 2D纹样 overlay |

---

## Integration Points

### With Existing Backend (FastAPI + Neo4j)

```
微信小程序 (Taro)
    │
    ├─ GET /api/v1/knowledge/daily       → 每日知识 (existing endpoint, create if missing)
    ├─ GET /api/v1/knowledge/qa          → 知识问答
    ├─ GET /api/v1/knowledge/map         → 非遗地图数据 (create new endpoint)
    ├─ POST /api/v1/creative/upload      → 微创作上传
    └─ GET /api/v1/user/checkin         → 签到记录

Existing:
├─ Neo4j: 知识图谱查询 (reuse)
├─ LangChain: RAG 问答 (reuse)
└─ MediaPipe: 手势追踪 (web端, not mobile)
```

### With Existing Frontend (React 19)

```
Taro compiles React → WXML + WXSS + JS

Reuse components:
├─ HandTracking.jsx      → NOT needed in mini program (out of scope)
├─ ECharts maps          → Reuse via echarts-for-react or direct ECharts
├─ Design tokens         → 东方美学 theme colors (墨黑/朱红/天青/茶绿/宣纸白)
└─ API service layer     → axios baseURL pointing to existing backend

Adapt components:
├─ Navbar.jsx           → Taro's custom navigation bar (different API)
├─ Card.jsx             → Compatible, use View instead of div
└─ Button.jsx           → Compatible, use Text instead of span
```

---

## Stack Patterns by Variant

**If mini program FIRST, web SECOND (推荐 for mobile-first):**
- Use Taro to develop shared components that work in both environments
- Extract business logic to hooks/services not tied to React DOM
- Map/ECharts rendering works in both with minimal adaptation

**If web FIRST, mini program SECOND:**
- Taro can import existing React components via `taroize` or manual adaptation
- UI components need View/Text替换 div/span
- Hooks/services are mostly compatible

**If AR filter complexity HIGH:**
- Consider separating AR to separate page, lazy load XR-FRAME
- Use Canvas 2D overlay (simpler) instead of full XR-FRAME 3D for pattern-only overlays
- MediaPipe via TensorFlow.js already handles hand/body mesh on web; XR-FRAME handles camera AR in mini program

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Taro 4.x | React 18/19 | React 19 support confirmed in Taro 4. Confirm exact minor version. |
| ECharts 6.x | React 19 | Works via direct import, not echarts-for-react (may lag). |
| TensorFlow.js 4.x | React 19, mini program | Use `@tensorflow/tfjs-core` + specific models to reduce bundle size. |
| framer-motion 12.x | React 19, Taro 4 | Motion values work across platforms. |
| html2canvas 1.4.x | WeChat mini program | Use with caution - performance heavy on mobile. Consider native canvas截图 instead. |
| WeChat Mini Program | iOS 12+, Android 7+ | Check target audience device stats. XR-FRAME requires newer OS. |
| 微信开发者工具 | 1.06+ | Use latest version for best React/TensorFlow compatibility. |

---

## Key Architecture Decisions

### 1. Taro vs 原生微信开发

**Decision:** Use **Taro** (React-based)

**Rationale:**
- Existing React 19 codebase makes Taro natural fit
- Write once, deploy to WeChat + H5 + other platforms
- Mature ecosystem, good documentation
- Better React hooks support than WeChat's native component system

**Alternative:** Native WXML/WXSS
- Better performance for simple pages
- Steeper learning curve, no code sharing with web
- Not recommended given existing React team skillset

### 2. AR Implementation Strategy

**Decision:** Use **XR-FRAME** for camera AR + **Canvas 2D overlay** for 2D pattern effects

**Rationale:**
- XR-FRAME is official WeChat AR solution, integrated with camera component
- 2D pattern overlays (纹样) can use Canvas 2D - simpler than 3D AR
- MediaPipe/TensorFlow.js (already in project) can run client-side ML for body tracking in web version
- XR-FRAME handles mini program specific AR

**Note:** AR face/body effects require XR-FRAME; simple pattern overlays can use canvas drawing.

### 3. Map Strategy

**Decision:** Use **微信Map组件** (native) + **ECharts** (for visualization)

**Rationale:**
- Native map component provides smooth pan/zoom, GPS, navigation
- ECharts for data overlay (clusters,热力图) on the map
- WeChat Map supports markers, polylines, circles, custom callouts
- geoJSON for China provinces visualization via ECharts

### 4. Push Notification Strategy

**Decision:** Use **微信订阅消息** (built-in)

**Rationale:**
- No third-party service needed
- Template-based, works within WeChat
- User must opt-in (scope: "subscribeMessage")
- Limit: 3 messages/day/user for most templates
- For critical daily reminder, sufficient

**Alternative:** 微信云开发订阅消息 or 第三方 (极光/友盟)
- Use if volume exceeds free tier limits
- Project scale likely doesn't need initially

---

## Sources

- [WeChat Mini Program Framework Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/) — Official, confirmed 2026 copyright
- [WeChat Map Component](https://developers.weixin.qq.com/miniprogram/dev/component/map.html) — Official, confirmed map types and capabilities
- [WeChat Camera Component + XR-FRAME](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) — Official, confirmed AR capabilities via XR-FRAME
- [WeChat Canvas Component](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) — Official, confirmed Canvas 2D (v2.9.0+) and WebGL (v2.7.0+)
- [WeChat Location API (wx.getLocation)](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html) — Official, confirmed location APIs
- [WeChat Subscription Message API](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html) — Official, confirmed push mechanism
- [WeChat Share APIs](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html) — Official, confirmed sharing capabilities
- [Taro Multi-End Framework](https://docs.taro.zone/en/docs/) — Official, confirmed React support and WeChat Mini Program targeting
- [Apache ECharts](https://echarts.apache.org) — Official, confirmed open-source charting library (already in project)

---

*Stack research for: 微信小程序 + 移动端非遗体验*
*Researched: 2026-04-01*
