// pages/map/index.js - National ICH Map Page
const { getMapMarkers, filterByRadius, clusterMarkers } = require('../../utils/map.js')

const CHINA_CENTER = { latitude: 35.0, longitude: 105.0 }
const DEFAULT_SCALE = 4
const USER_SCALE = 10

Page({
  data: {
    mapCenter: CHINA_CENTER,
    mapScale: DEFAULT_SCALE,
    markers: [],
    allMarkers: [],
    userLocation: null,
    selectedSite: null,
    showBottomSheet: false,
    categories: [
      { id: 'all', name: '全部', active: true },
      { id: '刺绣', name: '刺绣', active: false },
      { id: '陶瓷', name: '陶瓷', active: false },
      { id: '剪纸', name: '剪纸', active: false },
      { id: '编织', name: '编织', active: false }
    ],
    radiusOptions: [
      { label: '1km', value: 1000, selected: false },
      { label: '5km', value: 5000, selected: true },
      { label: '10km', value: 10000, selected: false },
      { label: '20km', value: 20000, selected: false }
    ],
    selectedRadius: 5000,
    loading: true,
    error: null,
    debugLogStr: ''   // 调试日志字符串
  },

  // ===== 生命周期 =====
  onLoad() {
    console.log('【MAP onLoad】开始加载')
    this.log('onLoad triggered')
    this.requestLocation()
  },

  onShow() {
    console.log('【MAP onShow】')
    if (this.data.allMarkers.length > 0) {
      this.applyFilters()
    } else {
      // No markers loaded yet, trigger loading
      this.requestLocation()
    }
  },

  onReady() {
    console.log('【MAP onReady】地图组件应该已渲染')
    this.log('onReady triggered')
  },

  onUnload() {
    console.log('【MAP onUnload】页面卸载')
  },

  // ===== 工具方法 =====
  noop() {},  // 空函数，阻止 cover-view 冒泡

  log(msg, data) {
    // 收集日志到 data.debugLogStr 显示在界面上
    const timestamp = new Date().toLocaleTimeString()
    const entry = `[${timestamp}] ${msg}${data ? ' ' + JSON.stringify(data) : ''}\n`
    console.log(entry)
    // 保留最近500字符
    const newLog = (this.data.debugLogStr || '') + entry
    const truncated = newLog.length > 500 ? newLog.slice(-500) : newLog
    this.setData({ debugLogStr: truncated })
  },

  // ===== 1. 定位 =====
  requestLocation() {
    this.log('【Step1】开始请求定位')
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.log('【Step1】定位成功', { lat: res.latitude, lng: res.longitude })
        const userLoc = { latitude: res.latitude, longitude: res.longitude }
        this.setData({
          userLocation: userLoc,
          mapCenter: userLoc,
          mapScale: USER_SCALE
        })
        this.fetchMarkers()
      },
      fail: (err) => {
        this.log('【Step1】定位失败', err)
        console.error('【定位失败】', err)
        wx.showToast({ title: '定位失败，使用默认位置', icon: 'none' })
        this.fetchMarkers()
      }
    })
  },

  // ===== 2. 获取标记点 =====
  fetchMarkers() {
    this.log('【Step2】开始请求 markers API')
    this.setData({ loading: true, error: null })

    getMapMarkers((markers, error) => {
      if (error) {
        this.log('【Step2】API 返回错误', { error })
        console.error('【API错误】', error)
        this.setData({ error, loading: false })
        wx.showToast({ title: error, icon: 'none' })
        // 即使出错也调用 applyFilters（会显示 0 个点而不是一直 loading）
        this.applyFilters()
        return
      }
      this.log('【Step2】API 返回成功', { count: markers.length })
      console.log('【markers数据】', markers)
      this.setData({
        allMarkers: markers,
        loading: false
      })
      this.applyFilters()
    })
  },

  // ===== 3. 过滤 & 更新地图 =====
  applyFilters() {
    const { allMarkers, userLocation, selectedRadius, categories } = this.data

    // Guard: if markers not loaded yet, skip filtering
    if (!allMarkers || allMarkers.length === 0) {
      this.log('【Step3】跳过过滤，markers 未加载')
      return
    }

    this.log('【Step3】开始过滤')
    let displayMarkers = allMarkers

    // 按分类过滤
    const activeCategories = categories
      .filter(c => c.active && c.id !== 'all')
      .map(c => c.id)
    if (activeCategories.length > 0) {
      displayMarkers = displayMarkers.filter(m => activeCategories.includes(m.category))
      this.log('【Step3】分类过滤后', { activeCategories, remaining: displayMarkers.length })
    }

    // 按距离过滤（只有获取到用户位置时才过滤）
    if (userLocation) {
      const before = displayMarkers.length
      displayMarkers = filterByRadius(
        displayMarkers,
        userLocation.latitude,
        userLocation.longitude,
        selectedRadius
      )
      this.log('【Step3】距离过滤后', {
        radius: selectedRadius,
        before,
        after: displayMarkers.length
      })
    } else {
      this.log('【Step3】无定位，跳过距离过滤，显示全部', { count: displayMarkers.length })
    }

    this.updateMarkers(displayMarkers, this.data.mapScale)
  },

  updateMarkers(markers, scale) {
    this.log('【Step4】更新 markers', { count: markers.length, scale })

    try {
      const clustered = clusterMarkers(markers, scale)
      const displayMarkers = clustered.map((m, idx) => ({
        ...m,
        id: m.id !== undefined ? m.id : idx,
        width: m.isCluster ? 48 : 32,
        height: m.isCluster ? 48 : 32
      }))

      const wxMarkers = displayMarkers.map((m) => {
        const marker = {
          id: m.id,
          latitude: m.latitude,
          longitude: m.longitude,
          width: m.width,
          height: m.height,
          customData: m.isCluster ? { isCluster: true, count: m.count } : m
        }
        
        // Use a default icon path for cluster vs single marker, or custom label for cluster
        if (m.isCluster) {
          marker.label = {
            content: m.count.toString(),
            color: '#FFFFFF',
            fontSize: 12,
            bgColor: '#C04851',
            borderRadius: 12,
            padding: 4,
            anchorX: 0,
            anchorY: 0
          }
        }
        return marker
      })

      this.log('【Step4】wxMarkers 格式化完成', { count: wxMarkers.length })
      this.setData({ markers: wxMarkers })
      this.log('【Step4】setData 完成，markers 已渲染')
    } catch (e) {
      console.error('【updateMarkers 异常】', e)
      this.log('【Step4】异常', { msg: e.message, stack: e.stack })
    }
  },

  // ===== 地图事件 =====
  onMapScaleChange(e) {
    console.log('【地图缩放变化】scale:', e.detail.scale)
    this.updateMarkers(this.data.allMarkers, e.detail.scale)
  },

  onMarkerTap(e) {
    console.log('【Marker点击】e.detail:', e.detail)
    const markerId = e.detail.markerId
    const marker = this.data.markers.find(m => m.id === markerId)
    if (!marker) {
      console.warn('【Marker点击】未找到 marker, id:', markerId)
      return
    }

    const customData = marker.customData

    if (customData && customData.isCluster) {
      console.log('【Cluster点击】缩放地图')
      const newScale = Math.min(this.data.mapScale + 2, 12)
      this.setData({ mapScale: newScale })
      return
    }

    console.log('【Marker点击】显示详情', customData)
    // 预格式化距离，避免 WXML 里调用 .toFixed()
    const site = { ...customData }
    if (site.distance !== undefined) {
      site.distanceText = site.distance < 1000
        ? '距离 ' + site.distance + 'm'
        : '距离 ' + (site.distance / 1000).toFixed(1) + 'km'
    }
    this.setData({
      selectedSite: site,
      showBottomSheet: true
    })
  },

  onBottomSheetClose() {
    console.log('【关闭详情】')
    this.setData({ showBottomSheet: false, selectedSite: null })
  },

  // ===== 筛选交互 =====
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    this.log('【切换分类】', { categoryId })
    const categories = this.data.categories.map(c => ({
      ...c,
      active: c.id === categoryId
    }))
    this.setData({ categories })
    this.applyFilters()
  },

  onRadiusTap(e) {
    const radius = e.currentTarget.dataset.value
    this.log('【切换半径】', { radius })
    const radiusOptions = this.data.radiusOptions.map(r => ({
      ...r,
      selected: r.value === radius
    }))
    this.setData({ radiusOptions, selectedRadius: radius })
    this.applyFilters()
  },

  // ===== 导航 =====
  onNavigate() {
    const site = this.data.selectedSite
    if (!site) return
    this.log('【导航】', { name: site.name, lat: site.latitude, lng: site.longitude })
    wx.openLocation({
      latitude: site.latitude,
      longitude: site.longitude,
      name: site.name,
      address: site.address || '',
      scale: 18,
      fail: (err) => {
        console.error('【导航失败】', err)
        wx.showToast({ title: '打开地图失败', icon: 'none' })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '数字传承人 - 探索非遗',
      path: '/pages/map/index'
    }
  }
})
