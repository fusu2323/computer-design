---
phase: 04-creation
plan: "01"
type: execute
wave: 1
depends_on: []
files_modified:
  - miniprogram/utils/templates.js
  - miniprogram/utils/colors.js
  - miniprogram/utils/floodfill.js
  - miniprogram/utils/storage.js
  - miniprogram/pages/create/index.js
  - miniprogram/pages/create/index.wxml
  - miniprogram/pages/create/index.wxss
  - miniprogram/pages/create/index.json
  - miniprogram/pages/history/index.js
  - miniprogram/pages/history/index.wxml
  - miniprogram/pages/history/index.wxss
  - miniprogram/pages/history/index.json
  - miniprogram/app.json
autonomous: true
requirements:
  - CREATE-01
  - CREATE-02
  - CREATE-03

must_haves:
  truths:
    - "User sees 4 ICH pattern template thumbnails in a horizontal strip"
    - "User taps a template and the line art renders on a canvas filling the screen width"
    - "User taps a color swatch then taps a closed region in the line art — the region fills with the selected color"
    - "User taps Save and sees '已保存到相册' toast within 2 seconds"
    - "User taps Share and WeChat native share menu appears with '发送给朋友' and '分享到朋友圈'"
    - "User can view a history grid of their past creations with thumbnails"
  artifacts:
    - path: "miniprogram/utils/templates.js"
      provides: "4 ICH pattern line art definitions as closed-region polygon paths"
      exports: "getTemplates, getTemplateById"
    - path: "miniprogram/utils/colors.js"
      provides: "12-color Eastern aesthetics palette"
      exports: "COLOR_PALETTE, getColorByName"
    - path: "miniprogram/utils/floodfill.js"
      provides: "Scanline O(n) flood-fill algorithm"
      exports: "floodFill"
    - path: "miniprogram/utils/storage.js"
      provides: "Creation history CRUD via wx.setStorage/wx.getStorage"
      exports: "getCreations, saveCreation, deleteCreation"
    - path: "miniprogram/pages/create/index.js"
      provides: "Main creation page with template selector, canvas, palette, save, share"
    - path: "miniprogram/pages/history/index.js"
      provides: "Creation history gallery page"
  key_links:
    - from: "miniprogram/pages/create/index.js"
      to: "miniprogram/utils/floodfill.js"
      via: "require() + floodFill(ctx, x, y, color)"
      pattern: "require.*floodfill"
    - from: "miniprogram/pages/create/index.js"
      to: "miniprogram/utils/templates.js"
      via: "require() + getTemplateById(id)"
      pattern: "require.*templates"
    - from: "miniprogram/pages/create/index.js"
      to: "miniprogram/utils/storage.js"
      via: "require() + saveCreation/getCreations"
      pattern: "require.*storage"
    - from: "miniprogram/pages/create/index.js"
      to: "miniprogram/pages/history/index.js"
      via: "wx.navigateTo"
      pattern: "navigateTo.*history"
---

<objective>
Implement Phase 4: Micro-Creation + Sharing for the 数字传承人 WeChat mini-program. Users can select ICH pattern line art templates, fill them with a 12-color palette using tap-to-fill, save creations to their phone album, and share to WeChat moments or contacts. Users can also view their creation history.
</objective>

<execution_context>
@D:/computer-design/.claude/get-shit-done/workflows/execute-plan.md
@D:/computer-design/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@miniprogram/pages/map/index.js
@miniprogram/utils/map.js
@miniprogram/app.wxss
@miniprogram/app.json

## Established Patterns (from Phase 3)

### WeChat API Callback Pattern
```javascript
wx.someAPI({
  success: (res) => { /* handle */ },
  fail: (err) => { /* handle error */ }
})
```

### Page Structure
Pages live at `pages/<name>/index.js` + `.wxml` + `.wxss` + `.json`

### Utils Module Pattern
```javascript
// utils/xxx.js
function someFunc(arg, callback) { /* ... */ }
module.exports = { someFunc }
```

### Page Navigation
```javascript
wx.navigateTo({ url: '/pages/xxx/index' })
```

## Design Tokens (from app.wxss)
- `--color-ink-black: #2B2B2B`
- `--color-rice-paper: #F7F5F0`
- `--color-vermilion: #C04851`
- `--color-cyan-glaze: #5796B3`
- `--color-tea-green: #CCD4BF`
- `--color-charcoal: #4A4A4A`
- Spacing: `--space-xs: 8rpx`, `--space-sm: 16rpx`, `--space-md: 24rpx`, `--space-lg: 32rpx`

## User Decisions (from 04-CONTEXT.md - LOCKED)
- **D-01:** WeChat native `<canvas>` component — no third-party SDK
- **D-02:** Flood-fill algorithm (scanline) for tap-to-fill
- **D-04:** 4 templates: 刺绣轮廓 (embroidery_outline), 剪纸窗花 (paper_cut), 青花瓷纹 (blue_white), 编织图案 (weaving)
- **D-05:** 12-color palette: 朱红 #C04851, 天青 #5796B3, 茶绿 #8B9A6D, 墨黑 #2B2B2B, 宣纸白 #F5F0E8, 赭石 #8B5A2B, 石绿 #5B8A72, 藤黄 #D4A017, 绛紫 #8E416A, 湖蓝 #4A7B8C, 泥金 #C9A227, 铅白 #E8E4DC
- **D-10:** `wx.canvasToTempFilePath` → `wx.saveImageToPhotosAlbum` for save
- **D-12/D-13:** `wx.showShareMenu` + `onShareAppMessage` for sharing
- **D-14/D-15:** `wx.setStorage`/`wx.getStorage` for creation history; new `/pages/history/index` page

## Research Insights (from 04-RESEARCH.md)
- Scanline flood fill: O(n) via `getImageData` + scanline stack + `putImageData`
- Canvas export: `wx.canvasToTempFilePath` requires canvas visible
- Album save: `wx.saveImageToPhotosAlbum` + `wx.authorize({ scope: 'scope.writePhotosAlbum' })`
- Share: `wx.showShareMenu` with `shareAppMessage` (contact) and `shareTimeline` (moments)
- Storage schema: `{ id, templateId, colorMap, thumbnail, timestamp }`
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create utility modules (templates, colors, floodfill, storage)</name>
  <files>miniprogram/utils/templates.js, miniprogram/utils/colors.js, miniprogram/utils/floodfill.js, miniprogram/utils/storage.js</files>
  <action>

**miniprogram/utils/colors.js** — Create 12-color Eastern aesthetics palette module:
```javascript
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
```

**miniprogram/utils/templates.js** — Create 4 ICH pattern line art template definitions. Each template has `id`, `name`, `thumbnail` (placeholder base64), and `regions` array. Each region: `{ id: string, points: [[x,y]...], label: string }`. Points normalized to 0-1 range (scaled to canvas size at render time). The 4 templates (per D-04):
1. `embroidery_outline` — 刺绣轮廓, traditional floral embroidery outline (~8 regions)
2. `paper_cut` — 剪纸窗花, classic double-happiness + floral paper cut (~6 regions)
3. `blue_white` — 青花瓷纹, blue-and-white porcelain lotus vine pattern (~10 regions)
4. `weaving` — 编织图案, traditional weave/textile grid pattern (~9 regions)

Each region is a closed polygon. Export `{ getTemplates, getTemplateById }`.

**miniprogram/utils/floodfill.js** — Implement scanline flood-fill algorithm (per D-02). Signature: `floodFill(ctx, x, y, fillColor, tolerance = 30)`. Algorithm:
1. Get full `ImageData` via `ctx.getImageData(0, 0, width, height)`
2. Extract target RGB at (x, y) from pixel data array (pixel at (x,y) = data[(y*width+x)*4 ... +3])
3. Convert fillColor hex to RGB
4. Use stack-based scanline fill: initialize stack with scanline (x, y, x2, y2 direction). For each popped scanline, expand left and right from center point while pixels are within `tolerance` RGB distance of target color. When boundary found, mark scanline done and push new scanlines above/below for the filled span.
5. `ctx.putImageData` to write back
6. Return number of pixels filled

Use stack-based (NOT recursive) to avoid call stack overflow. Tolerance of 30 RGB units handles anti-aliased edges. Export `{ floodFill }`.

**miniprogram/utils/storage.js** — Creation history CRUD:
```javascript
const STORAGE_KEY = 'ich_creations'

function getCreations(callback) {
  wx.getStorage({ key: STORAGE_KEY, success: (res) => callback(res.data || []), fail: () => callback([]) })
}

function saveCreation(creations, callback) {
  wx.setStorage({ key: STORAGE_KEY, data: creations, success: () => { if (callback) callback() }, fail: (err) => console.error(err) })
}

function deleteCreation(id, callback) {
  getCreations((creations) => {
    const filtered = creations.filter(c => c.id !== id)
    saveCreation(filtered, () => { if (callback) callback(filtered) })
  })
}

function clearCreations(callback) {
  wx.removeStorage({ key: STORAGE_KEY, success: () => { if (callback) callback() }, fail: () => { if (callback) callback() })
}

module.exports = { getCreations, saveCreation, deleteCreation, clearCreations }
```

</action>
  <verify>
    <automated>
node -e "
const t = require('./miniprogram/utils/templates.js');
const c = require('./miniprogram/utils/colors.js');
const f = require('./miniprogram/utils/floodfill.js');
const s = require('./miniprogram/utils/storage.js');
console.log('templates:', typeof t.getTemplates, t.getTemplates().length);
console.log('colors:', c.COLOR_PALETTE.length, 'colors');
console.log('floodfill:', typeof f.floodFill);
console.log('storage exports:', Object.keys(s).join(','));
"
    </automated>
  </verify>
  <done>All 4 utility modules exist at `miniprogram/utils/*.js` with correct `module.exports`. `templates.js` exports 4 templates with regions array. `colors.js` exports 12 colors. `floodfill.js` exports scanline flood-fill. `storage.js` exports CRUD operations.</done>
</task>

<task type="auto">
  <name>Task 2: Create creation page (pages/create/index.*)</name>
  <files>miniprogram/pages/create/index.js, miniprogram/pages/create/index.wxml, miniprogram/pages/create/index.wxss, miniprogram/pages/create/index.json</files>
  <action>

**miniprogram/pages/create/index.json**:
```json
{
  "usingComponents": {},
  "navigationBarTitleText": "纹样创作",
  "navigationBarBackgroundColor": "#2B2B2B",
  "navigationBarTextStyle": "white",
  "enableShareAppMessage": true,
  "enableShareTimeline": true
}
```

**miniprogram/pages/create/index.wxss** — Key styles using design tokens:
- `.create-page`: flex column, 100vh, background rice-paper
- `.template-strip`: horizontal scroll, 120rpx height, white background, padding var(--space-sm)
- `.template-thumb`: 100rpxx100rpx, border-radius 8rpx, border 2rpx solid charcoal, center text, font-size 22rpx
- `.template-thumb--active`: border-color vermilion, border-width 3rpx
- `.canvas-wrapper`: flex 1, center contents
- `.coloring-canvas`: width 100% of wrapper, aspect-ratio ~3:4
- `.action-bar`: flex row, 100rpx height, space-between, padding 0 var(--space-lg), background white, border-top 1rpx solid tea-green
- `.action-btn`: flex column center, no background, 80rpx tap target, color charcoal
- `.action-icon`: font-size 40rpx
- `.action-label`: font-size 20rpx, margin-top 4rpx
- `.palette-bar`: horizontal scroll, 100rpx height, white background, padding var(--space-xs) 0
- `.color-swatch`: width 72rpx, height 72rpx, border-radius 50%, margin 0 6rpx, box-shadow 0 2rpx 6rpx rgba(0,0,0,0.15)
- `.color-swatch--active`: border 3rpx solid ink-black, transform scale(1.15)

**miniprogram/pages/create/index.wxml** — Page structure:
```xml
<view class="create-page">
  <!-- Template strip -->
  <scroll-view class="template-strip" scroll-x enhanced show-scrollbar="{{false}}">
    <view class="templates-row">
      <view wx:for="{{templates}}" wx:key="id"
        class="template-thumb {{item.id === currentTemplateId ? 'template-thumb--active' : ''}}"
        data-id="{{item.id}}" bindtap="onTemplateTap">
        <text class="template-name">{{item.name}}</text>
      </view>
    </view>
  </scroll-view>

  <!-- Canvas -->
  <view class="canvas-wrapper">
    <canvas id="coloringCanvas" class="coloring-canvas" canvasId="coloringCanvas"
      bindtap="onCanvasTap" bindtouchstart="onCanvasTouchStart" bindtouchmove="onCanvasTouchMove"></canvas>
  </view>

  <!-- Action bar -->
  <view class="action-bar">
    <view class="action-btn" bindtap="onUndo"><text class="action-icon">↩️</text><text class="action-label">撤销</text></view>
    <view class="action-btn" bindtap="onClear"><text class="action-icon">🗑️</text><text class="action-label">清空</text></view>
    <view class="action-btn" bindtap="onSave"><text class="action-icon">💾</text><text class="action-label">保存</text></view>
    <view class="action-btn" bindtap="onShare"><text class="action-icon">📤</text><text class="action-label">分享</text></view>
    <view class="action-btn" bindtap="onViewHistory"><text class="action-icon">📚</text><text class="action-label">历史</text></view>
  </view>

  <!-- Color palette -->
  <scroll-view class="palette-bar" scroll-x enhanced show-scrollbar="{{false}}">
    <view class="palette-row">
      <view wx:for="{{palette}}" wx:key="hex"
        class="color-swatch {{item.hex === selectedColor ? 'color-swatch--active' : ''}}"
        style="background-color: {{item.hex}}"
        data-hex="{{item.hex}}" bindtap="onColorTap">
      </view>
    </view>
  </scroll-view>
</view>
```

**miniprogram/pages/create/index.js** — Main page logic:

1. **Imports at top**:
```javascript
const { getTemplates, getTemplateById } = require('../../utils/templates.js')
const { COLOR_PALETTE } = require('../../utils/colors.js')
const { floodFill } = require('../../utils/floodfill.js')
const { getCreations, saveCreation } = require('../../utils/storage.js')
```

2. **Page data**:
```javascript
data: {
  templates: [],
  currentTemplateId: '',
  selectedColor: COLOR_PALETTE[0].hex,
  canvasReady: false,
  undoStack: []
}
```

3. **onLoad** — Set templates, call initCanvas when ready

4. **onReady** — Get canvas context via `wx.createCanvasContext('coloringCanvas')`, query canvas size via `wx.createSelectorQuery().select('#coloringCanvas').boundingClientRect()`, store `canvasWidth`/`canvasHeight`, call `drawTemplate()`. Call `wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })`.

5. **drawTemplate** — Get template by id, for each region: scale points from 0-1 to canvasWidth/canvasHeight, call `ctx.beginPath()`, `ctx.moveTo/lineTo()`, `ctx.closePath()`, `ctx.strokeStyle('#2B2B2B')`, `ctx.lineWidth(2)`, `ctx.stroke()`. Fill each region with white first: `ctx.fillStyle('#F5F0E8')`, `ctx.fill()`. Then stroke. Call `ctx.draw()`. Push initial state to undoStack.

6. **onTemplateTap** — Get `templateId` from dataset, set `currentTemplateId`, call `drawTemplate()`

7. **onColorTap** — Get hex from dataset, set `selectedColor = hex`

8. **onCanvasTap** — Get tap coordinates from `e.detail.x` or `e.touches[0]`. Convert to canvas-relative coords: `canvasX = tapX * (canvasWidth / displayWidth)`, same for Y. Call `floodFill(ctx, canvasX, canvasY, selectedColor, 30)`. `ctx.draw()`. Save state to undoStack (max 10).

9. **onUndo** — If undoStack length > 1, pop last, call `ctx.putImageData(state, 0, 0)`, `ctx.draw()`. Toast "已撤销" if successful.

10. **onClear** — Fill canvas white, redraw template outline, reset undoStack.

11. **onSave** — Export and save to album:
```javascript
onSave() {
  wx.canvasToTempFilePath({
    canvasId: 'coloringCanvas',
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
    fail: (err) => { wx.showToast({ title: '导出失败', icon: 'none' }) }
  })
}
```

12. **saveToHistory** — Generate `{ id: 'creation_' + Date.now(), templateId, templateName, thumbnail: tempPath, timestamp }`, prepend to creations array (max 50), call `saveCreation(creations, cb)`.

13. **onShare** — Call `wx.canvasToTempFilePath` to generate share image, store path in `this.shareImagePath`, then call `wx.showShareMenu` again to ensure menu is ready.

14. **onShareAppMessage** — Return share card:
```javascript
onShareAppMessage() {
  const templateName = getTemplateById(this.data.currentTemplateId).name
  return { title: `我的${templateName}创作 - 数字传承人`, path: '/pages/create/index', imageUrl: this.shareImagePath || '' }
}
```

15. **onShareTimeline** — Return timeline card:
```javascript
onShareTimeline() {
  const templateName = getTemplateById(this.data.currentTemplateId).name
  return { title: `我的${templateName}创作 - 数字传承人`, imageUrl: this.shareImagePath || '' }
}
```

16. **onViewHistory** — `wx.navigateTo({ url: '/pages/history/index' })`

</action>
  <verify>
    <automated>
wc -l miniprogram/pages/create/index.js miniprogram/pages/create/index.wxml miniprogram/pages/create/index.wxss
# Each should be > 80 lines for the .js and > 30 for .wxml/.wxss
    </automated>
  </verify>
  <done>Creation page exists with 4 files. Canvas renders template line art. Tap on canvas triggers flood-fill. Color swatches are tappable. Undo/Clear/Save/Share/History buttons all wired to handlers.</done>
</task>

<task type="auto">
  <name>Task 3: Create history page and register pages in app.json</name>
  <files>miniprogram/pages/history/index.js, miniprogram/pages/history/index.wxml, miniprogram/pages/history/index.wxss, miniprogram/pages/history/index.json, miniprogram/app.json</files>
  <action>

**miniprogram/app.json** — Add the two new pages to the `pages` array:
```json
{
  "pages": [
    "pages/home/index",
    "pages/create/index",
    "pages/map/index",
    "pages/history/index"
  ]
}
```

**miniprogram/pages/history/index.json**:
```json
{
  "usingComponents": {},
  "navigationBarTitleText": "我的创作",
  "navigationBarBackgroundColor": "#2B2B2B",
  "navigationBarTextStyle": "white"
}
```

**miniprogram/pages/history/index.wxss** — History page styles:
- `.history-page`: flex column, 100vh, background rice-paper
- `.creations-scroll`: flex 1, overflow-y scroll
- `.creations-grid`: padding var(--space-sm), display grid, grid-template-columns repeat(3, 1fr), gap var(--space-sm)
- `.creation-card`: aspect-ratio 1, background white, border-radius 12rpx, overflow hidden, box-shadow 0 2rpx 12rpx rgba(0,0,0,0.1), position relative
- `.creation-img`: width 100%, height 100%, object-fit cover
- `.creation-overlay`: position absolute, bottom 0, left 0, right 0, background rgba(0,0,0,0.4), padding var(--space-xs) var(--space-sm)
- `.creation-name`: font-size 22rpx, color white
- `.empty-state`: flex column center, height 60vh
- `.empty-icon`: font-size 120rpx, opacity 0.3
- `.empty-text`: font-size 28rpx, color charcoal, margin-top var(--space-md)
- `.loading-state`: flex center, height 60vh

**miniprogram/pages/history/index.wxml** — Gallery page:
```xml
<view class="history-page">
  <scroll-view wx:if="{{creations.length > 0}}" class="creations-scroll" scroll-y enhanced>
    <view class="creations-grid">
      <view wx:for="{{creations}}" wx:key="id" class="creation-card"
        data-id="{{item.id}}" bindtap="onCreationTap">
        <image class="creation-img" src="{{item.thumbnail}}" mode="aspectFill" lazy-load />
        <view class="creation-overlay">
          <text class="creation-name">{{item.templateName}}</text>
        </view>
      </view>
    </view>
  </scroll-view>

  <view wx:if="{{creations.length === 0 && !loading}}" class="empty-state">
    <text class="empty-icon">🎨</text>
    <text class="empty-text">还没有创作记录</text>
  </view>

  <view wx:if="{{loading}}" class="loading-state">
    <view class="loading-spinner"></view>
  </view>
</view>
```

**miniprogram/pages/history/index.js** — History page logic:
```javascript
const { getCreations, deleteCreation } = require('../../utils/storage.js')

Page({
  data: { creations: [], loading: true },

  onLoad() { this.loadCreations() },

  onShow() { this.loadCreations() },

  loadCreations() {
    this.setData({ loading: true })
    getCreations((creations) => {
      this.setData({ creations, loading: false })
    })
  },

  onCreationTap(e) {
    const id = e.currentTarget.dataset.id
    const creation = this.data.creations.find(c => c.id === id)
    wx.showActionSheet({
      itemList: ['查看大图', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.previewImage({ urls: [creation.thumbnail], current: creation.thumbnail })
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
```

</action>
  <verify>
    <automated>
node -e "const a = require('./miniprogram/app.json'); console.log('pages:', JSON.stringify(a.pages))"
# Should include: pages/create/index and pages/history/index
    </automated>
  </verify>
  <done>History page exists with 4 files. app.json updated with create and history pages. Gallery shows 3-column grid. Empty state displays when no creations. Action sheet shows "查看大图" and "删除" options.</done>
</task>

</tasks>

<verification>

## Goal Verification (each criterion addressed)

| # | Criterion | Task | How Verified |
|---|-----------|------|--------------|
| 1 | User selects pre-defined ICH pattern template | Task 2 | Template strip with 4 thumbnails, onTemplateTap calls drawTemplate |
| 2 | User applies colors from palette to fill areas | Task 2 | 12 swatches in palette-bar, onColorTap sets selectedColor, onCanvasTap calls floodFill |
| 3 | User saves finished creation to album | Task 2 | onSave calls canvasToTempFilePath then saveImageToPhotosAlbum |
| 4 | User shares to moments or contact | Task 2 | onShareAppMessage and onShareTimeline return share cards; onShare shows menu |
| 5 | User views creation history in app | Task 3 | history/index page loads from storage, shows 3-column grid |

</verification>

<success_criteria>
- [ ] `miniprogram/utils/templates.js` exports 4 ICH templates with region polygons
- [ ] `miniprogram/utils/colors.js` exports 12-color palette
- [ ] `miniprogram/utils/floodfill.js` exports scanline flood-fill algorithm
- [ ] `miniprogram/utils/storage.js` exports CRUD for creation history
- [ ] `miniprogram/pages/create/index.*` creation page renders template + canvas + palette + action buttons
- [ ] `miniprogram/pages/history/index.*` history page shows gallery of past creations
- [ ] `miniprogram/app.json` includes new pages: create/index and history/index
- [ ] Save triggers canvasToTempFilePath + saveImageToPhotosAlbum
- [ ] Share triggers onShareAppMessage/onShareTimeline with canvas image
- [ ] CREATE-01, CREATE-02, CREATE-03 all addressed
</success_criteria>

<blocking_risks>

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Flood-fill O(n) still slow on large regions | Medium | High | Cap canvas logical size at 750x1000px; scanline stack-based avoids recursion |
| canvasToTempFilePath fails on hidden canvas | High | High | Canvas always visible in flex layout; export only from onSave handler |
| Album auth denied on first save | Medium | Medium | Catch fail callback, show "请授权保存到相册" + wx.openSetting |
| Share imageUrl requires local temp path | Medium | Medium | Use res.tempFilePath from canvasToTempFilePath, not remote URL |
| Template regions not closing properly | Low | Medium | Each template defines closed polygons; test render in onReady before interaction |

</blocking_risks>

<output>
After completion, create `.planning/phases/04-creation/04-01-SUMMARY.md`
</output>
