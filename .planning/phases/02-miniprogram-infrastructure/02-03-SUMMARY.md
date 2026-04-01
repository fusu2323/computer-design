---
phase: 02-miniprogram-infrastructure
plan: 03
subsystem: ui
tags: [taro, wechat-miniprogram, react, typescript, wx-login]

# Dependency graph
requires:
  - phase: 02-02
    provides: Taro 4.x scaffold, AppHeader component, auth utilities, dailyCard utilities
provides:
  - Working home page with WeChat login and daily ICH knowledge card
  - Full KnowledgeCard component with loading skeleton, error state, loaded state
  - Full LoginButton component with WeChat auth flow and loading spinner
affects:
  - Phase 2 (miniprogram-infrastructure) completion
  - Phase 3 (全国非遗地图 + LBS)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Conditional rendering based on login state
    - Loading/error/loaded state machine pattern for async data
    - WeChat login flow integration with wx.login()

key-files:
  created:
    - miniprogram/src/pages/home/index.tsx - Home page with login/daily card integration
    - miniprogram/src/components/KnowledgeCard/index.tsx - KnowledgeCard with SkeletonCard/ErrorCard/LoadedCard
    - miniprogram/src/components/LoginButton/index.tsx - LoginButton with actual loginWithWeChat call
  modified:
    - miniprogram/src/pages/home/index.scss - Added login-prompt, home-footer styles
    - miniprogram/src/components/KnowledgeCard/index.scss - Added skeleton, error, empty-image styles
    - miniprogram/src/components/LoginButton/index.scss - Added spinner animation, loading state styles

key-decisions:
  - "Used existing utils/auth.ts loginWithWeChat() instead of duplicating wx.login logic"
  - "Used existing utils/dailyCard.ts getDailyFact() and ICHFact interface"
  - "Props pattern follows plan interface: fact (ICHFact | null), loading (boolean), error (string | null)"

patterns-established:
  - "Async data component pattern: loading skeleton -> loaded content or error state"
  - "Login flow pattern: check status on mount -> conditional render -> login callback -> reload data"

requirements-completed: [KNOW-01, KNOW-02]

# Metrics
duration: 6min
completed: 2026-04-01
---

# Phase 02-03: Home Page with Login and Daily Card Summary

**Working home page with WeChat login via wx.login() and daily ICH knowledge card displaying via date+userId hash selection**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-01T06:53:31Z
- **Completed:** 2026-04-01T06:59:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Home page with full login state management and conditional rendering
- KnowledgeCard with shimmer loading skeleton, error empty state, and loaded card with hero image
- LoginButton with actual WeChat auth integration using wx.login() and loading spinner
- All components use CSS custom properties from design system (--color-vermilion, --font-calligraphy, etc.)

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement full Home page with login and daily card** - `1b6be8b` (feat)
2. **Task 2: Implement full KnowledgeCard with all states** - `519320d` (feat)
3. **Task 3: Implement full LoginButton with WeChat auth** - `1f4100a` (feat)

## Files Created/Modified

- `miniprogram/src/pages/home/index.tsx` - Home page with isLoggedIn, dailyFact, loading, error states; useEffect loads daily fact via getDailyFact()
- `miniprogram/src/pages/home/index.scss` - Added login-prompt, home-footer, footer-divider styles
- `miniprogram/src/components/KnowledgeCard/index.tsx` - SkeletonCard (shimmer), ErrorCard (error message), LoadedCard (hero image + tag + title + fact)
- `miniprogram/src/components/KnowledgeCard/index.scss` - Added skeleton shimmer animation, empty-image gradient, error-card centering
- `miniprogram/src/components/LoginButton/index.tsx` - Actual loginWithWeChat() call, Taro.showToast on failure, spinner during loading
- `miniprogram/src/components/LoginButton/index.scss` - Added spinner keyframe animation, loading state opacity

## Decisions Made

- Used existing utils/auth.ts loginWithWeChat() and checkLoginStatus() functions (already implemented in Plan 02-02 scaffold)
- Used existing utils/dailyCard.ts ICHFact interface and getDailyFact() function (already implemented in Plan 02-02 scaffold)
- Props interface follows plan specification: fact (ICHFact | null), loading (boolean), error (string | null)
- Home page imports ICHFact type from dailyCard utility, not from KnowledgeCard

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Phase 2 (miniprogram-infrastructure) complete - all 3 plans executed
- Ready for Phase 3 (全国非遗地图 + LBS)
- Home page successfully connects to /api/v1/knowledge/daily via getDailyFact()
- WeChat login flow fully integrated via wx.login()

---
*Phase: 02-miniprogram-infrastructure*
*Completed: 2026-04-01*
