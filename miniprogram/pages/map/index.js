// pages/map/index.js - National ICH Map Page
const { getMapMarkers, filterByRadius, clusterMarkers, getCategoryColor } = require('../../utils/map.js')

// Default: China center at GCJ-02 coordinates
const CHINA_CENTER = { latitude: 35.0, longitude: 105.0 }
const DEFAULT_SCALE = 4
const USER_SCALE = 10

Page({
  data: {
    // Map state
    mapCenter: CHINA_CENTER,
    mapScale: DEFAULT_SCALE,
    markers: [],
    allMarkers: [], // Original unfiltered markers

    // User location
    userLocation: null,

    // Selected site for bottom sheet
    selectedSite: null,
    showBottomSheet: false,

    // Filter controls
    categories: [
      { id: 'all', name: '全部', active: true },
      { id: '刺绣', name: '刺绣', active: false },
      { id: '陶瓷', name: '陶瓷', active: false },
      { id: '剪纸', name: '剪纸', active: false },
      { id: '编织', name: '编织', active: false }
    ],

    // Radius presets (per D-09)
    radiusOptions: [
      { label: '1km', value: 1000, selected: false },
      { label: '5km', value: 5000, selected: true },  // default
      { label: '10km', value: 10000, selected: false },
      { label: '20km', value: 20000, selected: false }
    ],
    selectedRadius: 5000,

    // UI state
    loading: true,
    error: null
  },

  onLoad() {
    this.requestLocation()
  },

  onShow() {
    // Refresh markers when returning to page
    if (this.data.allMarkers.length > 0) {
      this.applyFilters()
    }
  },

  onMapScaleChange(e) {
    // Re-cluster when zoom changes (D-03: cluster when zoom < 8)
    this.updateMarkers(this.data.allMarkers, e.detail.scale)
  },

  requestLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const userLoc = { latitude: res.latitude, longitude: res.longitude }
        this.setData({
          userLocation: userLoc,
          mapCenter: userLoc,
          mapScale: USER_SCALE
        })
        this.fetchMarkers()
      },
      fail: () => {
        // Fall back to China center if location denied
        wx.showToast({ title: '定位失败，使用默认位置', icon: 'none' })
        this.fetchMarkers()
      }
    })
  },

  fetchMarkers() {
    this.setData({ loading: true, error: null })
    getMapMarkers((markers, error) => {
      if (error) {
        this.setData({ error, loading: false })
        wx.showToast({ title: error, icon: 'none' })
        return
      }
      this.setData({
        allMarkers: markers,
        loading: false
      })
      this.applyFilters()
    })
  },

  applyFilters() {
    const { allMarkers, userLocation, selectedRadius, categories } = this.data

    // Build display markers from filtered set
    let displayMarkers = allMarkers

    // Apply category filter
    const activeCategories = categories
      .filter(c => c.active && c.id !== 'all')
      .map(c => c.id)
    if (activeCategories.length > 0) {
      displayMarkers = displayMarkers.filter(m => activeCategories.includes(m.category))
    }

    // Apply radius filter if user location available
    if (userLocation) {
      displayMarkers = filterByRadius(
        displayMarkers,
        userLocation.latitude,
        userLocation.longitude,
        selectedRadius
      )
    }

    this.updateMarkers(displayMarkers, this.data.mapScale)
  },

  updateMarkers(markers, scale) {
    // Apply clustering based on zoom level (D-03)
    const displayMarkers = scale < 8
      ? clusterMarkers(markers, scale)
      : markers.map((m, idx) => ({
          ...m,
          id: m.id || idx,
          iconPath: '/images/marker.png',
          width: 32,
          height: 32
        }))

    // Format markers for WeChat map component
    const wxMarkers = displayMarkers.map(m => ({
      id: m.id,
      latitude: m.latitude,
      longitude: m.longitude,
      iconPath: m.iconPath || '/images/marker.png',
      width: m.width || 32,
      height: m.height || 32,
      // Custom data passed to tap handler
      customData: m.isCluster ? { isCluster: true, count: m.count } : m
    }))

    this.setData({ markers: wxMarkers })
  },

  onMarkerTap(e) {
    const markerId = e.detail.markerId
    const marker = this.data.markers.find(m => m.id === markerId)
    if (!marker) return

    const customData = marker.customData

    // Cluster tap: zoom in to show markers
    if (customData && customData.isCluster) {
      const newScale = Math.min(this.data.mapScale + 2, 12)
      this.setData({ mapScale: newScale })
      return
    }

    // Marker tap: show bottom sheet
    if (customData) {
      this.setData({
        selectedSite: customData,
        showBottomSheet: true
      })
    }
  },

  onBottomSheetClose() {
    this.setData({ showBottomSheet: false, selectedSite: null })
  },

  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    const categories = this.data.categories.map(c => ({
      ...c,
      active: c.id === categoryId
    }))
    this.setData({ categories })
    this.applyFilters()
  },

  onRadiusTap(e) {
    const radius = e.currentTarget.dataset.value
    const radiusOptions = this.data.radiusOptions.map(r => ({
      ...r,
      selected: r.value === radius
    }))
    this.setData({ radiusOptions, selectedRadius: radius })
    this.applyFilters()
  },

  onNavigate() {
    const site = this.data.selectedSite
    if (!site) return

    // D-08: Use wx.openLocation with GCJ-02 coordinates
    wx.openLocation({
      latitude: site.latitude,
      longitude: site.longitude,
      name: site.name,
      address: site.address || '',
      scale: 18
    })
  },

  onShareAppMessage() {
    return {
      title: '数字传承人 - 探索非遗',
      path: '/pages/map/index'
    }
  }
})
