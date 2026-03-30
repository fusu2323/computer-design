# Codebase Structure

**Analysis Date:** 2026-03-30

## Directory Layout

```
computer-design/
├── frontend/                    # React 19 SPA
│   ├── src/
│   │   ├── main.jsx                # Entry point
│   │   ├── index.css                # Tailwind imports + global styles
│   │   ├── assets/                  # Images (PNG, JSON data)
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Route page components
│   │   ├── hooks/                   # Custom React hooks
│   │   └── services/                # API client modules
│   ├── public/                      # Static assets served as-is
│   ├── index.html                   # HTML shell
│   ├── vite.config.ts              # Vite bundler config
│   ├── tailwind.config.js          # Tailwind theme (Chinese aesthetics)
│   ├── tsconfig*.json              # TypeScript configs
│   └── package.json
├── backend/                     # FastAPI Python backend
│   ├── app/
│   │   ├── main.py                  # FastAPI app, router aggregation
│   │   ├── api/endpoints/          # API route handlers
│   │   ├── core/                    # Config, MCP protocol
│   │   ├── db/                     # Database utilities, migrations, seeds
│   │   └── services/               # Business logic, external integrations
│   │       └── orchestrator/       # Orchestrator sub-system
│   ├── run.py                       # Entry point (uvicorn launch)
│   ├── requirements.txt             # Python dependencies
│   └── test_*.py                   # Ad-hoc test scripts
├── .planning/codebase/           # GSD planning documents
├── spec/                         # Specification documents
└── *.json, *.md                  # Project data, docs
```

## Directory Purposes

**Frontend Structure:**

**`frontend/src/pages/`:**
- Purpose: Route-level page components
- Contains: `Home.jsx`, `VisionMentor.jsx`, `KnowledgeCurator.jsx`, `CreativeWorkshop.jsx`, `CraftLibrary.jsx`, `MyPractice.jsx`, `ShadowPuppet.jsx`, `Intro.jsx`
- Key files: `Home.jsx` (agent overview), `VisionMentor.jsx` (hand tracking), `KnowledgeCurator.jsx` (RAG chat)

**`frontend/src/components/`:**
- Purpose: Reusable UI components
- Contains: `HandTracking.jsx` (MediaPipe), `Navbar.jsx`, `OmniOrchestrator.jsx` (floating chat), `AbilityRadarChart.jsx`, `ArtifactCard.jsx`, `TaskPipelineVisualizer.jsx`, `Toast.jsx`, `ErrorBoundary.jsx`

**`frontend/src/services/`:**
- Purpose: API client configuration
- Contains: `api.js` (Axios instance with interceptors), `endpoints.js` (URL constants)

**`frontend/src/hooks/`:**
- Purpose: Custom React hooks
- Contains: `useToast.js`

**`frontend/src/assets/`:**
- Purpose: Static images (craft backgrounds), JSON data (china.json)

**Backend Structure:**

**`backend/app/api/endpoints/`:**
- Purpose: FastAPI router modules (one per domain)
- Contains: `vision_mentor.py`, `knowledge_curator.py`, `creative_artisan.py`, `orchestrator.py`, `user_profile.py`, `certificate.py`

**`backend/app/services/`:**
- Purpose: Business logic and external service adapters
- Contains:
  - `orchestrator_service.py` - Main orchestration engine
  - `rag_service.py` - RAG implementation (Neo4j + ES + LLM)
  - `llm_service.py` - DeepSeek LLM integration
  - `intent_service.py` - Intent classification
  - `neo4j_service.py` - Neo4j driver wrapper
  - `image_service.py` - Image generation API client
  - `certificate_service.py` - PDF certificate generation
  - `pose_analysis_service.py`, `pose_comparator.py` - Vision analysis logic
  - `standard_pose_library.py` - Reference poses

**`backend/app/services/orchestrator/`:**
- Purpose: Orchestrator sub-components
- Contains: `intent_recognition.py` (LLM + fallback), `task_orchestrator.py` (parallel execution), `mcp_protocol.py` (MCP types)

**`backend/app/core/`:**
- Purpose: Core configuration and protocols
- Contains: `config.py` (Pydantic Settings), `mcp.py` (MCP Pydantic models)

**`backend/app/db/`:**
- Purpose: Database utilities, migrations, seed data
- Contains: `mysql_db.py` (SQLAlchemy models), `seed.py` (Neo4j seed data), `init_db.py`, migration/import scripts

## Key File Locations

**Entry Points:**
- `frontend/src/main.jsx` - React app bootstrap, router setup
- `backend/run.py` - Python server entry, uvicorn launch
- `backend/app/main.py` - FastAPI app factory, router aggregation

**Configuration:**
- `frontend/vite.config.ts` - Vite build config (React plugin only)
- `frontend/tailwind.config.js` - Custom theme colors (ink-black, vermilion, cyan-glaze, tea-green, rice-paper)
- `backend/app/core/config.py` - All settings (DB, LLM, ES, image API)

**Core Logic:**
- `frontend/src/components/OmniOrchestrator.jsx` - Unified chat interface
- `frontend/src/pages/VisionMentor.jsx` - Hand tracking + pose analysis
- `frontend/src/components/HandTracking.jsx` - MediaPipe Hands integration
- `backend/app/services/orchestrator_service.py` - Central orchestration
- `backend/app/services/rag_service.py` - Knowledge Q&A

**API Client:**
- `frontend/src/services/api.js` - Axios instance (baseURL: localhost:8002)
- `frontend/src/services/endpoints.js` - Endpoint URL constants

**Testing:**
- `backend/test_*.py` - Ad-hoc test scripts in backend root
- No formal test directory; tests co-located with scripts

## Naming Conventions

**Files:**

- Frontend React: PascalCase (`VisionMentor.jsx`, `HandTracking.jsx`)
- Frontend services/hooks: camelCase (`api.js`, `useToast.js`, `endpoints.js`)
- Backend Python: snake_case (`orchestrator_service.py`, `rag_service.py`, `intent_service.py`)
- Backend endpoints: snake_case (`vision_mentor.py`, `knowledge_curator.py`)
- Config files: camelCase or kebab-case (`vite.config.ts`, `tailwind.config.js`)

**Directories:**

- Frontend: camelCase for special dirs (`components/`, `pages/`, `services/`, `hooks/`, `assets/`)
- Backend: snake_case (`api/endpoints/`, `core/`, `db/`, `services/`)

**TypeScript/JavaScript:**
- Functions/components: PascalCase for components, camelCase for functions/hooks
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

**Python:**
- Classes: PascalCase (`OrchestratorService`, `RAGService`, `IntentService`)
- Functions/methods: snake_case
- Variables: snake_case
- Constants: UPPER_SNAKE_CASE

## Where to Add New Code

**New Frontend Page:**
- Primary code: `frontend/src/pages/{FeatureName}.jsx`
- Add route in `frontend/src/main.jsx`: `<Route path="/feature-name" element={<FeatureName />} />`

**New Frontend Component:**
- Implementation: `frontend/src/components/{ComponentName}.jsx`
- Export and import in pages that use it

**New Backend API Endpoint:**
- Router file: `backend/app/api/endpoints/{domain}.py`
- Register router in `backend/app/main.py`: `app.include_router({domain}.router, prefix=...)`
- Request/response models: Pydantic BaseModel classes at top of file

**New Backend Service:**
- Implementation: `backend/app/services/{service_name}.py`
- Register with MCP if callable from orchestrator: `@mcp_registry.register("method_name")`

**New Orchestrator Capability:**
- MCP method: Add handler in `backend/app/services/orchestrator_service.py` using `@mcp_registry.register()`
- Task decomposition: Modify `_decompose_tasks()` system prompt or add intent-specific handling

**Utilities:**
- Shared helpers: `backend/app/services/` (Python) or `frontend/src/services/` (JS)

## Special Directories

**`frontend/node_modules/`:**
- Purpose: npm package installations
- Generated: Yes (by npm install)
- Committed: No (.gitignore)

**`frontend/public/`:**
- Purpose: Static assets served as-is (favicon, etc.)
- Generated: No
- Committed: Yes

**`backend/app/__pycache__/`:**
- Purpose: Python bytecode cache
- Generated: Yes (Python runtime)
- Committed: No

**`.planning/codebase/`:**
- Purpose: GSD planning documents (STACK.md, ARCHITECTURE.md, etc.)
- Generated: No (written by GSD mapper)
- Committed: Yes

**`spec/`:**
- Purpose: Specification documents
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-30*
