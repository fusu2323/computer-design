# Requirements: 数字传承人 v1.1

**Defined:** 2026-04-01
**Core Value:** 让每一位用户都能成为"数字传承人"
**Milestone:** v1.1 移动端非遗体验

## v1.1 Requirements

Requirements for v1.1 mobile (WeChat Mini-Program). Each maps to roadmap phases.

### Knowledge & Engagement

- [ ] **KNOW-01**: User can view daily ICH knowledge card when opening the app
- [ ] **KNOW-02**: Daily knowledge card shows one ICH fact with category tag and image

### Map & Discovery

- [ ] **MAP-01**: User can view national ICH map with geographic markers
- [ ] **MAP-02**: User can tap map marker to see ICH culture introduction card
- [ ] **MAP-03**: User can discover nearby heritage sites/artisans within configurable radius
- [ ] **MAP-04**: User can navigate to a heritage site via WeChat map integration

### Creation & Sharing

- [ ] **CREATE-01**: User can color ICH pattern line art using preset color palette
- [ ] **CREATE-02**: User can save creation to album
- [ ] **CREATE-03**: User can share creation to WeChat moments or chat

## v2 Requirements

Deferred to future release.

### Knowledge & Engagement

- **KNOW-03**: User receives WeChat push notification for daily knowledge (requires user opt-in)
- **KNOW-04**: User can maintain check-in streak across sessions
- **KNOW-05**: User can earn achievement badges for learning milestones

### Map & Discovery

- **MAP-05**: User can filter map markers by ICH category (e.g., 刺绣, 陶瓷, 剪纸)

### Creation & Sharing

- **CREATE-04**: User can overlay ICH patterns on camera preview (AR-lite)
- **CREATE-05**: User can browse community creations feed

## Out of Scope

| Feature | Reason |
|---------|--------|
| AR filters (real-time video) | HIGH complexity — CameraFrameListener 30fps + 20MB package limit; defer to v1.2+ validation first |
| Gesture/tracking practice | Weight-heavy for mobile; keep on web platform |
| Stable Diffusion image generation | Heavy AI stays on FastAPI backend; not for mini-program |
| Full UGC social network | Content moderation complexity; WeChat policy compliance needed; scope to single-image sharing only |
| Cross-device streak sync | Requires account system; local storage sufficient for v1.1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| KNOW-01 | — | Pending |
| KNOW-02 | — | Pending |
| MAP-01 | — | Pending |
| MAP-02 | — | Pending |
| MAP-03 | — | Pending |
| MAP-04 | — | Pending |
| CREATE-01 | — | Pending |
| CREATE-02 | — | Pending |
| CREATE-03 | — | Pending |

**Coverage:**
- v1.1 requirements: 9 total
- Mapped to phases: 0
- Unmapped: 9 ⚠️

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after v1.1 requirements defined*
