from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.services.neo4j_service import neo4j_service

router = APIRouter()

class MarkerSite(BaseModel):
    id: str
    name: str
    category: str
    latitude: float
    longitude: float
    address: str
    description: Optional[str] = ""
    imageUrl: Optional[str] = ""

class MarkerResponse(BaseModel):
    markers: List[MarkerSite]

@router.get("/markers", response_model=MarkerResponse)
async def get_markers():
    """
    GET /api/v1/map/markers
    Returns all ICH sites with coordinates from Neo4j.
    Uses Heritage nodes that have latitude/longitude properties.
    """
    cypher = """
    MATCH (h:Heritage)
    WHERE h.latitude IS NOT NULL AND h.longitude IS NOT NULL
    RETURN h.id AS id,
           h.name AS name,
           h.category AS category,
           h.latitude AS latitude,
           h.longitude AS longitude,
           COALESCE(h.address, '') AS address,
           COALESCE(h.description, '') AS description,
           COALESCE(h.imageUrl, '') AS imageUrl
    """
    results = neo4j_service.query(cypher)
    if results is None:
        return {"markers": []}
    markers = [MarkerSite(**r) for r in results]
    return {"markers": markers}

class NearbySite(BaseModel):
    id: str
    name: str
    category: str
    latitude: float
    longitude: float
    address: str
    distance: float  # meters
    description: Optional[str] = ""
    imageUrl: Optional[str] = ""

class NearbyResponse(BaseModel):
    sites: List[NearbySite]

@router.get("/nearby", response_model=NearbyResponse)
async def get_nearby(
    lat: float = Query(..., description="User latitude in GCJ-02"),
    lng: float = Query(..., description="User longitude in GCJ-02"),
    radius: int = Query(5000, description="Search radius in meters (1000/5000/10000/20000)")
):
    """
    GET /api/v1/map/nearby?lat=35.0&lng=105.0&radius=5000
    Returns ICH sites within the specified radius from the user's location.
    Uses Haversine formula for distance calculation in meters.
    """
    cypher = """
    MATCH (h:Heritage)
    WHERE h.latitude IS NOT NULL AND h.longitude IS NOT NULL
    WITH h, round(distance(point({latitude: $lat, longitude: $lng}),
                          point({latitude: h.latitude, longitude: h.longitude}))) AS dist
    WHERE dist <= $radius
    RETURN h.id AS id,
           h.name AS name,
           h.category AS category,
           h.latitude AS latitude,
           h.longitude AS longitude,
           COALESCE(h.address, '') AS address,
           COALESCE(h.description, '') AS description,
           COALESCE(h.imageUrl, '') AS imageUrl,
           dist AS distance
    ORDER BY dist ASC
    """
    results = neo4j_service.query(cypher, {"lat": lat, "lng": lng, "radius": radius})
    if results is None:
        return {"sites": []}
    sites = [NearbySite(**r) for r in results]
    return {"sites": sites}
