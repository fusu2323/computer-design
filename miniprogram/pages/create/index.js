// pages/create/index.js
const { getTemplates, getTemplateById } = require('../../utils/templates.js')
const { COLOR_PALETTE } = require('../../utils/colors.js')
const { floodFill } = require('../../utils/floodfill.js')
const { getCreations, saveCreation } = require('../../utils/storage.js')

Page({
  data: {
    templates: [],
    currentTemplateId: '',
    selectedColor: COLOR_PALETTE[0].hex,
    palette: COLOR_PALETTE,
    canvasReady: false,
    undoStack: [],
    shareImagePath: ''
  },

  canvasWidth: 0,
  canvasHeight: 0,
  canvasContext: null,

  onLoad() {
    const templates = getTemplates()
    this.setData({ templates })
    if (templates.length > 0) {
      this.setData({ currentTemplateId: templates[0].id })
    }
  },

  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#coloringCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) return
      const canvas = res[0].node
      this.canvasNode = canvas
      this.canvasContext = canvas.getContext('2d')
      
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      this.canvasContext.scale(dpr, dpr)
      
      this.canvasWidth = res[0].width
      this.canvasHeight = res[0].height
      
      this.drawTemplate()
    })

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  drawTemplate() {
    const { currentTemplateId } = this.data
    if (!currentTemplateId || !this.canvasContext) return

    const template = getTemplateById(currentTemplateId)
    if (!template) return

    const ctx = this.canvasContext
    const w = this.canvasWidth
    const h = this.canvasHeight

    // Fill background white
    ctx.fillStyle = '#F5F0E8'
    ctx.fillRect(0, 0, w, h)

    // Scale and draw each region
    template.regions.forEach(region => {
      const points = region.points
      if (!points || points.length < 3) return

      const scaledPoints = points.map(p => [p[0] * w, p[1] * h])

      ctx.beginPath()
      ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1])
      for (let i = 1; i < scaledPoints.length; i++) {
        ctx.lineTo(scaledPoints[i][0], scaledPoints[i][1])
      }
      ctx.closePath()

      // Fill with white (default fill)
      ctx.fillStyle = '#F5F0E8'
      ctx.fill()

      // Stroke outline
      ctx.strokeStyle = '#2B2B2B'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Save initial state for undo
    this.saveUndoState()
  },

  saveUndoState() {
    if (!this.canvasContext || !this.canvasNode) return
    const ctx = this.canvasContext
    const w = this.canvasNode.width
    const h = this.canvasNode.height
    try {
      const imageData = ctx.getImageData(0, 0, w, h)
      const stack = this.data.undoStack
      // Keep max 10 states
      if (stack.length >= 10) stack.shift()
      stack.push(imageData)
      this.setData({ undoStack: stack })
    } catch (e) {
      console.error('saveUndoState error:', e)
    }
  },

  onTemplateTap(e) {
    const templateId = e.currentTarget.dataset.id
    if (!templateId) return
    this.setData({ currentTemplateId: templateId, undoStack: [] })
    setTimeout(() => this.drawTemplate(), 50)
  },

  onColorTap(e) {
    const hex = e.currentTarget.dataset.hex
    if (hex) {
      this.setData({ selectedColor: hex })
    }
  },

  onCanvasTap(e) {
    if (!this.canvasContext || !this.canvasNode) return

    const { x, y } = e.detail || (e.touches && e.touches[0]) || {}
    if (x === undefined || y === undefined) return

    // Convert from display coords to physical canvas coords
    const query = wx.createSelectorQuery()
    query.select('#coloringCanvas').boundingClientRect((rect) => {
      if (!rect) return
      const dpr = wx.getSystemInfoSync().pixelRatio
      const canvasX = x * (this.canvasWidth / rect.width) * dpr
      const canvasY = y * (this.canvasHeight / rect.height) * dpr

      const filled = floodFill(this.canvasContext, canvasX, canvasY, this.data.selectedColor, 30)
      if (filled > 0) {
        this.saveUndoState()
      }
    }).exec()
  },

  onUndo() {
    const stack = this.data.undoStack
    if (stack.length <= 1) {
      wx.showToast({ title: '没有可撤销的操作', icon: 'none' })
      return
    }
    stack.pop() // Remove current state
    const prevState = stack[stack.length - 1]
    if (prevState && this.canvasContext) {
      this.canvasContext.putImageData(prevState, 0, 0)
      this.setData({ undoStack: stack })
      wx.showToast({ title: '已撤销', icon: 'success' })
    }
  },

  onClear() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空当前创作吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ undoStack: [] })
          setTimeout(() => this.drawTemplate(), 50)
        }
      }
    })
  },

  onSave() {
    if (!this.canvasNode) return
    wx.canvasToTempFilePath({
      canvas: this.canvasNode,
      success: (res) => {
        const tempPath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: tempPath,
          success: () => {
            wx.showToast({ title: '已保存到相册', icon: 'success' })
            this.saveToHistory(tempPath)
          },
          fail: (err) => {
            if (err.errMsg && err.errMsg.includes('auth deny')) {
              wx.showToast({ title: '请授权保存到相册', icon: 'none' })
              wx.openSetting()
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' })
            }
          }
        })
      },
      fail: () => {
        wx.showToast({ title: '导出失败', icon: 'none' })
      }
    })
  },

  saveToHistory(tempPath) {
    const template = getTemplateById(this.data.currentTemplateId)
    const creation = {
      id: 'creation_' + Date.now(),
      templateId: this.data.currentTemplateId,
      templateName: template ? template.name : '',
      thumbnail: tempPath,
      timestamp: Date.now()
    }
    getCreations((creations) => {
      const updated = [creation, ...creations].slice(0, 50)
      saveCreation(updated)
    })
  },

  onShare() {
    if (!this.canvasNode) return
    wx.canvasToTempFilePath({
      canvas: this.canvasNode,
      success: (res) => {
        this.shareImagePath = res.tempFilePath
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        })
        wx.showToast({ title: '点击右上角分享', icon: 'none', duration: 1500 })
      },
      fail: () => {
        wx.showToast({ title: '生成分享图片失败', icon: 'none' })
      }
    })
  },

  onShareAppMessage() {
    const template = getTemplateById(this.data.currentTemplateId)
    const name = template ? template.name : '纹样'
    return {
      title: `我的${name}创作 - 数字传承人`,
      path: '/pages/create/index',
      imageUrl: this.shareImagePath || ''
    }
  },

  onShareTimeline() {
    const template = getTemplateById(this.data.currentTemplateId)
    const name = template ? template.name : '纹样'
    return {
      title: `我的${name}创作 - 数字传承人`,
      imageUrl: this.shareImagePath || ''
    }
  }
})