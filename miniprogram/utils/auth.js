// utils/auth.js - 微信登录工具
const STORAGE_SESSION = 'session'

/**
 * 执行微信登录 wx.login()
 * @param {function} successCb - 成功回调，传入 isLoggedIn
 * @param {function} failCb - 失败回调
 */
function loginWithWeChat(successCb, failCb) {
  wx.login({
    success: (res) => {
      if (res.code) {
        wx.setStorage({
          key: STORAGE_SESSION,
          data: res.code,
          success: () => {
            if (successCb) successCb()
          },
          fail: (err) => {
            if (failCb) failCb(err)
          }
        })
      } else {
        if (failCb) failCb(new Error('wx.login failed: no code'))
      }
    },
    fail: (err) => {
      if (failCb) failCb(err)
    }
  })
}

/**
 * 检查登录状态
 * @param {function} callback - 回调，传入 isLoggedIn (boolean)
 */
function checkLoginStatus(callback) {
  wx.getStorage({
    key: STORAGE_SESSION,
    success: (res) => {
      if (callback) callback(!!res.data)
    },
    fail: () => {
      if (callback) callback(false)
    }
  })
}

module.exports = {
  loginWithWeChat,
  checkLoginStatus
}
