const STORAGE_KEY = 'ich_creations'

function getCreations(callback) {
  wx.getStorage({
    key: STORAGE_KEY,
    success: (res) => callback(res.data || []),
    fail: () => callback([])
  })
}

function saveCreation(creations, callback) {
  wx.setStorage({
    key: STORAGE_KEY,
    data: creations,
    success: () => { if (callback) callback() },
    fail: (err) => console.error('saveCreation error:', err)
  })
}

function deleteCreation(id, callback) {
  getCreations((creations) => {
    const filtered = creations.filter(c => c.id !== id)
    saveCreation(filtered, () => { if (callback) callback(filtered) })
  })
}

function clearCreations(callback) {
  wx.removeStorage({
    key: STORAGE_KEY,
    success: () => { if (callback) callback() },
    fail: () => { if (callback) callback() }
  })
}

module.exports = { getCreations, saveCreation, deleteCreation, clearCreations }
