---
phase: 02-miniprogram-infrastructure
verified: 2026-04-01T07:30:00Z
status: gaps_found
score: 6/7 must-haves verified
gaps:
  - truth: "User sees a daily ICH knowledge card on the home page each time they open the app"
    status: partial
    reason: "Daily card selection logic is implemented correctly but backend serves only 1 fact from shadow_puppet_simplified.json. All users see the same single fact every day - no daily rotation/variety."
    artifacts:
      - path: "backend/app/api/endpoints/knowledge_curator.py"
        issue: "load_ich_facts() creates exactly 1 fact from the JSON. For true 'daily' variety, multiple facts are needed."
      - path: "shadow_puppet_simplified.json"
        issue: "Contains data for only 1 ICH craft (皮影戏). No collection of facts to rotate through."
    missing:
      - "Multiple ICH facts in the data source OR a facts array with more than 1 entry"
      - "Alternative: Remove daily-selection architecture and name it 'featured fact' instead"
  - truth: "App package size stays under 20MB"
    status: uncertain
    reason: "Cannot verify without running WeChat mini-program build (requires WeChat DevTools + npm install)"
    artifacts: []
    missing:
      - "npm install in miniprogram directory"
      - "WeChat DevTools build environment"
human_verification:
  - test: "WeChat login button triggers auth flow"
    expected: "wx.login() is called, session stored, UI updates to logged-in state"
    why_human: "Requires WeChat DevTools + real WeChat environment to test native wx.login() API"
  - test: "Daily card displays correctly on home page"
    expected: "Card renders with category tag, title, image/fallback, fact text, and cardEnter animation plays"
    why_human: "Visual rendering test in WeChat DevTools"
  - test: "Package size under 20MB"
    expected: "npm run build:weapp produces output under 20MB"
    why_human: "Requires WeChat build environment and npm install to generate output"
---

# Phase 2: miniprogram-infrastructure Verification Report

**Phase Goal:** 用户可以打开小程序、登录微信账号、在应用内查看每日非遗知识
**Verified:** 2026-04-01T07:30:00Z
**Status:** gaps_found
**Re-verification:** No (initial verification)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Taro 4.x project compiles to WeChat mini-program | VERIFIED | package.json has @tarojs/cli@4.1.11 + react@^18.2.0; project.config.json has WeChat mini-program settings |
| 2 | Mini-program shows home page with app header | VERIFIED | home/index.tsx imports and composes AppHeader, KnowledgeCard, LoginButton; app.config.ts defines pages/home/index route |
| 3 | Design tokens mirror Phase 1 Eastern aesthetics | VERIFIED | variables.scss has 6-color palette (ink-black, rice-paper, vermilion, cyan-glaze, tea-green, charcoal), 8pt spacing scale, 3 font families (serif, calligraphy, xiaowei) |
| 4 | No framer-motion - CSS @keyframes only | VERIFIED | Grep found zero framer-motion imports; animations.scss has cardEnter, buttonPress, shimmer keyframes |
| 5 | User can log in via WeChat auth (wx.login) | VERIFIED | LoginButton calls loginWithWeChat() which calls Taro.login(); auth.ts stores session via Taro.setStorage |
| 6 | Daily card loads from /api/v1/knowledge/daily | VERIFIED | home page useEffect calls getDailyFact(); dailyCard.ts uses request() with API_KNOWLEDGE_DAILY; backend /daily endpoint exists |
| 7 | Card entrance animation plays on load (cardEnter) | VERIFIED | LoadedCard uses className='knowledge-card card-enter'; animations.scss defines cardEnter keyframe |
| 8 | GET /api/v1/knowledge/daily returns facts with id, title, category, imageUrl, fact | VERIFIED | knowledge_curator.py /daily endpoint returns {facts: [...]}; load_ich_facts() builds correct schema |
| 9 | User sees a daily ICH knowledge card | PARTIAL | Backend returns only 1 fact; daily-selection hash always returns the same fact for all users |
| 10 | App package size under 20MB | UNCERTAIN | Cannot verify without WeChat build environment |

**Score:** 6/7 core truths verified; 2 partial/uncertain

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `miniprogram/package.json` | Taro 4.1.11 + React 18 | VERIFIED | Contains @tarojs/cli@4.1.11, react@^18.2.0 |
| `miniprogram/project.config.json` | WeChat mini-program config | VERIFIED | Has appid, compileType: miniprogram, srcMiniprogramRoot |
| `miniprogram/src/styles/variables.scss` | Design tokens | VERIFIED | All 6 colors, spacing, fonts present |
| `miniprogram/src/styles/animations.scss` | CSS keyframes | VERIFIED | cardEnter, buttonPress, shimmer defined |
| `miniprogram/src/utils/auth.ts` | loginWithWeChat, checkLoginStatus | VERIFIED | Both functions exported, use Taro.login/setStorage |
| `miniprogram/src/utils/dailyCard.ts` | getDailyFact returning ICHFact | VERIFIED | Hash-based selection logic implemented |
| `miniprogram/src/utils/api.ts` | Taro.request wrapper | VERIFIED | Uses API_BASE from constants |
| `miniprogram/src/constants/index.ts` | API endpoints | VERIFIED | API_BASE='http://localhost:8002', API_KNOWLEDGE_DAILY='/api/v1/knowledge/daily' |
| `miniprogram/src/app.ts` | Taro app entry | VERIFIED | Imports variables.scss, animations.scss |
| `miniprogram/src/app.config.ts` | Pages + nav config | VERIFIED | pages: ['pages/home/index'], navigationBarTitleText: '数字传承人' |
| `miniprogram/src/components/AppHeader/index.tsx` | Title + subtitle | VERIFIED | Shows '数字传承人' + '每日非遗知识' |
| `miniprogram/src/components/KnowledgeCard/index.tsx` | SkeletonCard/ErrorCard/LoadedCard | VERIFIED | All 3 states implemented with correct props |
| `miniprogram/src/components/LoginButton/index.tsx` | WeChat auth + loading | VERIFIED | Calls loginWithWeChat, shows spinner, toast on failure |
| `miniprogram/src/pages/home/index.tsx` | Home page logic | VERIFIED | isLoggedIn/dailyFact/loading/error states, useEffect hooks |
| `backend/app/api/endpoints/knowledge_curator.py` | /daily endpoint | VERIFIED | @router.get("/daily") returns {facts: [...]} with correct schema |
| `shadow_puppet_simplified.json` | ICH fact data | VERIFIED | Contains 皮影戏 data with 名称, 类别, 主要流派.特点 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| home/index.tsx | utils/dailyCard.ts | getDailyFact() in useEffect | WIRED | Line 33: `getDailyFact()` called in useEffect when isLoggedIn |
| home/index.tsx | utils/auth.ts | loginWithWeChat on click | WIRED | Line 6: imports loginWithWeChat, line 68: passes to LoginButton |
| dailyCard.ts | API endpoint | request() + API_KNOWLEDGE_DAILY | WIRED | Uses request() with url: API_KNOWLEDGE_DAILY |
| auth.ts | wx.login | Taro.login() | WIRED | Line 9: `await Taro.login()` |
| API router | /daily endpoint | main.py include_router | WIRED | knowledge_curator.router included at prefix /api/v1/knowledge |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| home/index.tsx | dailyFact | getDailyFact() -> /api/v1/knowledge/daily | YES | Backend returns one valid ICH fact from shadow_puppet_simplified.json |
| KnowledgeCard | fact prop | Parent's dailyFact state | YES | Data flows from API through getDailyFact to LoadedCard |
| LoginButton | session storage | Taro.login() -> Taro.setStorage | YES | Login code stored in WeChat storage via Taro API |

**Issue:** Backend `/daily` returns only 1 fact. The deterministic hash selection (date+userId) always returns index 0 since `facts.length === 1`. This is architecturally correct but provides no daily variety.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Backend /daily endpoint returns valid JSON | Cannot test | Backend code verified structurally; requires running server | SKIP (needs server) |
| Taro project has no framer-motion | `grep framer-motion miniprogram/` | No matches | PASS |
| Design tokens contain Eastern aesthetics colors | `grep color-ink-black miniprogram/src/styles/variables.scss` | Found | PASS |
| KnowledgeCard has loading skeleton | `grep SkeletonCard miniprogram/src/components/KnowledgeCard/index.tsx` | Found | PASS |
| LoginButton calls loginWithWeChat | `grep loginWithWeChat miniprogram/src/components/LoginButton/index.tsx` | Found | PASS |
| Home page uses getDailyFact | `grep getDailyFact miniprogram/src/pages/home/index.tsx` | Found | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| KNOW-01 | 02-01, 02-02, 02-03 | User can view daily ICH knowledge card when opening the app | VERIFIED | KnowledgeCard renders fact data; home page composes all components |
| KNOW-02 | 02-01, 02-02, 02-03 | Daily knowledge card shows one ICH fact with category tag and image | VERIFIED | LoadedCard shows category (tag), title, image (or fallback gradient), fact text |
| AUTH (implicit) | 02-02, 02-03 | WeChat login via wx.login | VERIFIED | LoginButton calls loginWithWeChat -> Taro.login(); checkLoginStatus on mount |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No anti-patterns detected |

**Stub classification:** None. All planned components have substantive implementations:
- LoginButton: Full loading state, error toast, success callback
- KnowledgeCard: Skeleton shimmer, error state with message, loaded card with all fields
- Home page: Full state management, conditional rendering, useEffect data loading

### Human Verification Required

**1. WeChat Login Flow**

**Test:** Open in WeChat DevTools, click "微信登录" button, verify auth completes
**Expected:** wx.login() is called, session stored, UI transitions to logged-in state showing KnowledgeCard
**Why human:** Requires WeChat DevTools + native wx.login() API which cannot be tested via curl/programming

**2. Daily Card Visual Rendering**

**Test:** After login, observe KnowledgeCard render
**Expected:** Card shows with cardEnter animation, displays 皮影戏 title, 传统戏剧 category tag, fact text, and either hero image or gradient fallback
**Why human:** Visual appearance and CSS animation timing require human observation

**3. Package Size Verification**

**Test:** Run `npm install && npm run build:weapp` in miniprogram directory, check output size
**Expected:** Output under 20MB
**Why human:** Requires npm install and WeChat build environment not available for programmatic verification

### Gaps Summary

**Gap 1: Single-Fact Daily Card (PARTIAL)**

The daily card selection architecture is correctly implemented with hash-based deterministic selection, but the backend only serves ONE ICH fact from shadow_puppet_simplified.json. All users see the same fact every day - there is no daily rotation or variety.

- **Root cause:** shadow_puppet_simplified.json contains data for only 1 ICH craft (皮影戏)
- **Impact:** "每日非遗知识" (daily ICH knowledge) shows the same fact to all users every day
- **Fix options:**
  1. Expand shadow_puppet_simplified.json to include multiple ICH facts
  2. Or rename to "Featured Fact" and acknowledge it is static content
  3. Or add a database query that returns different facts by date rotation

**Gap 2: Package Size (UNCERTAIN)**

Cannot verify package size without installing dependencies and running WeChat build. The Taro scaffold is correctly structured for lazy loading (components imported only where used), but actual output size requires build verification.

**Gap 3: WeChat-Specific Behaviors (HUMAN NEEDED)**

wx.login() is called via Taro.login(), but actual WeChat auth flow cannot be verified without WeChat DevTools. The implementation is structurally correct (calls Taro.login(), stores session, handles errors).

---

_Verified: 2026-04-01T07:30:00Z_
_Verifier: Claude (gsd-verifier)_
