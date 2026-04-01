---
phase: 03
slug: lbs
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | WeChat DevTools (manual testing) + pytest for backend API |
| **Config file** | miniprogram/project.config.json (libVersion 3.3.0) |
| **Quick run command** | `pytest tests/test_map_api.py -v` (backend only) |
| **Full suite command** | Manual verification via WeChat DevTools + `pytest` |
| **Estimated runtime** | ~30 seconds per backend API test |

---

## Sampling Rate

- **After every task commit:** Verify code compiles/renders in WeChat DevTools
- **After every plan wave:** Run `pytest tests/test_map_api.py -v` for backend endpoints
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** Manual — immediate visual verification

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 03-01-01 | 01 | 1 | MAP-01 | Manual | Open map page, verify markers appear | pending |
| 03-01-02 | 01 | 1 | MAP-01 | Manual | Verify markers array populated | pending |
| 03-01-03 | 01 | 1 | MAP-02 | Manual | Tap marker, verify bottom sheet slides up | pending |
| 03-02-01 | 02 | 1 | MAP-03 | Manual | Change radius pill, verify nearby markers update | pending |
| 03-02-02 | 02 | 1 | MAP-03 | Manual | Tap category chip, verify filter works | pending |
| 03-02-03 | 02 | 1 | MAP-04 | Manual | Tap "导航前往", verify wx.openLocation called | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `miniprogram/pages/map/index.js` — Map page with all handlers
- [ ] `miniprogram/utils/map.js` — Map utilities (clustering, radius filtering)
- [ ] `backend/app/api/endpoints/map.py` — FastAPI endpoints for markers and nearby
- [ ] `backend/app/db/seed_coordinates.py` — Data migration to add lat/lng to Heritage nodes
- [ ] `backend/tests/test_map_api.py` — pytest suite for /map/markers and /map/nearby

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Map displays with markers | MAP-01 | WeChat DevTools required | Open miniprogram → navigate to map → verify markers appear on map |
| Marker tap shows bottom sheet | MAP-02 | UI interaction test | Tap any marker → verify bottom sheet slides up with site info |
| Radius filter updates markers | MAP-03 | UI interaction test | Tap radius pill (e.g., 5km) → verify markers within radius are highlighted |
| Navigation opens WeChat map | MAP-04 | Native API test | Tap "导航前往" → verify WeChat map opens with coordinates |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < manual (immediate)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
