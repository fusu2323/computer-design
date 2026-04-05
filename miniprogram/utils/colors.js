const COLOR_PALETTE = [
  { name: '朱红', hex: '#C04851', rgb: [192, 72, 81] },
  { name: '天青', hex: '#5796B3', rgb: [87, 150, 179] },
  { name: '茶绿', hex: '#8B9A6D', rgb: [139, 154, 109] },
  { name: '墨黑', hex: '#2B2B2B', rgb: [43, 43, 43] },
  { name: '宣纸白', hex: '#F5F0E8', rgb: [245, 240, 232] },
  { name: '赭石', hex: '#8B5A2B', rgb: [139, 90, 43] },
  { name: '石绿', hex: '#5B8A72', rgb: [91, 138, 114] },
  { name: '藤黄', hex: '#D4A017', rgb: [212, 160, 23] },
  { name: '绛紫', hex: '#8E416A', rgb: [142, 65, 106] },
  { name: '湖蓝', hex: '#4A7B8C', rgb: [74, 123, 140] },
  { name: '泥金', hex: '#C9A227', rgb: [201, 162, 39] },
  { name: '铅白', hex: '#E8E4DC', rgb: [232, 228, 220] }
]

function getColorByName(name) {
  return COLOR_PALETTE.find(c => c.name === name) || null
}

module.exports = { COLOR_PALETTE, getColorByName }
