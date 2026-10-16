// A hero cat drawn procedurally on a 64x64 pixel grid: shapes, an automatic outline, and a few moving parts
// (tail, cape, blink, ear twitch). drawCat(t) returns the grid as an ImageData-ready RGBA array.
export const SIZE = 64

const C = {
  line: '#2a2140', fur: '#f6a04a', furD: '#dd7f2c', furL: '#ffc47a', white: '#fff3df', whiteD: '#e9d4b4',
  mask: '#3d3470', cape: '#ff5c8a', capeD: '#c93a69', capeL: '#ff93b3', gold: '#ffd447', ear: '#ffaec0', nose: '#ff7d9b', pupil: '#2a2140', eye: '#ffffff',
}
const rgb = Object.fromEntries(Object.entries(C).map(([k, h]) => [k, [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))]))

export function drawCat(t = 0, { blink = false, twitch = 0, look = 0 } = {}) {
  const g = new Array(SIZE * SIZE).fill(null)
  const set = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) g[y * SIZE + x] = c }
  const get = (x, y) => (x < 0 || y < 0 || x >= SIZE || y >= SIZE ? null : g[y * SIZE + x])
  const ellipse = (cx, cy, rx, ry, c, test) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
      if (d <= 1 && (!test || test(x, y, d))) set(x, y, typeof c === 'function' ? c(x, y, d) : c)
    }
  }
  const tri = (a, b, c, col) => {
    const minX = Math.min(a[0], b[0], c[0]), maxX = Math.max(a[0], b[0], c[0]), minY = Math.min(a[1], b[1], c[1]), maxY = Math.max(a[1], b[1], c[1])
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      const w0 = ((b[0] - x) * (c[1] - y) - (c[0] - x) * (b[1] - y)) / area
      const w1 = ((c[0] - x) * (a[1] - y) - (a[0] - x) * (c[1] - y)) / area
      const w2 = 1 - w0 - w1
      if (w0 >= 0 && w1 >= 0 && w2 >= 0) set(x, y, typeof col === 'function' ? col(x, y) : col)
    }
  }
  const poly = (pts, col) => { // even-odd scanline fill
    const ys = pts.map((p) => p[1])
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = []
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1))
      }
      xs.sort((a, b) => a - b)
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x <= Math.round(xs[k + 1]); x++) set(x, y, typeof col === 'function' ? col(x, y) : col)
    }
  }
  const bob = Math.round(Math.sin(t * 2.2) * 0.9) // breathing
  const wave = Math.sin(t * 3.1)

  // 1. cape (behind everything)
  const fl = wave * 2.2, fr = Math.sin(t * 3.1 + 1.4) * 2.2
  const capePts = [[21, 37 + bob], [43, 37 + bob], [55 + fr, 50], [60 + fr * 1.2, 61]]
  for (let x = 58; x >= 6; x -= 4) capePts.push([x + (x > 32 ? fr : fl) * 0.8, 61 + Math.sin(x * 0.35 + t * 4) * 1.4])
  capePts.push([4 + fl * 1.2, 61], [9 + fl, 50])
  poly(capePts, (x, y) => (y > 55 + Math.sin(x * 0.4 + t * 4) ? C.capeD : x < 16 + fl || x > 48 + fr ? C.capeD : (x + y) % 11 < 2 ? C.capeL : C.cape))

  // 2. tail (right side, wags)
  const ty = Math.sin(t * 3.4) * 5
  const p0 = [43, 55], p1 = [58, 55 + ty * 0.4], p2 = [60 + ty * 0.3, 33 + ty]
  for (let i = 0; i <= 44; i++) {
    const s = i / 44, a = (1 - s) ** 2, b = 2 * (1 - s) * s, c = s * s
    const x = a * p0[0] + b * p1[0] + c * p2[0], y = a * p0[1] + b * p1[1] + c * p2[1]
    const col = i > 40 ? C.white : i % 9 > 6 ? C.furD : C.fur
    ellipse(x, y, 2.1, 2.1, col)
  }

  // 3. body
  ellipse(32, 47 + bob, 12, 13, (x, y, d) => (d > 0.6 && x > 33 ? ((x + y) % 2 ? C.furD : C.fur) : C.fur))
  ellipse(32, 51 + bob, 6.5, 8.5, (x, y, d) => (d > 0.7 && x > 34 ? C.whiteD : C.white))
  // paws
  for (const px of [26, 38]) {
    ellipse(px, 59, 4.2, 3, C.white)
    set(px, 60, C.whiteD); set(px - 1, 59, C.whiteD); set(px + 1, 59, C.whiteD)
  }

  // 4. cape collar and drape over the shoulders
  tri([20, 36 + bob], [26, 38 + bob], [22, 49], C.cape)
  tri([44, 36 + bob], [38, 38 + bob], [42, 49], C.cape)
  tri([20, 36 + bob], [23, 40 + bob], [21, 46], C.capeD)
  tri([44, 36 + bob], [41, 40 + bob], [43, 46], C.capeD)
  ellipse(32, 38 + bob, 11.5, 3.2, (x, y) => (y > 39 + bob ? C.capeD : C.cape))
  ellipse(32, 40 + bob, 2.4, 2.4, C.gold); set(32, 40 + bob, '#fff2a8')

  // 5. head
  const hy = 26 + bob
  const ex = Math.round(twitch)
  tri([18, hy - 8], [19 - 1, hy - 21 + ex], [30, hy - 13], C.fur)
  tri([46, hy - 8], [45 + 1, hy - 21 + ex], [34, hy - 13], C.fur)
  tri([21, hy - 9], [21, hy - 16 + ex], [27, hy - 12], C.ear)
  tri([43, hy - 9], [43, hy - 16 + ex], [37, hy - 12], C.ear)
  ellipse(32, hy, 15.5, 12, (x, y, d) => (d > 0.78 && y > hy + 3 ? C.furD : y < hy - 5 ? C.furL : C.fur))
  // cheek tufts
  tri([17, hy + 2], [12, hy + 5], [18, hy + 7], C.fur); tri([47, hy + 2], [52, hy + 5], [46, hy + 7], C.fur)
  // forehead stripes
  for (const [x, len] of [[29, 3], [32, 4], [35, 3]]) for (let k = 0; k < len; k++) set(x, hy - 11 + k, C.furD)
  // muzzle
  ellipse(32, hy + 6, 6.5, 4.4, C.white)
  // mask across the eyes
  ellipse(18.5, hy, 3.2, 3.9, C.mask); ellipse(45.5, hy, 3.2, 3.9, C.mask)
  for (let y = hy - 3; y <= hy + 3; y++) for (let x = 19; x <= 45; x++) set(x, y, C.mask)
  // eyes
  for (const cx of [25, 39]) {
    if (blink) { for (let k = -3; k <= 3; k++) set(cx + k, hy, C.eye); }
    else {
      ellipse(cx, hy - 0.2, 3.6, 3.2, C.eye)
      const px = Math.round(look)
      ellipse(cx + px, hy + 0.4, 1.4, 2.2, C.pupil); set(cx + px - 1, hy - 1, C.eye)
    }
  }
  // nose and mouth
  for (const [x, y] of [[31, hy + 4], [32, hy + 4], [33, hy + 4], [32, hy + 5]]) set(x, y, C.nose)
  for (const [x, y] of [[32, hy + 6], [31, hy + 7], [30, hy + 7], [33, hy + 7], [34, hy + 7]]) set(x, y, C.line)
  // whiskers
  for (let k = 0; k < 5; k++) { set(12 + k, hy + 5 + (k > 2 ? 1 : 0), C.mask); set(52 - k, hy + 5 + (k > 2 ? 1 : 0), C.mask) }

  // 6. automatic outline: every empty pixel that touches a filled one
  const out = g.slice()
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!g[y * SIZE + x] && (get(x - 1, y) || get(x + 1, y) || get(x, y - 1) || get(x, y + 1))) out[y * SIZE + x] = C.line
  }
  const rgba = new Uint8ClampedArray(SIZE * SIZE * 4)
  const cache = {}
  out.forEach((c, i) => {
    if (!c) return
    const v = cache[c] || (cache[c] = [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16)))
    rgba[i * 4] = v[0]; rgba[i * 4 + 1] = v[1]; rgba[i * 4 + 2] = v[2]; rgba[i * 4 + 3] = 255
  })
  return rgba
}
