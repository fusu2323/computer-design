// utils/dailyCard.js - 每日知识卡片
const API_BASE = 'http://localhost:8002'
const API_KNOWLEDGE_DAILY = '/api/v1/knowledge/daily'
const STORAGE_USER_ID = 'userId'

/**
 * 简单字符串哈希函数，用于确定性每日选择
 */
function hashString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * 获取今日 ICH 知识
 * @param {function} successCb - 成功回调，传入 (fact, error)
 * fact: { id, title, category, imageUrl, fact } | null
 * error: string | null
 */
function getDailyFact(successCb) {
  wx.request({
    url: API_BASE + API_KNOWLEDGE_DAILY,
    method: 'GET',
    success: (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const data = res.data
        const facts = data.facts
        if (!facts || facts.length === 0) {
          if (successCb) successCb(null, '今日知识待解锁')
          return
        }

        // 获取日期字符串 YYYY-MM-DD
        const now = new Date()
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

        // 获取用户ID（匿名兜底）
        let userId = 'anonymous'
        try {
          const stored = wx.getStorageSync(STORAGE_USER_ID)
          userId = stored || 'anonymous'
        } catch (e) { /* 使用匿名 */ }

        // 确定性哈希选择
        const hashInput = `${dateStr}:${userId}`
        const index = hashString(hashInput) % facts.length

        if (successCb) successCb(facts[index], null)
      } else {
        fallbackFact(successCb)
      }
    },
    fail: (err) => {
      console.error('Failed to fetch daily fact:', err)
      fallbackFact(successCb)
    }
  })
}

function fallbackFact(successCb) {
  const fallback = {
    id: 'fb1',
    title: '剪纸艺术',
    category: '剪纸',
    imageUrl: '',
    fact: '剪纸是中国汉族最古老的民间艺术之一，其在视觉上给人以透空的感觉和艺术享受。'
  }
  if (successCb) successCb(fallback, null)
}

module.exports = {
  getDailyFact
}
