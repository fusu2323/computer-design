# Testing Patterns

**Analysis Date:** 2026-03-30

## Test Framework

**Frontend:**
- No test framework configured
- No test files found in `frontend/src/`
- ESLint configured but no testing plugins (e.g., no vitest, jest)

**Backend:**
- No formal test framework (pytest not configured)
- Test files exist as manual scripts for API testing:
  - `backend/test_pose_api.py` - API endpoint testing
  - `backend/test_llm_service.py` - LLM service testing
  - `backend/test_image_api.py` - Image generation API
  - `backend/test_orchestrator.py` - Orchestrator testing
  - `backend/test_connection.py` - Connection testing
  - `backend/test_user_api_full.py` - User API testing
  - `backend/test_intent_speed_acc.py` - Performance testing
- No pytest.ini or test configuration files

**Run Commands:**
```bash
# Frontend (if tests existed)
npm test           # Run tests
npm run lint       # Run ESLint

# Backend (manual test scripts)
python test_pose_api.py      # Test pose API
python test_llm_service.py   # Test LLM service
```

## Test File Organization

**Location:**
- Backend tests: Root level of `backend/` directory
- Frontend tests: Not implemented
- Test files are standalone scripts, not organized into directories

**Naming:**
- Pattern: `test_*.py` for standalone test scripts
- No consistent naming (e.g., `test_connection.py`, `test_pose_api.py`)

**Structure:**
```
backend/
├── test_*.py          # Standalone test scripts
└── app/
    └── services/      # No co-located tests
```

## Test Structure

**Backend (Manual Scripts):**

Example from `backend/test_pose_api.py`:
```python
def create_mock_landmarks(pose_type="neutral"):
    # Generate mock MediaPipe landmarks
    ...

def test_api(pose_type="neutral", target_pose="orchid_hand_left"):
    url = "http://localhost:8002/api/v1/vision/analyze-pose"
    payload = {...}
    response = requests.post(url, json=payload)
    # Assertions on response
    ...

if __name__ == "__main__":
    test_api("neutral", "orchid_hand_left")
```

Example from `backend/test_llm_service.py`:
```python
async def test_llm_service():
    session_id = "test-user-001"
    kg_context = "..."
    question = "皮影戏是什么？"
    answer, _ = langchain_service.answer_with_context(...)
    print(f"Assistant: {answer}")

if __name__ == "__main__":
    asyncio.run(test_llm_service())
```

**Patterns:**
- Direct function calls to services
- HTTP requests via requests library
- Print-based assertions (no assertion library)
- No test framework structure (no unittest.TestCase, no pytest)

**No Setup/Teardown:**
- Tests don't use fixtures or setup methods
- Each test file is self-contained

## Mocking

**Framework:** None

**Manual Mocks:**
- Mock data created in test files (e.g., `create_mock_landmarks()`)
- No mocking library (no unittest.mock, no pytest-mock)

**What to Mock:**
- Not applicable - no formal mocking patterns

**What NOT to Mock:**
- External APIs tested directly (e.g., POST to localhost:8002)
- LLM service tested against real DeepSeek API

## Fixtures and Factories

**Test Data:**
- Hardcoded mock data in test scripts
- Example: MediaPipe landmark arrays in `test_pose_api.py`

**Location:**
- Inline with test files
- No separate fixtures directory

## Coverage

**Requirements:** None enforced

**View Coverage:** No coverage tool configured

## Test Types

**Unit Tests:**
- Not implemented
- No test files for individual functions/classes

**Integration Tests:**
- Backend API tests via HTTP requests
- Example: `test_pose_api.py` tests POST endpoint

**E2E Tests:**
- Not implemented
- No Playwright, Cypress, or similar

## Common Patterns

**Async Testing:**
```python
import asyncio

async def test_llm_service():
    async for chunk in langchain_service.stream_answer_with_context(...):
        print(chunk, end="", flush=True)

asyncio.run(test_llm_service())
```

**Error Testing:**
- Not implemented in test scripts
- Backend services return error messages but no explicit error testing

**API Testing:**
```python
import requests

response = requests.post(url, json=payload)
if response.status_code == 200:
    data = response.json()
    print(f"Score: {data['score']}")
```

## Testing Gaps

**Frontend:**
- No test framework (Jest, Vitest)
- No test files
- No component tests
- No utility function tests

**Backend:**
- No pytest or unittest
- Manual test scripts only
- No assertions (print-based validation)
- No test isolation
- No test fixtures
- No test coverage

**Recommendations for Future Development:**
1. Install and configure Jest or Vitest for frontend
2. Add pytest for backend with proper test structure
3. Create test directories: `frontend/src/__tests__/`, `backend/tests/`
4. Add mock utilities for external services
5. Add API integration tests with assertions
6. Add component snapshot tests

---

*Testing analysis: 2026-03-30*