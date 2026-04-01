# Architecture Research: 微信小程序 Integration

**Domain:** Multi-agent ICH teaching platform with mobile WeChat mini-program
**Researched:** 2026-04-01
**Confidence:** MEDIUM

## Executive Summary

微信小程序 integrates as a lightweight frontend client calling existing FastAPI backend APIs. New backend endpoints are needed for mini-program-specific features (daily knowledge push, map/location services, AR filters, community). The existing Neo4j knowledge graph and shadow_puppet_* data provide the foundation for content.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    微信小程序 (WeChat Mini-Program)                    │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐         │
│  │ DailyKnow │  │ ICH Map   │  │ AR Filter│  │ Community │         │
│  │ 每日知识   │  │ 全国地图  │  │ AR滤镜   │  │ 微创作社区 │         │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘         │
│        │              │              │              │                │
│  ┌─────┴──────────────┴──────────────┴──────────────┴─────┐         │
│  │              WeChat SDK (Login, Share, LBS)             │         │
│  └────────────────────────┬────────────────────────────────┘         │
└───────────────────────────┼───────────────────────────────────────────┘
                            │ HTTPS (REST)
┌───────────────────────────┼───────────────────────────────────────────┐
│                     FastAPI Backend                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ vision_    │  │ knowledge_ │  │ creative_  │  │ mini_      │       │
│  │ mentor.py  │  │ curator.py │  │ artisan.py │  │ program.py │ NEW  │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘       │
│        │               │               │               │                │
│  ┌─────┴───────────────┴───────────────┴───────────────┴─────┐       │
│  │              Service Layer (neo4j, llm, rag)               │       │
│  └──────────────────────────┬──────────────────────────────────┘       │
│                              │                                         │
│  ┌───────────────────────────┼──────────────────────────────────┐       │
│  │  Neo4j KG  │  MySQL  │  Elasticsearch  │  File Storage       │       │
│  └───────────┴─────────┴─────────────────┴─────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

## Integration Architecture

### WeChat Mini-Program Connection Pattern

Mini-program connects to existing FastAPI backend via HTTPS. The backend CORS is already configured with `allow_origins=["*"]`, enabling cross-origin requests from mini-program.

**Key integration differences from React frontend:**

| Aspect | React Frontend | WeChat Mini-Program |
|--------|----------------|---------------------|
| HTTP Client | axios | wx.request |
| Auth | JWT/Session | WeChat login code exchange |
| Real-time | WebSocket/SSE | wx.connectSocket |
| File Upload | Multipart | wx.uploadFile |

### Authentication Flow

```
WeChat Mini-Program              FastAPI Backend           WeChat API
      │                              │                         │
      │  wx.login()                  │                         │
      │─────────────────────────────>│                         │
      │  {code: "xxx"}               │                         │
      │                              │  /api/v1/auth/login      │
      │                              │─────────────────────────>│
      │                              │  {openid, session_key} │
      │                              │<─────────────────────────│
      │                              │                         │
      │  Create/verify user          │                         │
      │  Return internal JWT         │                         │
      │<─────────────────────────────│                         │
      │  {token: "jwt"}              │                         │
      │                              │                         │
      │  All subsequent requests     │                         │
      │  with Authorization header   │                         │
```

### WeChat SDK Capabilities Used

| Feature | WeChat API | Purpose |
|---------|------------|---------|
| Authentication | wx.login, wx.getUserProfile | User identity |
| Location | wx.getLocation, wx.chooseLocation | LBS services |
| Map | map component, wx.createMapContext | National ICH map |
| Camera | CameraContext, CameraFrameListener | AR filters |
| Sharing | wx.showShareMenu, onShareAppMessage | Social sharing |
| Push | subscribeMessage | Daily knowledge push |
| Payment | wx.requestPayment | Future premium features |

## New Component Architecture

### Mini-Program Backend Module

**New file:** `backend/app/api/endpoints/mini_program.py`

```
backend/app/
├── api/endpoints/
│   ├── mini_program.py    # NEW: All mini-program endpoints
│   ├── daily_knowledge.py  # NEW: Daily push logic (or merged)
│   ├── map_service.py      # NEW: Map data endpoints
│   └── community.py        # NEW: Community/sharing endpoints
```

### Recommended Mini-Program Project Structure

```
miniprogram/
├── src/
│   ├── pages/
│   │   ├── index/              # Home - daily knowledge card
│   │   │   ├── index.js
│   │   │   ├── index.wxml
│   │   │   ├── index.wxss
│   │   │   └── index.json
│   │   ├── map/                # National ICH map
│   │   ├── ar/                 # AR filter camera
│   │   ├── nearby/             # LBS nearby inheritors
│   │   ├── create/             # Micro-creation tools
│   │   └── profile/            # User profile & check-ins
│   ├── components/
│   │   ├── ich-card/           # Reusable ICH info card
│   │   ├── map-marker/          # Custom map marker
│   │   ├── ar-overlay/          # AR filter canvas
│   │   └── craft-canvas/        # Drawing/collage canvas
│   ├── services/
│   │   ├── api.js              # HTTP client wrapper
│   │   ├── auth.js             # WeChat login flow
│   │   └── location.js         # LBS helpers
│   ├── store/
│   │   └── user.js             # User state (check-ins, achievements)
│   └── utils/
│       ├── request.js          # Axios-like request interceptor
│       └── ar-engine.js        # AR filter processing
├── cloud/                      # WeChat Cloud Development (optional)
│   └── functions/
│       ├── daily-push/         # Cloud function for scheduled push
│       └── image-process/      # AR image processing
└── package.json
```

## Feature Integration Points

### 1. Daily Knowledge (每日知识) + Check-in

**Data flow:**
```
Scheduled Trigger (Cloud Timer)
    ↓
Cloud Function: daily-push
    ↓
Call backend: GET /api/v1/knowledge/daily
    ↓
Neo4j KG query: random ICH item
    ↓
WeChat Subscribe Message API
    ↓
User receives push
    ↓
User opens → Mini-program → Check-in recorded
```

**Backend endpoints (new):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/mini/daily` | GET | Get today's ICH knowledge card |
| `/api/v1/mini/checkin` | POST | Record user check-in |
| `/api/v1/mini/streak` | GET | Get user's check-in streak |
| `/api/v1/mini/achievements` | GET | Get user achievements |

**Existing data reuse:**
- shadow_puppet_knowledge_graph.json: ICH item descriptions, locations
- shadow_puppet_rag.json: Q&A pairs for ICH knowledge
- Neo4j KG: Heritage nodes with techniques, people, locations

### 2. National ICH Map (全国非遗地图)

**Data flow:**
```
Mini-program loads
    ↓
GET /api/v1/mini/map/heritage-points
    ↓
Returns: [{name, lat, lng, type, thumbnail}]
    ↓
Render map with markers
    ↓
User taps marker
    ↓
wx.openLocation() or navigate to detail page
```

**Backend endpoints (new):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/mini/map/heritage-points` | GET | All ICH markers with coordinates |
| `/api/v1/mini/map/heritage/{id}` | GET | Detail page data |

**WeChat map component:**
- Uses built-in `map` component with GCJ-02 coordinates
- Custom markers with `iconPath` (local assets)
- Callout bubbles with `display: 'BYCLICK'`
- Polygons for regional boundaries (optional)

### 3. AR ICH Filters (AR 非遗滤镜)

**Data flow:**
```
Camera starts
    ↓
CameraFrameListener starts (30fps)
    ↓
Each frame → Canvas overlay
    ↓
Apply AR filter (纹样 overlay at detected positions)
    ↓
Composite canvas → Display
    ↓
User takes photo → wx.createCanvasContext.toDataURL()
    ↓
POST /api/v1/creative/ar-save
    ↓
Store in file storage / return URL
```

**AR Implementation:**
- Use CameraContext.onCameraFrame to get frame data
- Draw camera frame to offscreen canvas
- Overlay pattern image at landmark positions
- For face filters: detect face landmarks (need TensorFlow.js-lite)
- For hand/object tracking: process frame with MediaPipe via plugin or webview

**Constraint:** Mini-program package limit is 20MB. MediaPipe model must be hosted externally.

**Backend endpoints (new):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/mini/ar/filters` | GET | Available AR filter list |
| `/api/v1/mini/ar/save` | POST | Save AR photo to storage |

### 4. LBS Nearby (LBS 附近传承人)

**Data flow:**
```
User grants location permission
    ↓
wx.getLocation({type: 'gcj02'})
    ↓
POST /api/v1/mini/nearby
    │   Body: {lat, lng, radius}
    ↓
Neo4j spatial query or MySQL geolocation query
    ↓
Return nearby inheritors/museums sorted by distance
    ↓
Display on map with wx.openLocation() links
```

**Backend endpoints (new):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/mini/nearby` | POST | Find nearby ICH locations |
| `/api/v1/mini/heritage/{id}/navigate` | GET | Get navigation info |

**Spatial query approach:**
- Option A: MySQL with spatial index (POINT, ST_Distance_Sphere)
- Option B: Neo4j with point property + distance functions
- Option C: Pre-computed geohash for faster querying

### 5. Micro-Creation + Community (微创作 + 分享社区)

**Data flow:**
```
User selects craft type
    ↓
Canvas-based collage/painting tool
    ↓
User arranges 纹样 elements
    ↓
Save to local storage or POST /api/v1/mini/create/save
    ↓
User shares → wx.showShareMenu + onShareAppMessage
    ↓
Others open shared content → Mini-program deep link
```

**Canvas implementation:**
- Use `<canvas>` component for drawing
- Touch event handlers for multi-touch
- Pre-loaded 纹样 element images
- Export via canvas.toDataURL()

**Backend endpoints (new):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/mini/create/save` | POST | Save user creation |
| `/api/v1/mini/create/list` | GET | Community feed |
| `/api/v1/mini/create/{id}` | GET | View creation detail |
| `/api/v1/mini/create/{id}/like` | POST | Like a creation |

**Sharing implementation:**
- `onShareAppMessage`: Custom share title, image, path
- `wx.showShareImageMenu`: Share directly as image
- Mini-program码: Generate QR code for deep linking

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────┘

[User Action] → [Mini-Program Page] → [Service Layer] → [Backend API]
      ↑                                                      ↓
      │                     ┌──────────────────────────────┐│
      │                     │       DATA STORES             ││
      │                     │  ┌─────────┐  ┌───────────┐  ││
      │                     │  │ Neo4j   │  │ MySQL     │  ││
      │                     │  │ KG      │  │ (Users,   │  ││
      │                     │  │ ICH     │  │ Check-ins,│  ││
      │                     │  │ Data    │  │ Creations)│  ││
      │                     │  └────┬────┘  └─────┬─────┘  ││
      │                     └───────┼──────────────┼───────┘│
      │                             ↓              ↓         │
      │                     ┌────────────────────────────────┐│
      └───[Response]────────│    FastAPI Service Layer      │─┘
                            │  neo4j_service, llm_service   │
                            │  rag_service, image_service   │
                            └────────────────────────────────┘

NEW ENDPOINTS:
GET    /api/v1/mini/daily           → Today's ICH knowledge
POST   /api/v1/mini/checkin        → Record check-in
GET    /api/v1/mini/streak          → Check-in streak
GET    /api/v1/mini/achievements    → User achievements
GET    /api/v1/mini/map/heritage-points → All ICH map markers
POST   /api/v1/mini/nearby          → LBS nearby query
POST   /api/v1/mini/ar/save         → Save AR photo
POST   /api/v1/mini/create/save     → Save user creation
GET    /api/v1/mini/create/list     → Community feed
```

## New vs. Modified Components

### New Components

| Component | Type | Purpose |
|-----------|------|---------|
| `backend/app/api/endpoints/mini_program.py` | Backend | All mini-program API endpoints |
| `backend/app/services/checkin_service.py` | Backend | Check-in, streak, achievement logic |
| `backend/app/services/location_service.py` | Backend | Spatial queries for LBS |
| `miniprogram/src/pages/index/` | Frontend | Daily knowledge home |
| `miniprogram/src/pages/map/` | Frontend | National ICH map |
| `miniprogram/src/pages/ar/` | Frontend | AR filter camera |
| `miniprogram/src/pages/nearby/` | Frontend | LBS nearby view |
| `miniprogram/src/pages/create/` | Frontend | Micro-creation canvas |
| `miniprogram/src/components/ar-overlay/` | Frontend | AR filter canvas overlay |

### Modified Components

| Component | Change |
|-----------|--------|
| `backend/app/main.py` | Add mini_program router |
| `backend/app/core/config.py` | Add mini-program specific settings (WeChat app secret) |
| `backend/app/services/neo4j_service.py` | Add spatial query methods |
| `frontend/src/services/endpoints.js` | No change (mini uses separate service) |

### Components Intentionally NOT Modified

| Component | Why Not |
|-----------|---------|
| Vision Mentor | Heavy AI, stays on web |
| Creative Artisan (SD) | Heavy AI, stays on web |
| MediaPipe hand tracking | Too heavy for mini-program |

## Build Order (Dependency Considerations)

### Phase 1: Foundation
**Goal:** Basic mini-program shell with auth and daily knowledge

1. **Mini-program project setup** - scaffolding, CI/CD
2. **WeChat login integration** - auth flow to backend
3. **Daily knowledge endpoint** - reuse existing knowledge data
4. **Check-in system** - MySQL table for check-ins

**Why first:** Lowest risk, validates mini-backend connection, most impactful MVP feature.

### Phase 2: Map + Location
**Goal:** ICH map with markers and LBS

1. **National map page** - static markers from existing data
2. **Location permission + nearby query** - spatial index on MySQL
3. **wx.openLocation integration** - native map navigation

**Why second:** Map is core feature, depends on Phase 1 auth.

### Phase 3: AR Filters
**Goal:** Camera with overlay filters

1. **Camera page with frame listener**
2. **AR overlay canvas** - simple 2D pattern overlay
3. **Photo save and share**

**Why third:** More complex, requires camera permission, depends on Phase 1.

### Phase 4: Community
**Goal:** User creations and social sharing

1. **Canvas creation tool**
2. **Creation save/upload endpoints**
3. **Share menu integration**
4. **Community feed**

**Why last:** Least critical path, depends on Phase 3 for sharing.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Heavy AI in Mini-Program

**What people do:** Try to run MediaPipe, TensorFlow.js, or Stable Diffusion directly in mini-program.

**Why it's wrong:** Package size limit (20MB), performance constraints, no WebGL in standard components.

**Do this instead:** Keep AI on backend. Mini-program sends frames/data to backend for processing, or use pre-computed overlays.

### Anti-Pattern 2: Direct Database Access from Mini-Program

**What people do:** Expose database credentials to mini-program, direct MySQL connections.

**Why it's wrong:** Security risk, WeChat can be decompiled.

**Do this instead:** All data access via backend APIs. Mini-program only gets processed responses.

### Anti-Pattern 3: Ignoring GCJ-02 Coordinates

**What people do:** Using GPS coordinates (WGS-84) directly with WeChat map.

**Why it's wrong:** China uses GCJ-02 (天地图坐标系). Wrong coordinates show ~500m offset.

**Do this instead:** Always convert coordinates. Use `wx.getLocation({type: 'gcj02'})`. Store all coordinates in GCJ-02.

### Anti-Pattern 4: Large Initial Bundle

**What people do:** Including all features, images, and assets in initial download.

**Why it's wrong:** 20MB limit, slow first load, poor user retention.

**Do this instead:** Use dynamic imports, lazy load pages, host large assets on CDN.

## Sources

- WeChat Mini-Program Official Docs: https://developers.weixin.qq.com/miniprogram/dev/framework/
- WeChat Map Component: https://developers.weixin.qq.com/miniprogram/dev/component/map.html
- Camera API: https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/wx.createCameraContext.html
- Location Services: https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
- WeChat Cloud Development: https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/quickstart.html
- TDesign Mini-Program: https://github.com/Tencent/tdesign-miniprogram (UI component library)
- Subscribe Message: https://developers.weixin.qq.com/miniprogram/dev/framework/usability/subscribe-message.html

---

*Architecture research for: 微信小程序 integration with existing Digital Inheritor platform*
*Researched: 2026-04-01*
