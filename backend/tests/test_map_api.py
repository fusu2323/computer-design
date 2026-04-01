"""
Test suite for map API endpoints.
Run: pytest tests/test_map_api.py -v

Note: These tests require the backend to be running and Neo4j to be seeded.
For local development without Neo4j, tests will gracefully handle connection failures.
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)


class TestMapMarkersEndpoint:
    """Tests for GET /api/v1/map/markers"""

    def test_markers_endpoint_returns_200(self):
        """Endpoint should return 200 status"""
        response = client.get("/api/v1/map/markers")
        assert response.status_code == 200

    def test_markers_returns_expected_structure(self):
        """Response should have 'markers' key with list value"""
        response = client.get("/api/v1/map/markers")
        data = response.json()
        assert "markers" in data
        assert isinstance(data["markers"], list)

    def test_markers_fields(self):
        """Each marker should have required fields"""
        response = client.get("/api/v1/map/markers")
        data = response.json()
        markers = data.get("markers", [])

        if len(markers) > 0:
            marker = markers[0]
            required_fields = ["id", "name", "category", "latitude", "longitude", "address"]
            for field in required_fields:
                assert field in marker, f"Marker missing required field: {field}"


class TestMapNearbyEndpoint:
    """Tests for GET /api/v1/map/nearby"""

    def test_nearby_endpoint_returns_200(self):
        """Endpoint should return 200 status with valid params"""
        response = client.get("/api/v1/map/nearby?lat=35.0&lng=105.0&radius=5000")
        assert response.status_code == 200

    def test_nearby_returns_expected_structure(self):
        """Response should have 'sites' key with list value"""
        response = client.get("/api/v1/map/nearby?lat=35.0&lng=105.0&radius=5000")
        data = response.json()
        assert "sites" in data
        assert isinstance(data["sites"], list)

    def test_nearby_has_distance_field(self):
        """Each nearby site should have distance field"""
        response = client.get("/api/v1/map/nearby?lat=35.0&lng=105.0&radius=5000")
        data = response.json()
        sites = data.get("sites", [])

        if len(sites) > 0:
            site = sites[0]
            assert "distance" in site, "Site missing distance field"

    def test_nearby_radius_parameter(self):
        """Endpoint should accept radius parameter"""
        # Test with 1km radius
        response = client.get("/api/v1/map/nearby?lat=35.0&lng=105.0&radius=1000")
        assert response.status_code == 200

        # Test with 20km radius
        response = client.get("/api/v1/map/nearby?lat=35.0&lng=105.0&radius=20000")
        assert response.status_code == 200

    def test_nearby_requires_lat_and_lng(self):
        """Endpoint should return 422 without required params"""
        response = client.get("/api/v1/map/nearby")
        assert response.status_code == 422


class TestMapIntegration:
    """Integration tests for map functionality"""

    def test_markers_and_nearby_consistency(self):
        """Markers endpoint should return same structure as nearby"""
        markers_response = client.get("/api/v1/map/markers")
        nearby_response = client.get("/api/v1/map/nearby?lat=35.0&lng=105.0&radius=5000")

        assert markers_response.status_code == 200
        assert nearby_response.status_code == 200

        markers_data = markers_response.json()
        nearby_data = nearby_response.json()

        # Both should have their respective list keys
        assert "markers" in markers_data
        assert "sites" in nearby_data
