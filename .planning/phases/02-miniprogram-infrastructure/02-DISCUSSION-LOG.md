# Phase 2: 小程序基础架构 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 02-miniprogram-infrastructure
**Areas discussed:** Project Structure, Daily Card Data Source, Daily Rotation, Navigation & Pages, Card Content

---

## Project Structure

| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Taro 4.x project structure — Claude's discretion | Unclear | New territory, STATE.md specifies Taro but not directory layout |

**User's choice:** Claude's discretion (user said "you decide")
**Notes:** User deferred project structure decision to builder

---

## Daily Card Data Source

| Option | Description | Selected |
|--------|-------------|----------|
| Backend API (recommended) | New /knowledge/daily endpoint on FastAPI — flexible | ✓ |
| Local JSON in mini-program | Embed shadow_puppet knowledge in bundle — works offline | |
| Hybrid — API with local fallback | Fetch daily from API, fall back to bundled JSON | |

**User's choice:** Backend API
**Notes:** User wants flexibility to update knowledge without app release

---

## Daily Rotation

| Option | Description | Selected |
|--------|-------------|----------|
| Server-side date selection | Backend picks based on date — consistent for all users | |
| Client-side date hashing (recommended) | Mini-program hashes date + userId — personalized per user | ✓ |
| Sequential + reset | Cycle through facts sequentially, reset each day at midnight | |

**User's choice:** Client-side date hashing
**Notes:** User wants personalized experience per user

---

## Navigation & Pages

| Option | Description | Selected |
|--------|-------------|----------|
| Home only (recommended) | Home page with daily card + login button | ✓ |
| Home + Profile tab | Tab bar with Home and Profile | |
| You decide | Builder discretion | |

**User's choice:** Home only
**Notes:** Minimal scope for Phase 2 foundation

---

## Card Content

| Option | Description | Selected |
|--------|-------------|----------|
| Title + category + image + fact (recommended) | Card shows: title, category tag, hero image, ICH fact text | ✓ |
| Add craft name + region | Also show: which craft (e.g., 苏绣) and origin region | |
| Add simple interactive element | Include a 'learn more' or '收藏' (bookmark) button | |

**User's choice:** Title + category + image + fact
**Notes:** Minimal card for Phase 2

---

## Deferred Ideas

None — discussion stayed within phase scope
