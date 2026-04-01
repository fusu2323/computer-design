# Pitfalls Research

**Domain:** Adding 微信小程序 (WeChat Mini Program) with Knowledge Push, Maps, AR, LBS, and Community to existing React + FastAPI + Neo4j system

**Researched:** 2026-04-01

**Confidence:** MEDIUM

*Note: WebSearch was unavailable during research. Findings based on WeChat official documentation and developer community knowledge. Some areas (AR approach, community moderation) may need further validation.*

---

## Critical Pitfalls

### Pitfall 1: setData Performance Abuse

**What goes wrong:**
Mini program becomes sluggish, pages scroll with jank, and users experience delays when interacting. Severe cases lead to "white screen" crashes.

**Why it happens:**
Developers treat `setData` like React state — passing entire objects instead of changed fields. WeChat's underlying diff algorithm is less optimized than React's Virtual DOM. Frequent large `setData` calls overwhelm the view layer.

**How to avoid:**
- Only update changed data paths: `setData({ 'item.name': newName })` not `setData({ item: entireObject })`
- Batch multiple state changes into single `setData` calls
- Avoid `setData` in loops or rapid event handlers
- Use `wx:if` instead of hidden elements for conditional rendering of heavy components

**Warning signs:**
- Page switch takes > 300ms
- Scroll events feel delayed
- Memory usage grows continuously during use
- DevTools "Memory" panel shows heap growth

**Phase to address:**
Phase 1 (Mini Program Foundation) — establish performance patterns before UI development

---

### Pitfall 2: Storing Secrets in Mini Program Code

**What goes wrong:**
API keys, passwords, or internal endpoints get exposed in WeChat mini program binaries. Attackers decompile mini programs easily, extracting any secrets embedded in code.

**Why it happens:**
Mini program code downloads to user devices. Unlike web apps, there's no server-side protection. Developers incorrectly assume code is "hidden" or forget that JS can be inspected.

**How to avoid:**
- Never embed `OPENAI_API_KEY`, Neo4j credentials, or similar secrets in mini program code
- All sensitive operations must go through the existing FastAPI backend
- Use backend-to-backend authentication, never expose tokens to client
- The mini program should only store a user session token, not application credentials

**Warning signs:**
- Any credential found during code review of mini program files
- Backend APIs called directly from mini program with exposed keys
- `.env` files included in build output

**Phase to address:**
Phase 1 (Architecture & Security) — must be resolved before any API integration

---

### Pitfall 3: Map Coordinate System Mismatch

**What goes wrong:**
Map markers appear 500-1000 meters off target. Points of interest seem "in the middle of a lake" or on wrong streets.

**Why it happens:**
WeChat map uses GCJ-02 (Mars coordinate system), not WGS-84. The existing web system may use standard GPS coordinates. Data from Neo4j knowledge graph likely uses standard coordinates, causing offset when plotted.

**How to avoid:**
- Always specify `type: 'gcj02'` in `wx.getLocation()` calls
- When storing or querying coordinates, establish which coordinate system your data uses
- Use `wx.getLocation({ type: 'gcj02' })` consistently — mixing coordinate systems is a common silent bug
- Verify all map markers against known locations during testing

**Warning signs:**
- Map markers consistently offset from actual locations
- Location selected via `wx.chooseLocation` doesn't match stored data
- "Accuracy" warnings from map component

**Phase to address:**
Phase 2 (Map & LBS Features) — coordinate conversion utility needed before map implementation

---

### Pitfall 4: Mini Program Package Size Overflow

**What goes wrong:**
WeChat rejects upload with "package exceeds 20MB limit" or forces users to download too long.

**Why it happens:**
WeChat enforces strict package size limits. Adding AR libraries (TensorFlow.js, MediaPipe), map SDKs, and community features without tree-shaking or lazy loading quickly exceeds limits. The existing web system's React/Tailwind stack may bloat the bundle.

**How to avoid:**
- Enable "upload with framework" in WeChat devtools — this splits code into main package + sub-packages
- Lazy load non-critical features: community, AR tools should only load when user accesses them
- Use CDN-hosted models for MediaPipe/TensorFlow.js, don't bundle models
- Monitor package size in CI — fail builds that exceed threshold
- Consider separate mini programs for different use cases if size becomes intractable

**Warning signs:**
- Build output > 15MB before optimization
- DevTools "Details" tab shows large individual files
- First load time > 3 seconds on 4G

**Phase to address:**
Phase 1 (Foundation) — establish size budget and lazy loading strategy upfront

---

### Pitfall 5: Subscription Message UX Trap

**What goes wrong:**
Users click "Block" on push notifications, permanently disabling knowledge push. Or users grant permission but never receive messages due to template mismatches.

**Why it happens:**
WeChat requires explicit user consent for subscription messages. The API presents a system dialog that users often dismiss or block. Developers fail to handle the denied state gracefully and don't provide alternative in-app notification paths.

**How to avoid:**
- Request one-time subscriptions first (not "permanent") — easier for users to accept
- Explain value before requesting: show "Enable daily ICH knowledge alerts?" with benefits
- Handle `fail` callback — don't assume subscription succeeded
- Build in-app notification fallback: badge/indicator for new content even if push fails
- Use "transactional" template IDs for critical updates, "marketing" templates require higher trust

**Warning signs:**
- Subscription success rate < 30%
- Users complaining "I enabled notifications but never received anything"
- No alternate notification path implemented

**Phase to address:**
Phase 1 (Knowledge Push MVP) — design notification strategy before implementation

---

### Pitfall 6: AR Implementation Misunderstanding

**What goes wrong:**
AR features either don't work or drain battery rapidly. Developers assume web-based AR libraries will work identically in mini programs.

**Why it happens:**
WeChat mini programs don't support WebXR, WebGPU, or standard AR frameworks. AR must be implemented via Canvas 2D overlays on camera feed, with manual marker detection. The camera component provides `onCameraFrame` callback for frame data, but all AR processing must happen in JavaScript — there's no GPU acceleration.

**How to avoid:**
- Use a dedicated AR library designed for mini programs (e.g., AR.js ports, Tencent AR SDK)
- For pattern-overlay AR (纹样叠加): pre-detect marker positions on backend or use simple image-based detection
- Accept that real-time AR tracking won't match mobile native app quality
- Consider server-side AR: send camera frame to FastAPI, receive overlay positions, render locally
- Test on low-end devices — AR JS processing is CPU intensive

**Warning signs:**
- AR features work on developer device but fail on older phones
- Battery drain complaints
- Frame rate < 15fps during AR mode

**Phase to address:**
Phase 3 (AR Features) — AR approach must be decided before any AR-specific development

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip coordinate conversion (use raw GPS) | "Works" on my device | Map markers offset in production | Never — establish GCJ-02 standard early |
| Bundle models instead of CDN | Simpler deployment | Package size blowup, slower load | Only in MVP prototype |
| Call Neo4j directly from mini program | Faster development | Security risk, tight coupling | Never — all data via FastAPI |
| Hardcode template IDs for notifications | Avoids config complexity | Breaks when templates change | Only if templates are stable |
| Implement AR with native-feeling UI | Better demo | Exceeds package size budget | MVP only, then evaluate |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| FastAPI backend | Mini program calls Neo4j directly | All data via FastAPI endpoints; mini program is a "thin client" |
| Session management | Using web session cookies | WeChat provides `code2Session` for login; use separate mini program session |
| Data sync | Assuming real-time sync between web and mini program | Define sync strategy: push from backend on web changes, mini program polls or subscribes |
| WebView | Trying to embed existing React app in webview | Mini program has limited WebView support; treat as separate UI |
| Share links | Deep links to web URLs | Use `navigateToMiniProgram` for mini-to-mini; use URL scheme `micropages://` for internal navigation |
| Image uploads | Uploading directly to WeChat servers then URL to backend | Upload to WeChat, then send media ID to backend which downloads via `wx.getImageInfo` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Large setData in map pages | Map becomes unresponsive when panning | Batch marker updates; show max 100 markers | > 50 markers visible |
| MediaPipe hand tracking on mobile | Severe lag, device heats up | Use CDN-hosted models; reduce detection frequency | Real-time tracking > 2 seconds |
| Loading all knowledge graph nodes at once | White screen on load, high memory | Paginate or cluster map markers; load on demand | > 200 non遗 items |
| Community image gallery | Slow scrolling, images loading one-by-one | Use `wx.preloadImage`; lazy load images; implement virtual list | > 20 images in list |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Embedding Neo4j credentials in mini program | Full database exposure | Backend-only access; mini program uses API tokens |
| Storing user tokens in localStorage equivalent | Token hijacking | Use `wx.setStorageSync` with encryption, or server-side sessions only |
| Trusting client-side permission checks | Privilege escalation | All permission checks server-side in FastAPI |
| Not validating subscription message templates | Push to wrong users | Validate template IDs server-side before sending |
| Allowing arbitrary file uploads from community | Malware distribution | Accept only WeChat media IDs; process files server-side |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Requiring camera permission immediately on launch | Users abandon app | Delay until user accesses AR feature |
| Map fills entire screen with no way to dismiss | Disorientation, frustration | Provide clear close/back navigation |
| Community posts load one-by-one | Perceived slowness | Skeleton screens + batch loading |
| Push notification request without context | Users block immediately | Explain value proposition before requesting |
| AR takes full control of camera with no exit | Users feel trapped | Always provide back button; warn before entering AR mode |
| Login required before viewing any content | High abandonment | Allow read-only browsing; gate creation features |

---

## "Looks Done But Isn't" Checklist

- [ ] **Knowledge Push:** Often missing template validation — verify messages appear in WeChat notification center
- [ ] **Map Markers:** Often offset due to coordinate system — verify against known physical locations
- [ ] **AR Filters:** Often "works in demo" but fails on low-end devices — test on 3+ year old phones
- [ ] **LBS Nearby:** Often returns empty results due to permission issues — verify `scope.userLocation` granted
- [ ] **Community Uploads:** Often broken due to media ID vs URL confusion — verify uploaded images display
- [ ] **Share to WeChat:** Often produces broken links — test on multiple WeChat versions
- [ ] **Session Persistence:** Often breaks between app restarts — verify login state persists

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Secrets exposed in code | HIGH | Rotate all exposed credentials immediately; audit access logs; rebuild mini program |
| Map coordinate offset | MEDIUM | Add coordinate conversion layer in backend; re-import affected data |
| Package size exceeded | MEDIUM | Enable code splitting; move features to sub-packages; reduce asset sizes |
| Push notifications blocked | LOW | Detect via API response; show in-app alternative; re-request after positive user action |
| AR performance issues | MEDIUM | Add device capability detection; reduce processing quality on low-end; offer "lite mode" |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| setData abuse | Phase 1: Mini Program Foundation | DevTools performance monitor shows < 16ms frame time |
| Secret exposure | Phase 1: Architecture | Security audit — no credentials in code |
| Coordinate mismatch | Phase 2: Map & LBS | Verify marker positions against known locations |
| Package size | Phase 1: Foundation | CI enforces < 15MB main package |
| Subscription UX | Phase 1: Knowledge Push | User testing shows > 40% opt-in rate |
| AR approach | Phase 3: AR Features | Prototype on 3+ year old devices |
| Backend integration | Phase 1: Foundation | All API calls through FastAPI verified |
| Community moderation | Phase 4: Community | Backend content filtering before display |

---

## Sources

- [WeChat Mini Program Performance Documentation](https://developers.weixin.qq.com/miniprogram/en/dev/framework/performance/) — Performance guidelines, setData optimization
- [WeChat Mini Program Security Guidance](https://developers.weixin.qq.com/miniprogram/en/dev/framework/security.html) — Security pitfalls, injection prevention
- [WeChat Mini Program Map Component](https://developers.weixin.qq.com/miniprogram/en/dev/component/map.html) — Coordinate system, limitations
- [WeChat Mini Program Camera Component](https://developers.weixin.qq.com/miniprogram/en/dev/component/camera.html) — Camera limitations, frame data
- [WeChat Mini Program Plugin Development](https://developers.weixin.qq.com/miniprogram/en/dev/framework/plugin/development.html) — Plugin limitations, network restrictions

---

*Pitfalls research for: 微信小程序 + Knowledge Push + Maps + AR + LBS + Community integration*
*Researched: 2026-04-01*
