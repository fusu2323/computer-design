// pages/history/index.js
const { getCreations, deleteCreation } = require('../../utils/storage.js')

Page({
  data: {
    creations: [],
    loading: true
  },

  onLoad() {
    this.loadCreations()
  },

  onShow() {
    this.loadCreations()
  },

  loadCreations() {
    this.setData({ loading: true })
    getCreations((creations) => {
      this.setData({ creations, loading: false })
    })
  },

  onCreationTap(e) {
    const id = e.currentTarget.dataset.id
    const creation = this.data.creations.find(c => c.id === id)
    if (!creation) return

    wx.showActionSheet({
      itemList: ['查看大图', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.previewImage({
            urls: [creation.thumbnail],
            current: creation.thumbnail
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '确认删除',
            content: '删除后将无法恢复',
            success: (modalRes) => {
              if (modalRes.confirm) {
                deleteCreation(id, (updatedCreations) => {
                  this.setData({ creations: updatedCreations })
                  wx.showToast({ title: '已删除', icon: 'success' })
                })
              }
            }
          })
        }
      }
    })
  }
})
