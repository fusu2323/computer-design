// pages/home/index.js
const { checkLoginStatus, loginWithWeChat } = require('../../utils/auth')
const { getDailyFact } = require('../../utils/dailyCard')

Page({
  data: {
    isLoggedIn: false,
    dailyFact: null,
    loading: true,
    error: null,
  },

  onLoad() {
    this.checkAuth()
  },

  onShow() {
    // 每次展示都检查登录状态
    this.checkAuth()
  },

  checkAuth() {
    checkLoginStatus((isLoggedIn) => {
      this.setData({ isLoggedIn })
      if (isLoggedIn) {
        this.loadDailyFact()
      } else {
        this.setData({ loading: false })
      }
    })
  },

  loadDailyFact() {
    this.setData({ loading: true, error: null })
    getDailyFact((fact, error) => {
      if (error) {
        this.setData({ error, loading: false })
      } else {
        this.setData({ dailyFact: fact, loading: false })
      }
    })
  },

  handleLogin() {
    if (this.data.isLoggedIn) return

    this.setData({ loading: true })
    loginWithWeChat(
      () => {
        this.setData({ isLoggedIn: true })
        this.loadDailyFact()
      },
      (err) => {
        wx.showToast({ title: '登录失败，请重试', icon: 'none', duration: 2000 })
        this.setData({ loading: false })
      }
    )
  },
})
