# External Integrations

**Analysis Date:** 2026-03-30

## APIs & External Services

**LLM (Large Language Model):**
- DeepSeek API - Primary LLM for knowledge curator and orchestrator
  - Base URL: `https://api.deepseek.com`
  - Model: `deepseek-chat`
  - Auth: `DEEPSEEK_API_KEY` environment variable
  - Config: `backend/app/core/config.py`

**Image Generation:**
- SiliconFlow API - Image generation (FLUX/Kolors models)
  - Base URL: `https://api.siliconflow.cn/v1/images/generations`
  - Model: `Kwai-Kolors/Kolors` (default)
  - Auth: `IMAGE_API_KEY` environment variable
  - Config: `backend/app/core/config.py`
  - Registration: `https://cloud.siliconflow.cn/`

## Data Storage

**Graph Database:**
- Neo4j
  - Connection: `bolt://localhost:7687` (default)
  - Auth: `NEO4J_USER`, `NEO4J_PASSWORD` environment variables
  - Driver: `neo4j` Python package
  - Service: `backend/app/services/neo4j_service.py`
  - Purpose: Knowledge graph for ICH (Intangible Cultural Heritage) data

**Relational Database:**
- MySQL
  - Host: `localhost:3306` (default)
  - Auth: `MYSQL_USER`, `MYSQL_PASSWORD` environment variables
  - Database: `inheritor_db`
  - Driver: `mysql-connector-python` + `sqlalchemy`
  - Service: `backend/app/db/mysql_db.py`
  - Purpose: User profiles, certificates, practice history

**Search Engine:**
- Elasticsearch (planned)
  - URL: `http://localhost:9200` (default)
  - Index: `ich_knowledge`
  - Env: `ES_URL`, `ES_INDEX_NAME`
  - Purpose: RAG knowledge retrieval

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication (not detected in current code)
- User system: `backend/app/api/endpoints/user_profile.py`
- Certificate generation: `backend/app/services/certificate_service.py`

## Computer Vision

**Hand Tracking:**
- MediaPipe Hands (client-side)
  - CDN: `jsdelivr` (@mediapipe/hands via CDN)
  - Frontend component: `frontend/src/components/HandTracking.jsx`
  - Models: `@mediapipe/hands`, `@mediapipe/camera_utils`, `@mediapipe/drawing_utils`

**Pose Analysis:**
- TensorFlow.js (client-side)
  - Package: `@tensorflow/tfjs` 4.22.0
  - Purpose: ST-GCN pose comparison (planned)
  - Service: `backend/app/services/pose_comparison_service.py` (planned)

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Python `print()` statements (development)
- FastAPI default logging

## CI/CD & Deployment

**Hosting:**
- Not configured

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars (backend):**
```
DEEPSEEK_API_KEY=<deepseek-api-key>
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=<password>
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=inheritor_db
ES_URL=http://localhost:9200
ES_INDEX_NAME=ich_knowledge
IMAGE_API_KEY=<siliconflow-api-key>
IMAGE_API_URL=https://api.siliconflow.cn/v1/images/generations
IMAGE_MODEL=Kwai-Kolors/Kolors
```

**Secrets location:**
- `backend/.env` - Local environment (not committed to git)
- `backend/.env.example` - Template for required variables

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- SiliconFlow API for image generation
- DeepSeek API for LLM inference

---

*Integration audit: 2026-03-30*
