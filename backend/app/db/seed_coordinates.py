"""
Seed coordinates for Heritage nodes in Neo4j.
Adds latitude/longitude (GCJ-02) to existing Heritage nodes.

Run: python -m app.db.seed_coordinates
"""
from app.services.neo4j_service import neo4j_service

# Sample ICH sites with GCJ-02 coordinates
# These are well-known national-level ICH sites across China
HERITAGE_COORDINATES = [
    # Ceramics (陶瓷) - Jingdezhen, Jiangxi
    {"name": "景德镇手工制瓷技艺", "category": "陶瓷", "latitude": 29.2685, "longitude": 117.1783, "address": "江西省景德镇市珠山区"},
    {"name": "龙泉青瓷烧制技艺", "category": "陶瓷", "latitude": 28.0833, "longitude": 119.1333, "address": "浙江省龙泉市"},
    {"name": "德化瓷烧制技艺", "category": "陶瓷", "latitude": 25.4833, "longitude": 118.4167, "address": "福建省德化县"},

    # Embroidery (刺绣) - Suzhou, Hunan, Guangdong
    {"name": "苏绣", "category": "刺绣", "latitude": 31.2989, "longitude": 120.5853, "address": "江苏省苏州市"},
    {"name": "湘绣", "category": "刺绣", "latitude": 28.2282, "longitude": 112.9388, "address": "湖南省长沙市"},
    {"name": "粤绣", "category": "刺绣", "latitude": 23.1291, "longitude": 113.2644, "address": "广东省广州市"},
    {"name": "蜀绣", "category": "刺绣", "latitude": 30.6587, "longitude": 104.0657, "address": "四川省成都市"},

    # Paper-cutting (剪纸) - Northern China
    {"name": "蔚县剪纸", "category": "剪纸", "latitude": 39.8333, "longitude": 114.5667, "address": "河北省蔚县"},
    {"name": "佛山剪纸", "category": "剪纸", "latitude": 23.0218, "longitude": 113.1219, "address": "广东省佛山市"},
    {"name": "陕北剪纸", "category": "剪纸", "latitude": 36.5853, "longitude": 109.4896, "address": "陕西省延安市"},

    # Weaving (编织) - Multiple provinces
    {"name": "蜀锦织造技艺", "category": "编织", "latitude": 30.6587, "longitude": 104.0657, "address": "四川省成都市"},
    {"name": "南京云锦木机妆花手工织造技艺", "category": "编织", "latitude": 32.0603, "longitude": 118.7969, "address": "江苏省南京市"},
    {"name": "蜡染技艺", "category": "编织", "latitude": 26.5986, "longitude": 106.7073, "address": "贵州省安顺市"},
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
