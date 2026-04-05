// Returns array of all templates
function getTemplates() {
  return [embroideryOutline, paperCut, blueWhite, weaving]
}

// Returns single template by id
function getTemplateById(id) {
  return getTemplates().find(t => t.id === id) || null
}

// Template 1: 刺绣轮廓 - traditional floral embroidery outline
const embroideryOutline = {
  id: 'embroidery_outline',
  name: '刺绣轮廓',
  regions: [
    // 8 closed polygon regions for a floral embroidery pattern
    // Center flower petal - top
    { id: 'r0', label: '上花瓣', points: [[0.42,0.08],[0.58,0.08],[0.62,0.18],[0.38,0.18]] },
    // Center flower petal - right
    { id: 'r1', label: '右花瓣', points: [[0.62,0.18],[0.72,0.32],[0.65,0.45],[0.55,0.35]] },
    // Center flower petal - bottom-right
    { id: 'r2', label: '右下花瓣', points: [[0.65,0.45],[0.58,0.55],[0.52,0.48],[0.55,0.35]] },
    // Center flower petal - bottom
    { id: 'r3', label: '下花瓣', points: [[0.52,0.48],[0.42,0.62],[0.38,0.52],[0.45,0.42]] },
    // Center flower petal - bottom-left
    { id: 'r4', label: '左下花瓣', points: [[0.38,0.52],[0.32,0.45],[0.35,0.35],[0.45,0.42]] },
    // Center flower petal - left
    { id: 'r5', label: '左花瓣', points: [[0.32,0.45],[0.28,0.32],[0.38,0.18],[0.42,0.08]] },
    // Corner decorative element - top right
    { id: 'r6', label: '右上装饰', points: [[0.72,0.08],[0.92,0.08],[0.92,0.28],[0.72,0.18]] },
    // Corner decorative element - bottom left
    { id: 'r7', label: '左下装饰', points: [[0.08,0.72],[0.28,0.92],[0.28,0.72],[0.08,0.92]] }
  ]
}

// Template 2: 剪纸窗花 - classic double-happiness + floral paper cut
const paperCut = {
  id: 'paper_cut',
  name: '剪纸窗花',
  regions: [
    // Double happiness character area (simplified)
    { id: 'r0', label: '喜字上', points: [[0.38,0.12],[0.62,0.12],[0.60,0.30],[0.40,0.30]] },
    { id: 'r1', label: '喜字中', points: [[0.40,0.30],[0.60,0.30],[0.60,0.50],[0.40,0.50]] },
    { id: 'r2', label: '喜字下', points: [[0.40,0.50],[0.60,0.50],[0.62,0.70],[0.38,0.70]] },
    // Corner floral - top left
    { id: 'r3', label: '左上花', points: [[0.05,0.05],[0.22,0.05],[0.18,0.18],[0.05,0.22]] },
    // Corner floral - top right
    { id: 'r4', label: '右上花', points: [[0.78,0.05],[0.95,0.05],[0.95,0.22],[0.82,0.18]] },
    // Corner floral - bottom left
    { id: 'r5', label: '左下花', points: [[0.05,0.78],[0.18,0.82],[0.22,0.95],[0.05,0.95]] }
  ]
}

// Template 3: 青花瓷纹 - blue-and-white porcelain lotus vine pattern
const blueWhite = {
  id: 'blue_white',
  name: '青花瓷纹',
  regions: [
    // Top border band
    { id: 'r0', label: '顶部纹带', points: [[0.05,0.05],[0.95,0.05],[0.95,0.15],[0.05,0.15]] },
    // Bottom border band
    { id: 'r1', label: '底部纹带', points: [[0.05,0.85],[0.95,0.85],[0.95,0.95],[0.05,0.95]] },
    // Center lotus flower - main petal cluster
    { id: 'r2', label: '主花瓣', points: [[0.35,0.28],[0.65,0.28],[0.68,0.45],[0.32,0.45]] },
    { id: 'r3', label: '左莲瓣', points: [[0.25,0.38],[0.35,0.28],[0.32,0.45],[0.18,0.48]] },
    { id: 'r4', label: '右莲瓣', points: [[0.65,0.28],[0.75,0.38],[0.82,0.48],[0.68,0.45]] },
    { id: 'r5', label: '左下卷草', points: [[0.12,0.55],[0.28,0.52],[0.30,0.65],[0.10,0.70]] },
    { id: 'r6', label: '右下卷草', points: [[0.72,0.52],[0.88,0.55],[0.90,0.70],[0.70,0.65]] },
    // Side vine left
    { id: 'r7', label: '左侧藤蔓', points: [[0.05,0.22],[0.15,0.20],[0.18,0.75],[0.05,0.78]] },
    // Side vine right
    { id: 'r8', label: '右侧藤蔓', points: [[0.85,0.22],[0.95,0.20],[0.95,0.78],[0.82,0.75]] },
    // Center bottom lotus base
    { id: 'r9', label: '莲座', points: [[0.38,0.60],[0.62,0.60],[0.58,0.78],[0.42,0.78]] }
  ]
}

// Template 4: 编织图案 - traditional weave/textile grid pattern
const weaving = {
  id: 'weaving',
  name: '编织图案',
  regions: [
    // 3x3 grid of weave cells (9 squares)
    // Row 1
    { id: 'r0', label: '格(1,1)', points: [[0.05,0.05],[0.35,0.05],[0.35,0.33],[0.05,0.33]] },
    { id: 'r1', label: '格(2,1)', points: [[0.35,0.05],[0.65,0.05],[0.65,0.33],[0.35,0.33]] },
    { id: 'r2', label: '格(3,1)', points: [[0.65,0.05],[0.95,0.05],[0.95,0.33],[0.65,0.33]] },
    // Row 2
    { id: 'r3', label: '格(1,2)', points: [[0.05,0.33],[0.35,0.33],[0.35,0.66],[0.05,0.66]] },
    { id: 'r4', label: '格(2,2)', points: [[0.35,0.33],[0.65,0.33],[0.65,0.66],[0.35,0.66]] },
    { id: 'r5', label: '格(3,2)', points: [[0.65,0.33],[0.95,0.33],[0.95,0.66],[0.65,0.66]] },
    // Row 3
    { id: 'r6', label: '格(1,3)', points: [[0.05,0.66],[0.35,0.66],[0.35,0.95],[0.05,0.95]] },
    { id: 'r7', label: '格(2,3)', points: [[0.35,0.66],[0.65,0.66],[0.65,0.95],[0.35,0.95]] },
    { id: 'r8', label: '格(3,3)', points: [[0.65,0.66],[0.95,0.66],[0.95,0.95],[0.65,0.95]] }
  ]
}

module.exports = { getTemplates, getTemplateById }
