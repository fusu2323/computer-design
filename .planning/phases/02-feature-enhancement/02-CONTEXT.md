# Phase 2: 功能增强 - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable and connect the three AI agents (Vision Mentor, Knowledge Curator, Creative Artisan) with real interactions, enhance their capabilities, and add a Master Orchestrator frontend. Phase 2 delivers: (1) Vision Mentor focused on shadow puppet with improved algorithm + history, (2) Master Orchestrator chat UI, (3) User profile with local session storage.

</domain>

<decisions>
## Implementation Decisions

### Vision Mentor — Shadow Puppet Focus
- **D-01:** Remove embroidery (苏绣) and clay (紫砂) scenarios — focus ONLY on shadow puppet (皮影戏)
- **D-02:** Optimize shadow puppet evaluation algorithm. Target gesture: rabbit hand shadow (index + middle fingers extended UP, thumb + ring + pinky fingers pinched together). Improve detection accuracy beyond simple distance checks — consider angle-based detection for finger extension.
- **D-03:** Practice session history via localStorage (anonymous sessions, same pattern as Knowledge Curator). Store per-session: timestamp, score, duration, scenario.

### Master Orchestrator (MCP) — Frontend UI
- **D-04:** Transform MasterWorkshop.jsx from a static landing page into an active orchestrator chat UI
- **D-05:** Users type natural language; orchestrator backend (`/api/v1/orchestrator/process`) performs intent detection and routes to the appropriate agent (Vision/Knowledge/Creative)
- **D-06:** Orchestrator page is a dedicated chat interface — not a floating button

### User Profile — MyPractice.jsx
- **D-07:** Anonymous sessions via localStorage (same approach as Knowledge Curator's session IDs)
- **D-08:** Replace mock data with real localStorage data: practice sessions, average scores, sessions count, certificates (Vision Mentor achievements unlock certificates)

### Knowledge Curator — Out of scope
- **D-09:** User deferred Knowledge Curator data population ("暂时不处理这边") — RAG pipeline exists but data seeding is not in scope for Phase 2

### Creative Artisan — As-is
- **D-10:** Creative Artisan (阿里百炼 image generation) is functional. No changes in Phase 2. The existing 3-step flow (upload → enrich → generate image → generate story) is sufficient.

### Claude's Discretion
- Exact shadow puppet algorithm improvement approach (angle-based vs distance-based)
- Master Workshop chat UI design (layout, agent persona display)
- Certificate generation logic for Vision Mentor achievements
- localStorage schema for MyPractice data

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Vision Mentor
- `backend/app/api/endpoints/vision_mentor.py` — Current shadow puppet evaluation logic (evaluate_shadow)
- `frontend/src/pages/VisionMentor.jsx` — Frontend page, 3-scenario switcher (needs reduction to 1)
- `backend/app/services/pose_analysis_service.py` — PoseFeatureExtractor (33-point MediaPipe Pose)
- `frontend/src/components/HandTracking.jsx` — MediaPipe Hands integration (21 landmarks per hand)

### Orchestrator (MCP)
- `backend/app/services/orchestrator_service.py` — Backend orchestrator (intent detection, task routing, parallel execution)
- `backend/app/services/intent_service.py` — Intent detection logic
- `backend/app/services/mcp_registry.py` — MCP method registry
- `frontend/src/pages/MasterWorkshop.jsx` — Current static page (to be transformed to chat UI)

### User Profile
- `frontend/src/pages/MyPractice.jsx` — Current mock data page

### Creative Artisan
- `backend/app/api/endpoints/creative_artisan.py` — enrich-prompt, generate-image, generate-story endpoints
- `frontend/src/pages/CreativeWorkshop.jsx` — Frontend UI (upload → enrich → generate → story)

### Project Design
- `.planning/PROJECT.md` — Project overview, tech stack, design language
- `.planning/phases/01-ui-enhancement/01-CONTEXT.md` — Phase 1 decisions (animation, design tokens, component patterns)
- `PRD.md` §4.1-4.2 — Agent functional requirements

[No external specs — requirements fully captured in decisions above]

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ChatBubble.jsx` (Phase 1) — Can be reused for Master Workshop chat messages
- Knowledge Curator chat UI (`KnowledgeCurator.jsx`) — Reference for streaming chat implementation, session management
- `rag_service.aquery_stream()` — Streaming SSE pattern already implemented; same pattern can be used for orchestrator
- `llm_service.chat()` — Already used in orchestrator_service for intent detection

### Established Patterns
- localStorage session IDs: Knowledge Curator pattern (`session-${Date.now()}-${random}`)
- Streaming responses: SSE `data: {type: "chunk"|"done"|...}` pattern
- Toast notifications: `useToast()` hook for error/success feedback

### Integration Points
- Vision Mentor: `/api/v1/vision/analyze-pose` (POST), `/api/v1/vision/history` (GET - currently returns `{}`)
- Orchestrator: `/api/v1/orchestrator/process` (POST) — expects `{query, session_id?, history?}`
- User profile: No backend endpoint yet — all localStorage based

### Technical Notes
- MediaPipe Hands provides 21 hand landmarks per hand (0=wrist, 4=thumb_tip, 8=index_tip, 12=middle_tip, 16=ring_tip, 20=pinky_tip)
- Current shadow puppet evaluation uses simple 2D distance — angle-based detection would be more robust

</code_context>

<specifics>
## Specific Ideas

- "优化下判定的算法" — Improve the shadow puppet evaluation algorithm specifically
- "移除苏绣和粘土暂时先把皮影这个做好吧" — Remove embroidery and clay, focus on shadow puppet first
- "暂时不处理这边" (Knowledge Curator data) — Deferred to future phase

</specifics>

<deferred>
## Deferred Ideas

- Knowledge Curator data population (Neo4j + Elasticsearch seeding) — future phase
- Embroidery (苏绣) scenario — deferred (user requested removal)
- Clay (紫砂) scenario — deferred (user requested removal)
- Full user authentication — localStorage sessions only in this phase
- Voice input — not discussed, out of scope
- Body pose (full skeleton tracking) — not discussed, out of scope
- ControlNet/sketch-to-image — out of scope (Creative Artisan kept as-is)

### Reviewed Todos (not folded)
None — no todos matched Phase 2 scope

</deferred>

---

*Phase: 02-feature-enhancement*
*Context gathered: 2026-03-31*
