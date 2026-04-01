// utils/map.js - Map utilities for ICH map exploration
const API_BASE = 'http://localhost:8002'
const API_MAP_MARKERS = '/api/v1/map/markers'

/**
 * Fetch all ICH markers from backend API
 * @param {function} callback - (markers, error) => void
 */
function getMapMarkers(callback) {
  wx.request({
    url: API_BASE + API_MAP_MARKERS,
    method: 'GET',
    success: (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && res.data.markers) {
        callback(res.data.markers, null)
      } else {
        callback([], '获取点位失败')
      }
    },
    fail: (err) => {
      console.error('Failed to fetch markers:', err)
      callback([], '网络请求失败')
    }
  })
}

/**
 * Haversine distance calculation (meters)
 * Used for radius filtering
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000 // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Filter markers by radius from user location
 * @param {Array} markers - All markers
 * @param {number} userLat - User latitude (GCJ-02)
 * @param {number} userLng - User longitude (GCJ-02)
 * @param {number} radiusMeters - Radius in meters
 * @returns {Array} Filtered markers with distance property added
 */
function filterByRadius(markers, userLat, userLng, radiusMeters) {
  return markers
    .map(marker => {
      const distance = haversineDistance(
        userLat, userLng,
        marker.latitude, marker.longitude
      )
      return { ...marker, distance }
    })
    .filter(marker => marker.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Grid-based clustering for markers
 * Divides viewport into grid cells, shows count badge on cluster markers
 * Per D-02 and D-03: cluster when zoom < 8
 * @param {Array} markers - All markers
 * @param {number} zoom - Current map zoom level
 * @param {number} gridSizeDeg - Grid cell size in degrees (default 0.5 ~50km at equator)
 * @returns {Array} Clustered or original markers
 */
function clusterMarkers(markers, zoom, gridSizeDeg = 0.5) {
  if (zoom >= 8) return markers // No clustering at city/street level

  const grid = {}

  markers.forEach(marker => {
    const gridX = Math.floor(marker.latitude / gridSizeDeg)
    const gridY = Math.floor(marker.longitude / gridSizeDeg)
    const key = `${gridX}:${gridY}`

    if (!grid[key]) {
      grid[key] = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        count: 0,
        markers: []
      }
    }
    grid[key].markers.push(marker)
    grid[key].count++
    // Use average position of markers in cell
    grid[key].latitude = grid[key].markers.reduce((sum, m) => sum + m.latitude, 0) / grid[key].count
    grid[key].longitude = grid[key].markers.reduce((sum, m) => sum + m.longitude, 0) / grid[key].count
  })

  return Object.values(grid).map((cluster, idx) => ({
    id: -(idx + 1), // Negative ID for cluster markers
    latitude: cluster.latitude,
    longitude: cluster.longitude,
    iconPath: '/images/cluster.png',
    width: 36,
    height: 36,
    count: cluster.count,
    isCluster: true
  }))
}

/**
 * Get category color from ICH category name
 * @param {string} category
 * @returns {string} Hex color
 */
function getCategoryColor(category) {
  const colors = {
    '刺绣': '#C04851',   // vermilion
    '陶瓷': '#5796B3',  // cyan-glaze
    '剪纸': '#CCD4BF',  // tea-green
    '编织': '#D4AF37'   // gold
  }
  return colors[category] || '#4A4A4A' // default charcoal
}

module.exports = {
  getMapMarkers,
  filterByRadius,
  clusterMarkers,
  haversineDistance,
  getCategoryColor
}
