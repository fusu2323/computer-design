# Architecture

**Analysis Date:** 2026-03-30

## Pattern Overview

**Overall:** Multi-Agent Orchestration with MCP (Model Context Protocol)

**Key Characteristics:**
- Central orchestrator coordinates three specialized agents via MCP protocol
- Agent-based architecture: Vision Mentor, Knowledge Curator, Creative Artisan
- Frontend React SPA with persistent floating orchestrator chat
- FastAPI backend with modular endpoint routing
- RAG-based knowledge retrieval combining Neo4j KG and Elasticsearch

## Layers

**Frontend (React SPA):**
- Purpose: User interface for interacting with ICH learning system
- Location: `frontend/src/`
- Contains: Pages (routes), Components (UI), Services (API client), Hooks (state)
- Depends on: React 19, Tailwind CSS, MediaPipe (client-side CV), Axios
- Used by: End users accessing via browser

**API Gateway (FastAPI):**
- Purpose: REST API router dispatching requests to appropriate services
- Location: `backend/app/main.py`
- Contains: Router definitions, CORS middleware, endpoint aggregation
- Depends on: Pydantic models, service layer
- Used by: Frontend SPA, external clients

**Service Layer:**
- Purpose: Business logic and external service integration
- Location: `backend/app/services/`
- Contains: `orchestrator_service.py`, `rag_service.py`, `llm_service.py`, `intent_service.py`, `neo4j_service.py`, `image_service.py`
- Depends on: Neo4j, Elasticsearch, DeepSeek LLM, Image generation API
- Used by: API endpoints

**Data Layer:**
- Purpose: Persistent storage for users, knowledge, and practice records
- Location: `backend/app/db/`
- Contains: MySQL (via SQLAlchemy), Neo4j (knowledge graph), Elasticsearch (document search)
- Used by: Service layer

**MCP Orchestrator Sub-system:**
- Purpose: Intent recognition, task decomposition, parallel/serial execution, result aggregation
- Location: `backend/app/services/orchestrator/`
- Contains: `intent_recognition.py`, `task_orchestrator.py`, `mcp_protocol.py`
- Depends on: LLM service, MCP registry
- Used by: Orchestrator endpoint

## Data Flow

**User Query via OmniOrchestrator:**

1. User submits natural language query through floating chat widget
2. Frontend sends POST to `/api/v1/orchestrator/process`
3. `OrchestratorService.process_request()` initiates:
   a. `IntentService.detect_intent()` - LLM-based intent classification (learning/QA/creation)
   b. `OrchestratorService._decompose_tasks()` - LLM breaks query into subtasks with dependencies
   c. `OrchestratorService._execute_tasks()` - Parallel/serial execution via MCP registry
   d. `OrchestratorService._aggregate_results()` - LLM synthesizes final answer
4. Response returned with intent, tasks, results, and final_answer

**Vision Mentor (Hand Tracking):**

1. User navigates to VisionMentor page
2. `HandTracking.jsx` initializes MediaPipe Hands (client-side)
3. Camera feed processed; landmarks extracted at ~5fps
4. Landmarks POSTed to `/api/v1/vision/analyze-pose`
5. Backend evaluates pose against scenario-specific rules (embroidery/clay/shadow)
6. Score and hint returned; AI feedback generated if score >= 85

**Knowledge Curator (RAG Q&A):**

1. User submits question in KnowledgeCurator chat
2. Frontend sends to `/api/v1/knowledge/query`
3. `RAGService.query()` executes:
   a. Keyword extraction via LLM
   b. Neo4j KG search using Cypher MATCH
   c. Elasticsearch document search
   d. Context combination
   e. LLM generates answer from combined context
4. Response includes answer, follow-up questions, related entities

**State Management:**
- Frontend: React useState/useRef hooks; localStorage for session IDs
- Backend: MySQL for user/practice data; Neo4j for knowledge graph; Elasticsearch for documents

## Key Abstractions

**OmniOrchestrator (Frontend):**
- Purpose: Persistent floating chat widget providing unified access to all agents
- Examples: `frontend/src/components/OmniOrchestrator.jsx`
- Pattern: React functional component with hooks; fetches orchestrator API

**OrchestratorService (Backend):**
- Purpose: Central task orchestration engine
- Examples: `backend/app/services/orchestrator_service.py`
- Pattern: Async/await pipeline; task graph with dependency resolution; parallel execution via asyncio.gather

**IntentService:**
- Purpose: Classify user queries into learning/QA/creation/unknown
- Examples: `backend/app/services/intent_service.py`
- Pattern: LLM-based with rule-based fallback; returns structured JSON with confidence

**RAGService:**
- Purpose: Knowledge retrieval augmented generation
- Examples: `backend/app/services/rag_service.py`
- Pattern: Multi-source retrieval (Neo4j + ES) + LLM synthesis

**MCP Registry:**
- Purpose: Method call routing for orchestrator tasks
- Examples: `backend/app/services/mcp_registry.py`
- Pattern: Decorator-based registration; async request/response handling

## Entry Points

**Frontend Build:**
- Location: `frontend/vite.config.ts`
- Triggers: `npm run dev` (Vite dev server on port 5173) or `npm run build` (production)
- Responsibilities: React app bootstrap, asset compilation

**Frontend Runtime:**
- Location: `frontend/src/main.jsx`
- Triggers: Browser loads the SPA
- Responsibilities: ReactDOM.render with Router, Routes, OmniOrchestrator wrapper

**Backend Server:**
- Location: `backend/run.py`
- Triggers: `python run.py`
- Responsibilities: Loads .env, starts uvicorn on `app.main:app` at port 8002

**Backend API:**
- Location: `backend/app/main.py`
- Triggers: HTTP requests to FastAPI
- Responsibilities: CORS setup, router aggregation, request dispatch

**API Endpoints:**
- `POST /api/v1/orchestrator/process` - Main orchestrator entry
- `POST /api/v1/vision/analyze-pose` - Vision analysis
- `POST /api/v1/knowledge/query` - RAG Q&A
- `POST /api/v1/creative/generate` - Image generation
- `GET/POST /api/v1/user/*` - User profile and practice records

## Error Handling

**Strategy:** Layered error handling with graceful degradation

**Patterns:**
- Frontend API client: Interceptors transform errors into user-friendly Chinese messages
- Backend services: try/except blocks with logging; fallback to rule-based methods if LLM fails
- Orchestrator: Fallback task decomposition based on intent type if JSON parsing fails
- Vision endpoint: Returns `{"status": "waiting"}` when no hand detected

**Cross-Cutting Concerns:**

**Logging:** Python logging module with logger per module; console output in services

**Validation:** Pydantic models for all API request/response schemas

**Authentication:** Not implemented; CORS allows all origins in development

**CORS:** Backend allows all origins, methods, headers (`allow_origins=["*"]`)

---

*Architecture analysis: 2026-03-30*
