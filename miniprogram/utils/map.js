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
      if (res.statusCode >= 200 && res.statusCode < 300 && res.data && res.data.markers) {
        callback(res.data.markers, null)
      } else {
        callback(getFallbackMarkers(), null)
      }
    },
    fail: (err) => {
      console.error('Failed to fetch markers:', err)
      callback(getFallbackMarkers(), null)
    }
  })
}

function getFallbackMarkers() {
  return [
    { id: 1, name: '苏绣传承馆', latitude: 31.30, longitude: 120.60, category: '刺绣', description: '著名的苏绣发源地之一', address: '江苏省苏州市' },
    { id: 2, name: '景德镇陶瓷厂', latitude: 29.30, longitude: 117.20, category: '陶瓷', description: '中国千年瓷都的核心产区', address: '江西省景德镇市' },
    { id: 3, name: '蔚县剪纸中心', latitude: 39.80, longitude: 114.50, category: '剪纸', description: '世界非物质文化遗产蔚县剪纸', address: '河北省张家口市' },
    { id: 4, name: '竹编艺术村', latitude: 29.60, longitude: 103.70, category: '编织', description: '传统竹编技艺传承', address: '四川省眉山市' }
  ]
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
