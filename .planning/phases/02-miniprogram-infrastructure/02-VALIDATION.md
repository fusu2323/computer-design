---
phase: 02
slug: miniprogram-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest (Taro test runner via @tarojs/cli) |
| **Config file** | `miniprogram/` (Wave 0 scaffolds project) |
| **Quick run command** | `npm test` (per component) |
| **Full suite command** | `npm run test:all` (Wave 0 sets this up) |
| **Estimated runtime** | ~30 seconds (full suite) |

---

## Sampling Rate

- **After every task commit:** Run quick tests for modified component
- **After every plan wave:** Run full test suite
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | KNOW-01, KNOW-02 | e2e/api | `curl /knowledge/daily` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | KNOW-01, KNOW-02 | unit | `jest dailyCard` | W0 | ⬜ pending |
| 02-03-01 | 03 | 1 | AUTH | e2e | manual DevTools | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `miniprogram/` directory scaffolded with Taro 4.x
- [ ] `miniprogram/package.json` with React 18 and @tarojs/cli 4.x
- [ ] `miniprogram/src/__tests__/` directory structure
- [ ] Jest config in `miniprogram/` (Wave 0 creates this)
- [ ] Backend `/knowledge/daily` endpoint stub exists

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| WeChat login button triggers auth flow | AUTH-01 | Requires WeChat DevTools + real device testing | Open in WeChat DevTools, click login, verify wx.login() called |
| Daily card displays correctly on home page | KNOW-01 | Visual rendering test | Screenshot comparison in DevTools |
| Package size under 20MB | PACK-01 | Requires WeChat build output | Run `npm run build:weapp`, check output size |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
