# Phase 2: 功能增强 - Research

**Researched:** 2026-03-31
**Domain:** Feature enhancement: Vision Mentor (shadow puppet), Master Orchestrator chat UI, User Profile localStorage
**Confidence:** MEDIUM (training data for finger angle algorithm — not verified against current MediaPipe docs)

---

## Summary

Phase 2 transforms three disconnected features into cohesive real interactions. The Vision Mentor is simplified to shadow puppet only, with an improved angle-based evaluation algorithm replacing simple distance checks. The Master Workshop page is rebuilt as an orchestrator chat UI using the existing `/api/v1/orchestrator/process` endpoint (synchronous, not SSE). My Practice is refactored from mock data to real localStorage data following the session pattern already established in Knowledge Curator.

**Primary recommendation:** Start with Vision Mentor's algorithm improvement (highest risk — new math), then the Master Workshop chat (most UI work), then My Practice localStorage (lowest risk — follows existing pattern).

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Remove embroidery (苏绣) and clay (紫砂) scenarios — focus ONLY on shadow puppet (皮影戏)
- **D-02:** Optimize shadow puppet evaluation algorithm. Target gesture: rabbit hand shadow (index + middle fingers extended UP, thumb + ring + pinky fingers pinched together). Improve detection accuracy beyond simple distance checks — consider angle-based detection for finger extension.
- **D-03:** Practice session history via localStorage (anonymous sessions, same pattern as Knowledge Curator). Store per-session: timestamp, score, duration, scenario.
- **D-04:** Transform MasterWorkshop.jsx from a static landing page into an active orchestrator chat UI
- **D-05:** Users type natural language; orchestrator backend (`/api/v1/orchestrator/process`) performs intent detection and routes to the appropriate agent (Vision/Knowledge/Creative)
- **D-06:** Orchestrator page is a dedicated chat interface — not a floating button
- **D-07:** Anonymous sessions via localStorage (same approach as Knowledge Curator's session IDs)
- **D-08:** Replace mock data with real localStorage data: practice sessions, average scores, sessions count, certificates (Vision Mentor achievements unlock certificates)
- **D-09:** Knowledge Curator data population out of scope
- **D-10:** Creative Artisan (阿里百炼 image generation) is functional. No changes in Phase 2.

### Claude's Discretion

- Exact shadow puppet algorithm improvement approach (angle-based vs distance-based)
- Master Workshop chat UI design (layout, agent persona display)
- Certificate generation logic for Vision Mentor achievements
- localStorage schema for MyPractice data

### Deferred Ideas (OUT OF SCOPE)

- Knowledge Curator data population (Neo4j + Elasticsearch seeding)
- Embroidery (苏绣) scenario — removed
- Clay (紫砂) scenario — removed
- Full user authentication
- Voice input
- Body pose (full skeleton tracking)
- ControlNet/sketch-to-image

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| MediaPipe Hands | via CDN (jsdelivr) | 21-landmark hand tracking | Already in use; canonical for hand pose |
| Framer Motion | Phase 1 (installed) | Chat bubble animations | Already in use; ChatBubble.jsx available |
| React Router DOM | v7 | Page navigation | Already in project |
| localStorage | Browser API | Anonymous session persistence | Already used by Knowledge Curator |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|------------|
| axios | Already installed | API calls | For orchestrator POST |
| SSE (native) | Browser built-in | Streaming if backend adds it later | Only if orchestrator gains SSE support |

### No Changes From Phase 1
- Tailwind CSS — unchanged
- FastAPI backend — unchanged architecture
- Neo4j, LangChain — not modified in this phase

---

## Architecture Patterns

### Recommended Project Structure

```
frontend/src/
├── pages/
│   ├── VisionMentor.jsx    # Refactored: single scenario (shadow puppet only)
│   ├── MasterWorkshop.jsx  # Refactored: orchestrator chat UI (replaces static page)
│   └── MyPractice.jsx      # Refactored: localStorage data (replaces mock data)
├── components/
│   ├── HandTracking.jsx     # Minor: scenario-specific color config (shadow only)
│   └── ChatBubble.jsx      # Reused from Phase 1 for Master Workshop messages
├── hooks/
│   └── useLocalStorage.js  # New: typed localStorage hook for practice data
└── services/
    └── endpoints.js        # No changes needed

backend/app/api/endpoints/
├── vision_mentor.py         # Refactored: remove embroidery/clay, angle-based shadow algorithm
└── orchestrator.py         # No changes (already has /process endpoint)
```

### Pattern 1: Shadow Puppet Angle-Based Finger Detection

**What:** Replace distance-only evaluation with joint-angle calculation for finger extension detection.

**Why:** Simple distance-from-wrist checks are fragile against camera distance variation. Angle-based detection (measuring the MCP joint angle) is camera-distance invariant because it uses ratios.

**How it works (MediaPipe Hands 21 landmarks):**
```
Finger extended (straight):  MCP angle ≈ 180° (wrist-MCP-PIP are collinear)
Finger curled:               MCP angle < 100° (significant bend)

Landmark indices per finger:
- Index:  wrist=0, MCP=5, PIP=6, DIP=7, tip=8
- Middle: wrist=0, MCP=9, PIP=10, DIP=11, tip=12
- Ring:   wrist=0, MCP=13, PIP=14, DIP=15, tip=16
- Pinky:  wrist=0, MCP=17, PIP=18, DIP=19, tip=20
- Thumb:  wrist=0, CMC=1, MCP=2, IP=3, tip=4

Angle at joint B with arms BA and BC:
  angle = arccos( dot(BA,BC) / (|BA| * |BC| + eps) )
```

**Rabbit hand (shadow puppet) scoring logic:**
```python
def evaluate_shadow(hand: List[Landmark]) -> Dict[str, Any]:
    # Calculate MCP angle for each finger
    index_ext   = mcp_angle(hand[0], hand[5], hand[6])   # should be ~180
    middle_ext  = mcp_angle(hand[0], hand[9], hand[10]) # should be ~180
    ring_curl   = mcp_angle(hand[0], hand[13], hand[14]) # should be < 100
    pinky_curl  = mcp_angle(hand[0], hand[17], hand[18])  # should be < 100
    thumb_pos   = mcp_angle(hand[0], hand[2], hand[3])    # tucked across palm

    # Score: extended fingers get bonus, curled get bonus
    score = 0
    if index_ext > 150: score += 25
    if middle_ext > 150: score += 25
    if ring_curl < 110: score += 20
    if pinky_curl < 110: score += 20
    # Thumb bonus for being across palm (reduced MCP angle)
    if thumb_pos < 120: score += 10
```

**Source:** Existing angle calculation in `pose_analysis_service.py` (`_calculate_angle` using 3-point dot product formula) — verified in code. Application to hand landmarks is a direct adaptation.

### Pattern 2: localStorage Session Pattern

**What:** Anonymous session IDs following the same `session-${Date.now()}-${random}` pattern already used in Knowledge Curator.

**When to use:** For both Vision Mentor practice sessions and Master Workshop chat history.

**localStorage keys:**
```javascript
// Vision Mentor practice sessions
'vision_sessions'       // Array<{id, timestamp, score, duration, scenario}>

// Master Workshop orchestrator chat
'orchestrator_session_id' // String: session-${timestamp}-${random}
'orchestrator_history'    // Array<{role, content, timestamp}>

// User profile (aggregated from sessions)
'user_profile'          // { totalSessions, avgScore, certificates[], level }
```

### Pattern 3: Orchestrator Chat UI

**What:** MasterWorkshop.jsx becomes a chat interface with:
1. Agent persona header (协调员/主调度器)
2. Message history using ChatBubble.jsx (reused from Phase 1)
3. Input bar at bottom (text input + send button)
4. Intent indicator (shows which agent is handling the request)

**SSE/streaming note:** Current backend `/api/v1/orchestrator/process` returns a synchronous `OrchestratorResponse`. It does NOT support SSE streaming. The frontend chat should:
- Show a "thinking" indicator (typing dots) while waiting
- Display the complete response when received
- Store messages in localStorage for session continuity
- If streaming is needed later, the backend `rag_service.aquery_stream()` pattern exists and can be applied to orchestrator

### Pattern 4: Vision Mentor — Remove Scenarios, Keep Single Focus

**What:** Strip out the embroidery/clay theme objects, scenario switcher buttons, and evaluation functions. Keep only shadow puppet.

**Frontend changes:**
- Remove `embroidery` and `clay` entries from `theme` object
- Remove 3-scenario switcher from JSX
- Hardcode `activeScenario = 'shadow'`
- Keep `HandTracking` component (minor: update scenario-color mapping to shadow-only)

**Backend changes:**
- Remove `evaluate_embroidery()` and `evaluate_clay()` functions
- Remove `scenario == 'embroidery'` and `scenario == 'clay'` branches in `analyze_pose`
- Refactor `evaluate_shadow()` with angle-based algorithm

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Angle math for finger detection | Custom trig from scratch | Reuse `_calculate_angle` from `pose_analysis_service.py` | Already tested; dot-product formula is numerically stable |
| Session ID generation | Custom session ID logic | Copy Knowledge Curator pattern: `` `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` `` | Consistent across app; already in use |
| Chat message animations | Build chat bubble animations from scratch | Reuse `ChatBubble.jsx` from Phase 1 | Has slideRight/slideLeft variants already configured |
| localStorage typed access | ad-hoc `JSON.parse(localStorage.getItem(...))` | Create `useLocalStorage` hook with typed get/set | Prevents type errors and undefined on first load |

---

## Common Pitfalls

### Pitfall 1: MediaPipe Camera Mirror Orientation Inversion
**What goes wrong:** Landmarks are returned in mirror coordinates. If you calculate angles using raw `x` values, extended fingers might appear on the wrong side.
**Why it happens:** The video is mirrored (`transform: scaleX(-1)`) but landmark coordinates are not un-mirrored.
**How to avoid:** Normalize the hand orientation: flip the x-coordinate (`x_mirror = 1 - landmark.x`) before angle calculations, OR compute angles only from y/z differences (height-based) which are not affected by mirroring.
**Warning signs:** Finger extension angles are inconsistent between left/right hand orientations.

### Pitfall 2: localStorage Schema Migration on First Load
**What goes wrong:** Accessing `JSON.parse(localStorage.getItem('vision_sessions'))` returns `null` on first load, causing `.map()` or `.filter()` crashes.
**Why it happens:** No schema versioning; no null guards.
**How to avoid:** Always use `|| []` or `|| {}` fallbacks: `const sessions = JSON.parse(localStorage.getItem('vision_sessions')) || []`
**Warning signs:** White screen on MyPractice page after fresh browser load.

### Pitfall 3: Chat History Accumulating Without Limit
**What goes wrong:** Every orchestrator message is appended to `orchestrator_history` in localStorage, growing indefinitely.
**Why it happens:** No size cap on the history array.
**How to avoid:** Keep only the last 50 messages: `history.slice(-50)` before saving. Send last 10 messages to orchestrator API (its prompt has a token limit anyway).
**Warning signs:** localStorage quota exceeded errors.

### Pitfall 4: Non-Streaming Orchestrator Feels Slow
**What goes wrong:** Orchestrator `/process` is synchronous and takes 5-15 seconds. The UI appears frozen with just a spinner.
**Why it happens:** Intent detection + task decomposition + LLM aggregation all run serially.
**How to avoid:** Show a multi-stage status indicator: "正在识别意图..." → "正在分解任务..." → "正在执行..." → final answer. This manages expectations without changing backend.
**Warning signs:** Users click send multiple times because they think nothing is happening.

### Pitfall 5: Master Workshop /api/v1/orchestrator/process Returns Full JSON Not SSE
**What goes wrong:** Attempting to use `.body.getReader()` SSE parsing on a regular JSON response.
**Why it happens:** The orchestrator endpoint is NOT an SSE endpoint — it's a standard POST that returns `OrchestratorResponse`.
**How to avoid:** Use `api.post()` (axios) or `fetch()` with `.json()` — NOT SSE parsing. The KnowledgeCurator's SSE streaming pattern does NOT apply here.
**Warning signs:** `response.body.getReader()` — the response body is not a ReadableStream for this endpoint.

---

## Code Examples

### Angle-Based Finger Extension (Python — backend)

```python
# Source: Adapted from pose_analysis_service.py _calculate_angle method
import math

def calculate_angle(p1: Landmark, p2: Landmark, p3: Landmark) -> float:
    """Calculate angle at vertex p2 (p1-p2-p3), returns degrees."""
    # Vector BA = A - B, BC = C - B
    ax, ay = p1.x - p2.x, p1.y - p2.y
    bx, by = p3.x - p2.x, p3.y - p2.y

    dot = ax * bx + ay * by
    mag_a = math.sqrt(ax**2 + ay**2)
    mag_b = math.sqrt(bx**2 + by**2)

    cos_angle = dot / (mag_a * mag_b + 1e-6)
    cos_angle = max(-1.0, min(1.0, cos_angle))  # clamp for float errors
    return math.degrees(math.acos(cos_angle))

def mcp_angle(wrist, mcp, pip) -> float:
    """Angle at MCP joint — straight = ~180, curled = < 100."""
    return calculate_angle(wrist, mcp, pip)
```

### localStorage Session ID Generation (JavaScript — frontend)

```javascript
// Source: KnowledgeCurator.jsx line 40 (existing pattern)
const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('orchestrator_session_id', sessionId);
```

### localStorage Typed Access Hook (JavaScript — frontend)

```javascript
// New hook for practice data
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = React.useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  const setStoredValue = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    localStorage.setItem(key, JSON.stringify(valueToStore));
    setValue(valueToStore);
  };

  return [value, setStoredValue];
}

// Usage:
const [sessions, setSessions] = useLocalStorage('vision_sessions', []);
setSessions(prev => [...prev, { id: Date.now(), score: 92, duration: 45, scenario: 'shadow', timestamp: new Date().toISOString() }]);
```

### Orchestrator Chat API Call (JavaScript — frontend)

```javascript
// Non-streaming POST (NOT SSE)
const response = await fetch('http://localhost:8002/api/v1/orchestrator/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: userMessage,
    session_id: sessionId,
    history: last10Messages  // [{role: 'user'|'assistant', content: '...'}]
  })
});

const data = await response.json();
// data.final_answer — the aggregated response
// data.intent — detected intent {intent, confidence, parameters}
// data.tasks — decomposed tasks
```

### ChatBubble Integration (JavaScript — MasterWorkshop refactor)

```jsx
// Reuse Phase 1 ChatBubble
import ChatBubble from '../components/ChatBubble';

// In message list map:
<ChatBubble
  key={msg.id}
  role={msg.role}  // 'user' | 'assistant'
  content={msg.content}
  timestamp={msg.timestamp}
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Distance-only shadow puppet evaluation (`d_index < 0.3`) | Angle-based MCP joint detection | Phase 2 | Camera-distance invariant; more accurate |
| MasterWorkshop as static landing page | Orchestrator chat UI | Phase 2 | Enables natural-language routing to agents |
| MyPractice mock data (hardcoded stats) | localStorage-driven real data | Phase 2 | Reflects actual user practice |
| 3-scenario VisionMentor switcher | Shadow-only single scenario | Phase 2 | Simpler UX, deeper focus |
| Knowledge Curator streaming (SSE) | Orchestrator sync (non-SSE) | Already exists | No change needed; different API patterns |

---

## Open Questions

1. **Certificate generation format**
   - What we know: Vision Mentor achievements unlock certificates; existing `certificate_service.py` exists in backend
   - What's unclear: PDF vs image? Local generation vs backend API? Exact trigger criteria (score threshold + session count?)
   - Recommendation: Start with image-based certificate using canvas API on frontend; backend `certificate_service.py` can be investigated later

2. **Orchestrator response speed**
   - What we know: `/process` is synchronous, takes 5-15s for complex queries with multiple agent calls
   - What's unclear: Whether this is acceptable for UX or if streaming support is needed
   - Recommendation: Add multi-stage status messages; defer SSE support to Phase 3 if performance is unacceptable

3. **History persistence scope for Master Workshop**
   - What we know: Knowledge Curator uses `session-${date}-${random}` pattern; orchestrator accepts `history` parameter
   - What's unclear: Should orchestrator history persist across page refreshes? (Knowledge Curator's does)
   - Recommendation: Yes — use same localStorage pattern for consistency

---

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies identified — all work is on existing codebase)

Phase 2 modifies existing files and adds localStorage-based features. No new tools, runtimes, or external services are required beyond what is already in the project.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Frontend dev | Verified (project uses Vite) | — | — |
| Python | Backend API | Verified (FastAPI project) | — | — |
| MediaPipe Hands | Vision Mentor | Via CDN jsdelivr | — | — |
| localStorage | MyPractice, MasterWorkshop | Browser API | — | — |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently in project |
| Config file | N/A |
| Quick run command | N/A |
| Full suite command | N/A |

> Note: The project does not have a formal test framework configured. Phase 1 wave 2 completed 14 tasks without automated tests. Phase 2 should be verified through manual UAT following the same pattern as Phase 1.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Manual Verification |
|--------|----------|-----------|---------------------|
| Vision-01 | Shadow puppet gesture correctly scored with angle-based detection | Manual | Hold rabbit hand up; verify score >= 85 |
| Vision-02 | Practice sessions saved to localStorage | Manual | Complete session; refresh page; verify history |
| Vision-03 | Embroidery/clay scenarios removed | Manual | Only shadow scenario accessible |
| Orch-01 | Chat UI renders and accepts input | Manual | Type query; verify response appears |
| Orch-02 | Intent detection routes to correct agent | Manual | Ask about shadow puppet history → Knowledge routing; ask to generate image → Creative routing |
| Profile-01 | MyPractice shows real localStorage data | Manual | Complete Vision sessions; check MyPractice reflects actual scores |
| Profile-02 | Certificates displayed after achievement unlock | Manual | Achieve score >= 85 for 2+ seconds; verify certificate appears |

### Wave 0 Gaps
- [ ] No test infrastructure exists in the project
- [ ] No Wave 0 testing tasks were completed in Phase 1

*(If test infrastructure is desired, it should be addressed in Phase 3 — Integration & Testing)*

---

## Sources

### Primary (HIGH confidence)
- `backend/app/services/pose_analysis_service.py` — `_calculate_angle` method, 3-point angle formula, verified in codebase
- `frontend/src/pages/KnowledgeCurator.jsx` — localStorage session pattern, SSE streaming (for contrast), message rendering
- `frontend/src/components/ChatBubble.jsx` — Phase 1 component, verified in codebase
- `backend/app/api/endpoints/orchestrator.py` — `/process` endpoint signature, synchronous (non-SSE) response model
- `backend/app/api/endpoints/vision_mentor.py` — Current `evaluate_shadow()` distance-only algorithm

### Secondary (MEDIUM confidence)
- MediaPipe Hands landmark structure — 21 landmarks per hand; wrist=0, MCP/PIP indices per finger; widely documented
- Framer Motion `slideRight`/`slideLeft` variants — already used in ChatBubble, documented in Phase 1

### Tertiary (LOW confidence)
- Angle-based finger extension detection approach — training knowledge, not verified against MediaPipe official docs (WebSearch failed during research)
- Certificate generation details — not yet researched; `certificate_service.py` exists but contents not verified

---

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM — MediaPipe via CDN confirmed; no new libraries needed
- Architecture: HIGH — all patterns verified in existing codebase
- Pitfalls: MEDIUM — most identified from code review; angle-based algorithm is training knowledge

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (algorithm approach is stable; if MediaPipe updates landmark indices this would need re-validation)
