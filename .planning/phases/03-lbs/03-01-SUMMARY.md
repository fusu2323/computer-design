---
phase: "03-lbs"
plan: "01"
subsystem: backend
tags:
  - map-api
  - neo4j
  - lbs
  - fastapi
dependency_graph:
  requires:
    - neo4j_service
  provides:
    - GET /api/v1/map/markers
    - GET /api/v1/map/nearby
  affects:
    - backend/app/main.py
    - backend/tests/
tech_stack:
  added:
    - FastAPI endpoints (map.py)
    - Neo4j coordinate seeding (seed_coordinates.py)
    - pytest test suite (test_map_api.py)
  patterns:
    - GCJ-02 coordinate system (WeChat standard)
    - Neo4j spatial queries with distance()
    - Pydantic response models
key_files:
  created:
    - backend/app/api/endpoints/map.py
    - backend/app/db/seed_coordinates.py
    - backend/tests/test_map_api.py
    - backend/tests/__init__.py
  modified:
    - backend/app/main.py
decisions:
  - Use Neo4j built-in point() and distance() functions for spatial queries instead of Haversine formula in Python
  - GCJ-02 coordinate system (matches WeChat wx.getLocation standard)
  - Graceful degradation: return empty list if Neo4j connection fails
metrics:
  duration_seconds: 127
  completed: "2026-04-01T12:30:25Z"
  tasks_completed: 4
  files_created: 4
  commits: 4
requirements_completed:
  - MAP-01: Backend API support for national ICH map display
  - MAP-02: Backend API support for marker tap → cultural intro
  - MAP-03: Backend API support for nearby heritage discovery
  - MAP-04: Backend API support for navigation to heritage sites
---

# Phase 03-01 Plan Summary

## One-liner

Map API endpoints with Neo4j coordinate seeding for national ICH map and LBS features.

## Completed Tasks

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create map API endpoints | ae0428d | backend/app/api/endpoints/map.py |
| 2 | Create coordinate seed script | f0cfc26 | backend/app/db/seed_coordinates.py |
| 3 | Register map router in main.py | 8db9481 | backend/app/main.py |
| 4 | Create pytest test suite | 7fd7cea | backend/tests/test_map_api.py, backend/tests/__init__.py |

## What Was Built

### `backend/app/api/endpoints/map.py`
- `GET /api/v1/map/markers` - Returns all Heritage nodes with lat/lng coordinates
- `GET /api/v1/map/nearby` - Returns Heritage sites within specified radius (meters)
- Uses Neo4j `distance()` and `point()` functions for spatial queries
- Pydantic models: `MarkerSite`, `NearbySite`, `MarkerResponse`, `NearbyResponse`
- Graceful degradation: returns empty list if Neo4j unavailable

### `backend/app/db/seed_coordinates.py`
- 13 sample ICH sites across China with GCJ-02 coordinates
- Categories: ceramics (3), embroidery (4), paper-cutting (3), weaving (3)
- `seed_coordinates()` - Sets lat/lng/address on Heritage nodes by name matching
- `verify_coordinates()` - Returns count and names, raises RuntimeError if < 5 nodes
- Run: `cd backend && python -m app.db.seed_coordinates`

### `backend/app/main.py`
- Added `map` to imports
- `app.include_router(map.router, prefix="/api/v1/map", tags=["Map"])`

### `backend/tests/test_map_api.py`
- 9 pytest tests covering both endpoints
- Tests: status codes, response structure, field presence, parameter validation

## Deviations from Plan

None - plan executed exactly as written.

## Commits

- `ae0428d` feat(03-01): add map API endpoints for markers and nearby search
- `f0cfc26` feat(03-01): add coordinate seed script for Heritage nodes
- `8db9481` feat(03-01): register map router in main.py
- `7fd7cea` test(03-01): add pytest suite for map API endpoints

## Self-Check

| Check | Result |
|-------|--------|
| backend/app/api/endpoints/map.py exists | FOUND |
| GET /map/markers endpoint defined | FOUND |
| GET /map/nearby endpoint defined | FOUND |
| backend/app/db/seed_coordinates.py exists | FOUND |
| >= 10 sample ICH site coordinates | FOUND (13 sites) |
| backend/app/main.py imports map | FOUND |
| backend/app/main.py registers map.router | FOUND |
| backend/tests/test_map_api.py exists | FOUND |
| pytest tests for both endpoints | FOUND (9 tests) |
| All 4 commits exist | FOUND |

## Self-Check: PASSED
