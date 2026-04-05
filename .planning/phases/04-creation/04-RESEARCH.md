# Phase 4: 微创作 + 分享 - Research

**Researched:** 2026-04-05

<wechat_canvas>
## WeChat Canvas APIs for Coloring

### Flood Fill Algorithm
WeChat's `<canvas>` does not have a native flood-fill. Implementation options:

1. **Scanline flood fill** (recommended) — O(n) where n = pixels in region. Steps:
   - Get all pixels via `canvasContext.getImageData(x, y, 1, 1).data`
   - Get target color (color at tap point)
   - BFS/scanline fill replacing pixels matching target color within tolerance
   - `canvasContext.putImageData` to write back
   - Tolerance of ~30 RGB distance needed for anti-aliased edges

2. **Region-based** — Pre-define regions as vector paths in JSON. Tap → `canvasContext.fill()` with selected color. More predictable but requires pre-segmented templates.

**Decision: Scanline flood fill** — allows any tap-to-fill without pre-segmentation. Must optimize for mid-range devices.

### Canvas Export
```javascript
wx.canvasToTempFilePath({
  canvasId: 'coloringCanvas',
  success: (res) => {
    // res.tempFilePath — local file path
    wx.saveImageToPhotosAlbum({
      filePath: res.tempFilePath,
      success: () => wx.showToast({ title: '已保存到相册' }),
      fail: (err) => wx.authorize({ scope: 'scope.writePhotosAlbum' })
    })
  }
})
```
Note: canvas must be visible (not `hidden`) when calling `canvasToTempFilePath`.

</wechat_canvas>

<sharing>
## WeChat Sharing APIs

### Share to Moments (朋友圈)
- Use `wx.showShareMenu({ withShareTicket: true })`
- `onShareAppMessage` returns `{ title, imageUrl, path }`
- `imageUrl` can be a canvas-generated image from `canvasToTempFilePath`
- **Limitation:** Cannot pre-fill text content for moments — only title + image

### Share to Contact (发送朋友)
- `onShareAppMessage` enables "发送给朋友" button in top-right menu
- Returns share card with title + image + mini-program path
- Cannot use `wx.shareFileMessage` (not available in WeChat)
- Canvas image can be used as `imageUrl`

### Share Menu Configuration
```javascript
// In onLoad or onShow
wx.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline']
})
```
- `shareAppMessage` = send to contact
- `shareTimeline` = share to moments

</sharing>

<storage>
## WeChat Storage for Creation History

### API
- `wx.setStorage({ key: 'creations', data: [...] })` — async with callback
- `wx.getStorage({ key: 'creations', success: (res) => {} })` — async
- `wx.getStorageInfo()` — returns storage usage info

### Data Schema
```javascript
{
  id: 'creation_<timestamp>',
  templateId: 'embroidery_01',       // which line art used
  colorMap: {                        // map of region → hex color
    'region_0': '#C04851',
    'region_1': '#5796B3'
  },
  thumbnail: 'data:image/png;base64,...', // base64 thumbnail for gallery
  timestamp: 1743849600000
}
```

### Limits
- Max 10MB total storage
- Key must be string, value can be any JS object (serialized)
- No TTL — data persists until user clears WeChat storage

</storage>

<templates>
## ICH Pattern Line Art Templates

### Recommended Templates (4 minimum)

1. **刺绣轮廓 (embroidery_outline)** — 传统刺绣针法轮廓，花卉纹样，适合填色学习
2. **剪纸窗花 (paper_cut)** — 经典双喜字+花卉组合，镂空效果
3. **青花瓷纹 (blue_white)** — 青花瓷瓶颈肩部纹样，缠枝莲图案
4. **编织图案 (weaving)** — 传统编织纹理，方格纹样

### Technical Implementation
- Store as JSON: array of paths `[{ points: [[x,y]...], id: 'region_0' }]`
- Each path is a closed polygon representing one fillable region
- Render via `canvasContext.beginPath()` → `canvasContext.moveTo()` → `canvasContext.lineTo()` → `canvasContext.fill()`
- Line art drawn with `canvasContext.strokeStyle = '#2B2B2B'`, `lineWidth = 2`

### Color Palette (12 Eastern Aesthetics Colors)
| Name | Hex | Use |
|------|-----|-----|
| 朱红 | #C04851 | 刺绣红线 |
| 天青 | #5796B3 | 青花蓝 |
| 茶绿 | #8B9A6D | 植物色 |
| 墨黑 | #2B2B2B | 轮廓线 |
| 宣纸白 | #F5F0E8 | 背景/浅色 |
| 赭石 | #8B5A2B | 陶器 |
| 石绿 | #5B8A72 | 玉色 |
| 藤黄 | #D4A017 | 金色点缀 |
| 绛紫 | #8E416A | 宫廷色 |
| 湖蓝 | #4A7B8C | 晕染 |
| 泥金 | #C9A227 | 点睛 |
| 铅白 | #E8E4DC | 浅色填充 |

</templates>

<ui_layout>
## Page Layout

### Creation Page (`/pages/create/index`)
```
┌─────────────────────────────────┐
│  [← 返回]     选择模板    [历史] │  ← navigation bar
├─────────────────────────────────┤
│                                 │
│     [Template Selector Strip]   │  ← horizontal scroll, 4 template thumbs
│                                 │
├─────────────────────────────────┤
│                                 │
│                                 │
│       <canvas>                  │  ← coloring canvas, fills width, ~60vh
│       (line art + colors)       │
│                                 │
│                                 │
├─────────────────────────────────┤
│  [↩️ 撤销]  [🗑️ 清空]  [💾 保存] │  ← action bar
├─────────────────────────────────┤
│                                 │
│  ● ● ● ● ● ● ● ● ● ● ● ●      │  ← color palette swatches (horizontal)
│                                 │
└─────────────────────────────────┘
```

### History Page (`/pages/history/index`)
```
┌─────────────────────────────────┐
│  [← 返回]     我的创作          │  ← navigation bar
├─────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐     │
│  │     │  │     │  │     │     │  ← 3-column masonry/grid
│  │ 画作1│  │ 画作2│  │ 画作3│     │
│  │     │  └─────┘  │     │     │
│  └─────┘          └─────┘     │
│  ...                            │
└─────────────────────────────────┘
```

</ui_layout>

---

*Research complete: 2026-04-05*
