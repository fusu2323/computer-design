# Codebase Concerns

**Analysis Date:** 2026-03-30

## Tech Debt

**API Keys Hardcoded in Source:**
- Issue: `DEEPSEEK_API_KEY` and `NEO4J_PASSWORD` have default values hardcoded in `backend/app/core/config.py`
- Files: `backend/app/core/config.py` (lines 11, 21)
- Impact: If .env is missing or misconfigured, fallback credentials are used
- Fix approach: Remove default values; fail fast if env vars are missing

**CORS Wide Open:**
- Issue: `allow_origins=["*"]` in `backend/app/main.py` permits any origin
- Files: `backend/app/main.py` (lines 14)
- Impact: API accepts requests from any website in production
- Fix approach: Use environment-specific allowed origins list

**Hardcoded Backend URLs in Frontend:**
- Issue: Frontend components use `http://localhost:8002` directly
- Files:
  - `frontend/src/components/OmniOrchestrator.jsx` (line 33)
  - `frontend/src/pages/KnowledgeCurator.jsx` (line 50)
  - `frontend/src/pages/VisionMentor.jsx` (not directly, but via api.js)
- Impact: No environment-based API URL configuration
- Fix approach: Use `import.meta.env.VITE_API_BASE_URL` consistently

**Placeholder Implementations:**
- `PoseComparator.__init__` contains only `pass` - class is instantiated but constructor does nothing
- Files: `backend/app/services/pose_comparator.py` (line 12)
- `vision_mentor.py` `/history` endpoint returns empty array as placeholder
- Files: `backend/app/api/endpoints/vision_mentor.py` (line 134)
- `certificate.py` has `pass` where certificate restriction logic should be
- Files: `backend/app/api/endpoints/certificate.py` (line 33)

**Windows-Only Font Path:**
- Issue: Certificate service hardcodes `C:\Windows\Fonts\simkai.ttf`
- Files: `backend/app/services/certificate_service.py` (line 11)
- Impact: Certificate generation fails on Linux/macOS
- Fix approach: Use environment variable or find font dynamically

**Test File Contains Password Attempts:**
- Issue: `test_connection.py` contains hardcoded password list for Neo4j
- Files: `backend/test_connection.py` (line 6)
- Impact: Accidental credential exposure risk
- Fix approach: Remove test file or use environment-based credentials

## Known Bugs

**Scenario Button Styling Issue:**
- Issue: Dynamic `backgroundColor` inline style overrides Tailwind class, causing incorrect button appearance
- Files: `frontend/src/pages/VisionMentor.jsx` (lines 163-169)
- Trigger: Clicking scenario switcher buttons
- Workaround: Inline styles work but prevent Tailwind optimization

**MediaPipe Resource Cleanup:**
- Issue: `hands.close()` commented out in cleanup
- Files: `frontend/src/components/HandTracking.jsx` (line 67)
- Trigger: Unmounting HandTracking component or strict mode re-renders
- Workaround: Memory leak potential with repeated mount/unmount

**Stream Error Silent Failure:**
- Issue: SSE stream errors in `KnowledgeCurator.jsx` only log to console, user sees no feedback
- Files: `frontend/src/pages/KnowledgeCurator.jsx` (line 152)
- Trigger: Network interruption during streaming response
- Workaround: User sees "发送中..." indefinitely

## Security Considerations

**API Key Exposure:**
- Risk: `DEEPSEEK_API_KEY` in config.py could be committed to git
- Files: `backend/app/core/config.py`
- Current mitigation: Supposed to use .env, but defaults exist
- Recommendations: Add config to gitignore, remove defaults, add validation

**SQL Injection Potential in Neo4j Query:**
- Risk: User input directly interpolated into Cypher query
- Files: `backend/app/services/rag_service.py` (line 82)
- Current mitigation: LIMIT 20 on query
- Recommendations: Use parameterized queries for Neo4j

**No Authentication on User Endpoints:**
- Risk: Any client can access/modify any user's profile, practice records, works
- Files: `backend/app/api/endpoints/user_profile.py`
- Current mitigation: Defaults to user_id=1 in some endpoints
- Recommendations: Add authentication middleware and user ownership checks

**CORS Allows All Origins:**
- Risk: APIs callable from any website
- Files: `backend/app/main.py`
- Current mitigation: None
- Recommendations: Restrict to known frontend origins

## Performance Bottlenecks

**MediaPipe Processing Load:**
- Problem: MediaPipe Hands runs entirely in browser, may cause high CPU on low-end devices
- Files: `frontend/src/components/HandTracking.jsx`
- Cause: Complex hand landmark detection at 30fps
- Improvement path: Reduce framerate further or offload to WebWorker

**No API Response Caching:**
- Problem: RAG queries hit LLM every time, no caching of frequent questions
- Files: `backend/app/services/rag_service.py`
- Cause: Simple implementation without Redis/memory cache
- Improvement path: Add response caching layer

**Database N+1 Potential:**
- Problem: Each user ability update fetches last 10 practice records
- Files: `backend/app/api/endpoints/user_profile.py` (lines 267-269)
- Cause: Query inside loop when updating abilities
- Improvement path: Batch queries or single aggregate query

**Image Generation Timeout:**
- Problem: 60 second timeout for image generation may not be enough under load
- Files: `backend/app/services/image_service.py` (line 39)
- Cause: External API dependency
- Improvement path: Increase timeout, add queue for async generation

## Fragile Areas

**Certificate Generation:**
- Files: `backend/app/services/certificate_service.py`
- Why fragile: Hardcoded font paths, Windows-specific, no error recovery for font loading
- Safe modification: Test on all platforms, make font detection more robust
- Test coverage: No test coverage for certificate generation

**RAG Keyword Extraction:**
- Files: `backend/app/services/rag_service.py` (lines 20-43)
- Why fragile: Falls back to returning original query if LLM fails, may cause poor search results
- Safe modification: Improve fallback to use basic NLP keyword extraction
- Test coverage: No unit tests for keyword extraction

**Intent Detection Fallback:**
- Files: `backend/app/services/orchestrator_service.py` (lines 104-114)
- Why fragile: If task decomposition fails, falls back to basic single-task execution
- Safe modification: Add better error recovery and logging
- Test coverage: Integration tests exist but may not cover all failure modes

**Orchestrator Task Dependencies:**
- Files: `backend/app/services/orchestrator_service.py` (lines 116-160)
- Why fragile: Deadlock detection breaks loop without completing remaining tasks
- Safe modification: Log which tasks were skipped, continue processing
- Test coverage: Limited

## Scaling Limits

**In-Memory Session Storage:**
- Current capacity: Limited by server memory for LangChain chat history
- Limit: Sessions accumulate indefinitely in `LangChainService.store`
- Scaling path: Persist session history to database, implement LRU eviction

**Elasticsearch Connection:**
- Current capacity: Single ES connection from settings
- Limit: No connection pooling visible
- Scaling path: Configure ES connection pool, consider cluster setup

**MySQL Connection Pool:**
- Current capacity: Default SQLAlchemy pool (5 connections)
- Limit: May exhaust under concurrent load
- Scaling path: Configure `pool_size` and `max_overflow` in engine creation

**RAG Service Initialization:**
- Current capacity: Creates ES and Neo4j connections at import time
- Limit: Startup fails if any service unavailable
- Scaling path: Lazy initialization with retry logic

## Dependencies at Risk

**MediaPipe CDN Dependency:**
- Risk: `cdn.jsdelivr.net` must be reachable for hand tracking to work
- Impact: App fails completely without internet or if CDN is down
- Migration plan: Bundle MediaPipe files locally in `public/` folder

**External Image Generation API:**
- Risk: `api.siliconflow.cn` is external paid service
- Impact: Image generation fails if API key invalid, quota exceeded, or service down
- Migration plan: Implement fallback to local Stable Diffusion or queue-based retry

**DeepSeek LLM API:**
- Risk: External API with rate limits and potential downtime
- Impact: All AI features fail simultaneously
- Migration plan: Add circuit breaker, fallback to cached responses

## Missing Critical Features

**User Authentication:**
- Problem: No login/registration flow
- Blocks: Multi-user support, personalized data, secure profile access

**Error Boundaries:**
- Problem: React components have no error boundaries
- Blocks: Graceful degradation when one component fails

**Input Validation:**
- Problem: Minimal Pydantic validation on backend
- Blocks: Garbage data storage, potential abuse

**Frontend Environment Config:**
- Problem: No `.env.example` or documentation for required env vars
- Blocks: Onboarding new developers

## Test Coverage Gaps

**Backend Services:**
- What's not tested: `rag_service.py` keyword extraction, `certificate_service.py` generation
- Files:
  - `backend/app/services/rag_service.py`
  - `backend/app/services/certificate_service.py`
  - `backend/app/services/pose_comparator.py`
- Risk: Refactoring these services could break without detection
- Priority: Medium

**Frontend Components:**
- What's not tested: `HandTracking.jsx` MediaPipe integration, `OmniOrchestrator.jsx` chat flow
- Files:
  - `frontend/src/components/HandTracking.jsx`
  - `frontend/src/components/OmniOrchestrator.jsx`
- Risk: UI regression goes unnoticed
- Priority: Medium

**API Integration Points:**
- What's not tested: Full orchestrator flow from HTTP request through all agents
- Files: `backend/app/api/endpoints/orchestrator.py`
- Risk: Breaking changes in one agent not caught
- Priority: High

---

*Concerns audit: 2026-03-30*
