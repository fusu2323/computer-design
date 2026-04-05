"""
Seed coordinates for Heritage nodes in Neo4j.
Adds latitude/longitude (GCJ-02) to existing Heritage nodes.

Run: python -m app.db.seed_coordinates
"""
from app.services.neo4j_service import neo4j_service

# Sample ICH sites with GCJ-02 coordinates
# Names must EXACTLY match Heritage nodes in Neo4j
HERITAGE_COORDINATES = [
    # Matches actual Neo4j Heritage nodes:
    {"name": "蜡染", "latitude": 26.5986, "longitude": 106.7073, "address": "贵州省安顺市"},
    {"name": "剪纸", "latitude": 39.8333, "longitude": 114.5667, "address": "河北省蔚县"},
    {"name": "苏绣", "latitude": 31.2989, "longitude": 120.5853, "address": "江苏省苏州市"},
    {"name": "紫砂", "latitude": 31.2989, "longitude": 120.5853, "address": "江苏省宜兴市"},
    {"name": "皮影戏", "latitude": 34.2667, "longitude": 108.9500, "address": "陕西省西安市"},
    {"name": "宜兴紫砂陶制作技艺", "latitude": 31.2989, "longitude": 120.5853, "address": "江苏省宜兴市"},
]

def seed_coordinates():
    """Set latitude and longitude on Heritage nodes matching by name.

    Returns tuple: (updated_count, list of names that were matched)
    """
    updated_count = 0
    matched_names = []
    for site in HERITAGE_COORDINATES:
        cypher = """
        MATCH (h:Heritage)
        WHERE h.name = $name
        SET h.latitude = $lat,
            h.longitude = $lng,
            h.address = $address
        RETURN h.name AS matched_name
        """
        result = neo4j_service.query(cypher, {
            "name": site["name"],
            "lat": site["latitude"],
            "lng": site["longitude"],
            "address": site["address"]
        })
        # Only count as updated if a node was actually matched
        if result and len(result) > 0:
            updated_count += 1
            matched_names.append(site["name"])
    print(f"Updated {updated_count} Heritage nodes with coordinates")
    return updated_count, matched_names

def verify_coordinates():
    """Verify coordinates were set correctly.

    Returns tuple: (count, list of names with coordinates)
    Raises RuntimeError if count < 5 (minimum viable threshold).
    """
    cypher = """
    MATCH (h:Heritage)
    WHERE h.latitude IS NOT NULL AND h.longitude IS NOT NULL
    RETURN h.name AS name
    """
    result = neo4j_service.query(cypher)
    count = len(result) if result else 0
    names = [r["name"] for r in result] if result else []

    print(f"Heritage nodes with coordinates: {count}")
    if names:
        print(f"Updated nodes: {', '.join(names)}")

    if count < 5:
        raise RuntimeError(
            f"Coordinate seeding FAILED: only {count} nodes have coordinates, expected at least 5. "
            f"Check that Heritage nodes exist in Neo4j with matching names."
        )

    return count, names

if __name__ == "__main__":
    print("Seeding coordinates for Heritage nodes...")
    updated_count, matched_names = seed_coordinates()
    print(f"Seeding complete: {updated_count} nodes updated.")

    print("\nVerifying coordinate seeding...")
    try:
        count, verified_names = verify_coordinates()
        print(f"\nVerification PASSED: {count} Heritage nodes now have coordinates.")
    except RuntimeError as e:
        print(f"\nVerification FAILED: {e}")
        raise SystemExit(1)
