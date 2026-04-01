# Phase 2: miniprogram-infrastructure - Research

**Researched:** 2026-04-01
**Domain:** Taro 4.x + WeChat Mini-Program + React 18
**Confidence:** MEDIUM-HIGH

## Summary

Phase 2 requires scaffolding a Taro 4.x WeChat mini-program with WeChat login and a daily ICH knowledge card. The critical finding is that **Taro 4.x only supports React 18**, not React 19 used by the existing frontend. This blocks direct code sharing. Additionally, the `/knowledge/daily` backend endpoint does not exist yet and must be created. The mini-program uses WXSS (not CSS), Taro's animation API (not framer-motion), and WeChat storage (not browser localStorage).

**Primary recommendation:** Create `miniprogram/` directory at project root with Taro 4.1.11 + React 18. Port the 6-color design system and Card component patterns manually. Create `/knowledge/daily` endpoint in FastAPI. Use `wx.login()` + `wx.setStorage` for WeChat auth.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Taro 4.x project — directory structure is Claude's discretion
- **D-02:** Backend API (`/knowledge/daily` on FastAPI) as data source
- **D-03:** Client-side date hashing — `hash(date + userId)` for daily rotation
- **D-04:** Card content: Title + category tag + hero image + ICH fact text
- **D-05:** WeChat login via `wx.login()` — session stored in WeChat storage
- **D-06:** Phase 2 scope: Home page only (daily card + login button)
- **D-07:** No tab bar in Phase 2

### Claude's Discretion
- Exact Taro project directory structure
- Taro + React 19 compatibility approach (React 18 required by Taro 4.x)
- Specific UI component implementation details
- Package size optimization strategy

### Deferred Ideas
None — discussion stayed within phase scope.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| KNOW-01 | User can view daily ICH knowledge card when opening the app | `/knowledge/daily` endpoint must be created in FastAPI; client-side date hashing selects fact deterministically |
| KNOW-02 | Daily knowledge card shows one ICH fact with category tag and image | Backend returns structured fact; client renders title, category tag, image, fact text |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tarojs/cli | 4.1.11 | Taro framework CLI | Latest stable Taro 4.x |
| @tarojs/taro | 4.1.11 | Core Taro runtime | Required for all Taro projects |
| @tarojs/react | 4.1.11 | Taro React adapter | Bridges Taro to React components |
| react | ^18 | React UI library | Taro 4.x peer dependency — **NOT React 19** |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tarojs/components | 4.1.11 | WeChat component wrappers | Use WeChat-native components via Taro |
| @tarojs/plugin-platform-weapp | 4.1.11 | WeChat mini-program platform | Required for WXSS/WXML compilation |
| taro-ui | ^3 | UI component library | Optional — only if benefits outweigh 1MB+ size cost |

**Installation:**
```bash
# Create new Taro project (React template)
npm create taro@latest miniprogram -- --template react-18

cd miniprogram
npm install @tarojs/cli@4.1.11
npm install

# Verify React version (should be 18.x, NOT 19.x)
npm list react
```

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tarojs/cli 4.1.11 | Wait for Taro v5 with React 19 | v5 not released yet; current code freeze until React 19 support |
| Taro | UniApp or native WeChat DevTools | Would lose React code sharing; more rework |
| taro-ui | Native WeChat components only | Saves ~1MB; more work per component |

---

## Architecture Patterns

### Recommended Project Structure
```
computer-design/
├── frontend/                    # Existing React 19 web app
├── miniprogram/                 # NEW — Taro 4.x mini-program
│   ├── src/
│   │   ├── app.config.ts        # Taro app config (pages, global settings)
│   │   ├── app.ts               # Entry component
│   │   ├── app.scss             # Global styles
│   │   ├── pages/
│   │   │   └── home/
│   │   │       ├── index.tsx    # Home page component
│   │   │       └── index.scss   # Home page styles
│   │   ├── components/          # Shared mini-program components
│   │   │   ├── KnowledgeCard/
│   │   │   │   ├── index.tsx
│   │   │   │   └── index.scss
│   │   │   └── LoginButton/
│   │   │       ├── index.tsx
│   │   │       └── index.scss
│   │   ├── styles/
│   │   │   ├── variables.scss   # Design tokens (colors, fonts)
│   │   │   └── animations.scss  # Keyframe animations
│   │   ├── utils/
│   │   │   ├── auth.ts          # wx.login wrapper
│   │   │   ├── dailyCard.ts     # Date hashing algorithm
│   │   │   └── api.ts           # Taro request wrapper
│   │   └── constants/
│   │       └── index.ts         # API endpoints, config
│   ├── config/
│   │   └── index.ts             # Taro build config
│   ├── project.config.json      # WeChat mini-program config
│   └── package.json
└── backend/                     # Existing FastAPI backend
```

### Pattern 1: Taro + React 18 Component
**What:** React component using Taro's adapted hooks and WeChat component wrappers
**When to use:** Every page and component in the mini-program
**Example:**
```typescript
// src/pages/home/index.tsx
import { View, Text, Image, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dailyCard, setDailyCard] = useState(null)

  useEffect(() => {
    // Check existing session
    Taro.getStorage({ key: 'session' })
      .then(res => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
  }, [])

  const handleLogin = async () => {
    try {
      const loginRes = await Taro.login()
      // Store session (no backend OAuth needed for Phase 2)
      await Taro.setStorage({ key: 'session', data: loginRes.code })
      setIsLoggedIn(true)
    } catch (e) {
      Taro.showToast({ title: '登录失败', icon: 'none' })
    }
  }

  return (
    <View className='home-page'>
      {!isLoggedIn ? (
        <Button className='login-btn' onClick={handleLogin}>
          <Text>微信登录</Text>
        </Button>
      ) : (
        <KnowledgeCard />
      )}
    </View>
  )
}
```

### Pattern 2: WXSS CSS Animation Keyframes
**What:** CSS keyframe animations for cardEnter, buttonPress, shimmer
**When to use:** All UI animations in mini-program (no framer-motion available)
**Example:**
```scss
/* src/pages/home/index.scss */

// Card entrance animation
@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: cardEnter 0.4s ease-out forwards;
}

// Button press feedback
@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.96); }
  100% { transform: scale(1); }
}

.btn-press {
  &:active {
    animation: buttonPress 0.15s ease-in-out;
  }
}

// Shimmer loading effect
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(247, 245, 240, 0) 0%,
    rgba(247, 245, 240, 0.5) 50%,
    rgba(247, 245, 240, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
```

### Pattern 3: WeChat Login Flow
**What:** `wx.login()` followed by `wx.setStorage`
**When to use:** User authentication on first open
**Example:**
```typescript
// src/utils/auth.ts
export async function loginWithWeChat(): Promise<string> {
  const loginResult = await Taro.login()
  if (!loginResult.code) {
    throw new Error('wx.login failed')
  }
  // Store the login code as session (Phase 2 — no backend OAuth)
  await Taro.setStorage({ key: 'session', data: loginResult.code })
  return loginResult.code
}

export async function checkLoginStatus(): Promise<boolean> {
  try {
    const session = await Taro.getStorage({ key: 'session' })
    return !!session.data
  } catch {
    return false
  }
}
```

### Pattern 4: Daily Knowledge Card (Client-Side Hashing)
**What:** Deterministic daily fact selection using date + userId hash
**When to use:** Selecting which ICH fact to show on a given day
**Example:**
```typescript
// src/utils/dailyCard.ts
export async function getDailyFact(): Promise<ICHFact> {
  const facts = await fetchDailyFactsFromAPI() // calls /knowledge/daily

  // Get date string (YYYY-MM-DD in local time)
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  // Get user ID from storage (or anonymous ID)
  let userId = ''
  try {
    const stored = await Taro.getStorage({ key: 'userId' })
    userId = stored.data
  } catch {
    userId = 'anonymous'
  }

  // Deterministic hash: simple string hash function
  const hashInput = `${dateStr}:${userId}`
  let hash = 0
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % facts.length
  return facts[index]
}

async function fetchDailyFactsFromAPI() {
  const res = await Taro.request({
    url: `${API_BASE}/knowledge/daily`,
    method: 'GET'
  })
  return res.data.facts // Array of ICH facts
}
```

### Anti-Patterns to Avoid
- **Using React 19 with Taro 4.x:** Taro 4.x peer dependency is `react: ^18`. React 19 is NOT supported. Will cause runtime errors.
- **Using browser localStorage:** Use `wx.setStorage`/`wx.getStorage` instead.
- **Using framer-motion:** Not available in WeChat mini-program runtime. Use WXSS `@keyframes` instead.
- **Using CSS files directly:** Taro uses `.scss` files compiled to WXSS.
- **Using React Router:** Use Taro's built-in routing via `app.config.ts` pages array.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| React framework | Build custom React 18 adapter | @tarojs/react | WeChat mini-program has custom JS runtime; adapter is non-trivial |
| Animation library | Create custom animation system | WXSS @keyframes + Taro animation API | @keyframes is natively supported in WXSS |
| Login flow | Build custom auth UI + logic | wx.login() + wx.setStorage | WeChat handles the hard parts |
| Date-based rotation | Build custom date library | Simple string hash as decided in D-03 | Deterministic selection without backend complexity |
| HTTP requests | Use fetch directly | Taro.request | Handles WeChat network API differences |

---

## Common Pitfalls

### Pitfall 1: React 19 vs React 18 Incompatibility
**What goes wrong:** Taro 4.x uses React 18 as peer dependency. The existing frontend uses React 19. Code sharing between frontend and mini-program is not possible without adaptation.
**Why it happens:** Taro 4.x was released before React 19 stabilized and only declares `react: ^18` as peer dependency.
**How to avoid:**
- Do NOT run `npm install` in a Taro project without checking React version
- If sharing code with frontend, either: (a) downgrade frontend to React 18, or (b) maintain separate component implementations
- Verify: `npm list react` should show `react@^18.x.x`
**Warning signs:** `npm install` pulling React 19, or runtime errors like "useXXX is not a function"

### Pitfall 2: WeChat Storage API Mismatch
**What goes wrong:** `localStorage` is not available in WeChat mini-program. Calls to `localStorage.getItem/setItem` silently fail or throw.
**Why it happens:** WeChat mini-program uses `wx.setStorage`/`wx.getStorage` instead of browser Web APIs.
**How to avoid:** Always use Taro's storage wrapper (`Taro.getStorage`/`Taro.setStorage`) or the native `wx.*` API directly.
**Warning signs:** Data not persisting across sessions, errors in console about storage.

### Pitfall 3: Package Size Exceeding 20MB Limit
**What goes wrong:** WeChat mini-program main package limit is 20MB; recommended main package under 15MB with sub-packages for larger features.
**Why it happens:** Including all components, images, and code in main package.
**How to avoid:**
- Use sub-packages for future features (Map page, Creative page)
- Lazy load images via `<Image src={lazy ? '' : url} />` pattern
- Compress images (WebP where supported, max 200KB per image)
- Use icon fonts instead of multiple icon images
- Audit with `npm run build -- --analyzer` if available
**Warning signs:** Build output > 15MB, WeChat DevTools showing large package warnings.

### Pitfall 4: CORS Issues with Backend
**What goes wrong:** Mini-program requests to `localhost:8002` fail because WeChat mini-program is served from `weixin.qq.com` domain.
**Why it happens:** CORS policy on FastAPI backend blocks cross-origin requests from WeChat client.
**How to avoid:**
- Backend CORS is already configured with `allow_origins=["*"]` in `backend/app/main.py`
- For production: configure actual domain in CORS origins
- For development: use WeChat DevTools with appropriate settings
**Warning signs:** "Network error" in Taro.request response, CORS errors in console.

### Pitfall 5: Using Browser APIs Not Available in WeChat
**What goes wrong:** `window`, `document`, `navigator`, `location` are not available in WeChat JS runtime. Code using these will fail silently or throw.
**Why it happens:** WeChat mini-program uses a custom JavaScript engine (V8/UC) without browser BOM/DOM APIs.
**How to avoid:**
- Use Taro's cross-platform APIs instead of browser globals
- Use `Taro.getSystemInfo` instead of `navigator.userAgent`
- Never access `document.getElementById` — use Taro's `createSelectorQuery` if needed
**Warning signs:** "undefined is not a function" for browser API calls.

---

## Code Examples

### Taro App Config (app.config.ts)
```typescript
// src/app.config.ts
export default defineAppConfig({
  pages: [
    'pages/home/index', // Phase 2: only home page
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2B2B2B', // ink-black
    navigationBarTitleText: '数字传承人',
    navigationBarTextStyle: 'white',
  },
  style: 'v2', // Use latest native component style
  componentFramework: 'glass-eager', // Enable latest renderer
})
```

### WXSS Design Tokens (variables.scss)
```scss
/* Design tokens mirroring the 6-color Tailwind palette */

// Colors
$ink-black: #2B2B2B;
$rice-paper: #F7F5F0;
$vermilion: #C04851;
$cyan-glaze: #5796B3;
$tea-green: #CCD4BF;
$charcoal: #4A4A4A;

// Fonts
$font-calligraphy: 'Ma Shan Zheng', cursive;
$font-serif: 'Noto Serif SC', serif;
$font-xiaowei: 'ZCOOL XiaoWei', serif;

// Shadows
$card-shadow: 0 4px 20px -2px rgba(43, 43, 43, 0.1);
$hover-shadow: 0 8px 24px -2px rgba(43, 43, 43, 0.15);

// Border
$seal-border: 2px solid $vermilion;
```

### Knowledge Card Component (KnowledgeCard/index.tsx)
```typescript
// src/components/KnowledgeCard/index.tsx
import { View, Text, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { getDailyFact } from '../../utils/dailyCard'
import './index.scss'

interface ICHFact {
  id: number
  title: string
  category: string
  imageUrl: string
  fact: string
}

export default function KnowledgeCard() {
  const [fact, setFact] = useState<ICHFact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDailyFact()
      .then(f => {
        setFact(f)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View className='knowledge-card shimmer'>
        <View className='card-image-placeholder shimmer' />
        <View className='card-content'>
          <View className='shimmer' style='height: 24px; width: 60%; margin-bottom: 12px;' />
          <View className='shimmer' style='height: 16px; width: 40%; margin-bottom: 16px;' />
          <View className='shimmer' style='height: 80px;' />
        </View>
      </View>
    )
  }

  if (!fact) return null

  return (
    <View className='knowledge-card card-enter'>
      <Image
        className='card-image'
        src={fact.imageUrl}
        mode='aspectFill'
        lazy-load
      />
      <View className='card-content'>
        <Text className='card-title'>{fact.title}</Text>
        <View className='card-tag'>
          <Text className='tag-text'>{fact.category}</Text>
        </View>
        <Text className='card-fact'>{fact.fact}</Text>
      </View>
    </View>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React 17 in Taro 3.x | React 18 in Taro 4.x | Taro 4.0 (2024) | Required update of React-dependent code |
| Taro 3.x with Webpack | Taro 4.x with Vite | Taro 4.0 (2024) | Faster builds, different config format |
| localStorage in web | wx.setStorage in mini-program | Always different | No cross-platform storage sharing |
| framer-motion animations | WXSS @keyframes | Always different | Must rewrite all animations |

**Deprecated/outdated:**
- Taro 3.x: End of life, no longer maintained
- React 17: No longer supported by Taro 4.x

---

## Open Questions

1. **React 19 sharing strategy**
   - What we know: Taro 4.x supports React 18; frontend uses React 19
   - What's unclear: Should frontend downgrade to React 18, or accept separate mini-program codebases?
   - Recommendation: Planner should create a task to decide this before Phase 2 implementation begins

2. **`/knowledge/daily` endpoint contract**
   - What we know: Needs to return a list of ICH facts with title, category, imageUrl, fact fields
   - What's unclear: Exact response schema, pagination (if any), data source (Neo4j? JSON file?)
   - Recommendation: Define response schema in plan; create endpoint before mini-program dev starts

3. **User ID for anonymous users**
   - What we know: Hash requires userId; logged-in users have WeChat openid; anonymous users need a fallback
   - What's unclear: Should anonymous users get a random daily card (same for all), or require login?
   - Recommendation: Anonymous = use "anonymous" as userId (same daily card for all non-logged-in users)

4. **Mini-program AppID and project registration**
   - What we know: WeChat DevTools requires a registered mini-program AppID
   - What's unclear: Is there an existing AppID registered for this project?
   - Recommendation: Verify AppID exists before starting Taro scaffold

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Taro CLI, npm | Yes (checked) | 20.11.0 | — |
| npm | Package management | Yes | 10.x | — |
| WeChat DevTools | Running/debugging mini-program | Unknown | — | Cannot verify on this machine |
| Python | FastAPI backend | Yes | 3.x | — |
| Backend server (port 8002) | API calls | Running (per CLAUDE.md) | — | — |

**Missing dependencies with no fallback:**
- WeChat DevTools: Required to run/debug mini-program — must be installed separately

**Missing dependencies with fallback:**
- None identified for Phase 2 scope

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (via @tarojs/test-utils) |
| Config file | `jest.config.js` (if using Taro CLI template) |
| Quick run command | `npm test` |
| Full suite command | `npm run build` (compiles + type checks) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| KNOW-01 | Daily card renders on home page | smoke | Manual in WeChat DevTools | N/A (Phase 2 only) |
| KNOW-02 | Card shows title, category tag, image, fact | smoke | Manual in WeChat DevTools | N/A (Phase 2 only) |
| D-05 | wx.login completes without error | unit | Mock wx.login in unit test | TODO in Phase 2 |

### Sampling Rate
- **Per task commit:** `npm run lint` (if configured)
- **Per wave merge:** `npm run build` (full Taro compile)
- **Phase gate:** Manual testing in WeChat DevTools (required for WeChat-specific APIs)

### Wave 0 Gaps
- [ ] `miniprogram/` directory does not exist yet — Wave 0 is scaffolding the Taro project
- [ ] No test infrastructure yet — Taro template will provide Jest
- [ ] No lint configuration yet — Taro template will provide ESLint

*(No existing test infrastructure to extend — this is a new project)*

---

## Sources

### Primary (HIGH confidence)
- `@tarojs/cli@4.1.11` npm registry — peer dependencies (react: ^18 confirmed)
- `frontend/package.json` — confirmed React 19 usage, incompatible with Taro 4.x
- `backend/app/main.py` — confirmed CORS `allow_origins=["*"]`, `/knowledge` router prefix
- `backend/app/api/endpoints/knowledge_curator.py` — confirmed `/knowledge/daily` does NOT exist yet
- `frontend/src/animations/variants.js` — confirmed framer-motion patterns to port
- `frontend/tailwind.config.js` — confirmed 6-color palette design tokens

### Secondary (MEDIUM confidence)
- WeChat wx.login documentation — WebFetch truncated; known API shape from general knowledge
- Taro 4.x documentation — WebFetch failed; verified via npm registry and GitHub

### Tertiary (LOW confidence)
- Taro React 19 compatibility — WebSearch failed; this finding is based on npm peer dependency analysis only, marked for validation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified via npm registry
- Architecture: MEDIUM — WebFetch failures limit doc verification; code patterns from existing codebase
- Pitfalls: MEDIUM — some from existing codebase knowledge, some from npm peer dependency analysis

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (30 days — stable technology)

---

## Critical Blocker: React 19 + Taro 4.x Incompatibility

**This is the single most important finding for Phase 2 planning.**

The decision in `STATE.md` says: "Taro 4.x 跨平台框架 — 复用 React 19 代码库"

**Reality:** Taro 4.x `peerDependencies` is `"react": "^18"`. React 19 is NOT supported.

**Implications:**
1. The `miniprogram/` project will use React 18, not React 19
2. Code cannot be directly shared between `frontend/` (React 19) and `miniprogram/` (React 18) without adaptation
3. The planner MUST either:
   - (Option A) Add a React 18 compatibility layer/adapter for shared code
   - (Option B) Explicitly scope mini-program code as separate from frontend code
   - (Option C) Investigate Taro v5 (not yet released) as alternative

**Recommendation:** Accept separate codebases for Phase 2. The design tokens (colors, fonts, shadows) and component patterns (Card, Button) can be manually ported, but React 18/19 differences prevent direct code sharing.
