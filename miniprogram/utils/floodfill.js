/**
 * Stack-based scanline flood fill
 * @param {object} ctx - WeChat canvas context
 * @param {number} x - Tap x coordinate (canvas pixels)
 * @param {number} y - Tap y coordinate (canvas pixels)
 * @param {string} fillColor - Hex color to fill with, e.g. '#C04851'
 * @param {number} tolerance - RGB distance tolerance (default 30)
 * @returns {number} Number of pixels filled
 */
function floodFill(ctx, x, y, fillColor, tolerance = 30) {
  const { width, height } = ctx.canvas || { width: 300, height: 400 }
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Parse fill color
  const fillR = parseInt(fillColor.slice(1, 3), 16)
  const fillG = parseInt(fillColor.slice(3, 5), 16)
  const fillB = parseInt(fillColor.slice(5, 7), 16)

  // Get target color at tap point
  const idx = (Math.floor(y) * width + Math.floor(x)) * 4
  const targetR = data[idx]
  const targetG = data[idx + 1]
  const targetB = data[idx + 2]
  const targetA = data[idx + 3]

  // Don't fill if already the fill color
  if (targetR === fillR && targetG === fillG && targetB === fillB) return 0

  const colorMatch = (i) => {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a !== targetA) return false
    const dr = Math.abs(r - targetR)
    const dg = Math.abs(g - targetG)
    const db = Math.abs(b - targetB)
    return dr + dg + db <= tolerance
  }

  const setPixel = (i, r, g, b, a) => {
    data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = a
  }

  const getPixel = (i) => [data[i], data[i+1], data[i+2], data[i+3]]

  let count = 0
  const stack = [[Math.floor(x), Math.floor(y)]]
  const visited = new Uint8Array(width * height)

  while (stack.length > 0) {
    const [cx, cy] = stack.pop()
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue

    const pidx = cy * width + cx
    if (visited[pidx]) continue
    visited[pidx] = 1

    const i = pidx * 4
    if (!colorMatch(i)) continue

    // Find left and right boundaries of the scanline
    let left = cx
    let right = cx
    let ly = cy - 1, ry = cy + 1

    while (left > 0 && colorMatch((cy * width + (left - 1)) * 4)) left--
    while (right < width - 1 && colorMatch((cy * width + (right + 1)) * 4)) right++

    // Fill the scanline
    for (let sx = left; sx <= right; sx++) {
      const si = (cy * width + sx) * 4
      if (!colorMatch(si)) continue
      setPixel(si, fillR, fillG, fillB, targetA)
      visited[cy * width + sx] = 1
      count++

      // Check adjacent scanlines
      if (ly >= 0) {
        const li = (ly * width + sx) * 4
        if (!visited[ly * width + sx] && colorMatch(li)) {
          stack.push([sx, ly])
        }
      }
      if (ry < height) {
        const ri = (ry * width + sx) * 4
        if (!visited[ry * width + sx] && colorMatch(ri)) {
          stack.push([sx, ry])
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return count
}

module.exports = { floodFill }
