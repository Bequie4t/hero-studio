// Reads an uploaded image, scales it down and returns a data: URI so the exported page stays self-contained.
const OK = /^image\/(png|jpeg|webp|gif)$/

export async function readImage(file, { max = 1600 } = {}) {
  if (!file || !OK.test(file.type)) throw new Error('Use a PNG, JPEG, WebP or GIF image')
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = () => rej(new Error('That image could not be read'))
      i.src = url
    })
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k))
    const cv = document.createElement('canvas')
    cv.width = w; cv.height = h
    cv.getContext('2d').drawImage(img, 0, 0, w, h)
    const keepsAlpha = file.type === 'image/png' || file.type === 'image/gif'
    let out = cv.toDataURL(keepsAlpha ? 'image/png' : 'image/webp', 0.82)
    if (!out.startsWith('data:image/')) out = cv.toDataURL('image/jpeg', 0.82)
    return out
  } finally {
    URL.revokeObjectURL(url)
  }
}

const hsl = (h, s, l) => {
  s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))
  return '#' + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, '0')).join('')
}

/** Builds a colour theme from the dominant hue of an uploaded illustration. */
export async function paletteFromImage(uri, mode = 'light') {
  const img = await new Promise((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = () => rej(new Error('이미지를 읽지 못했어요'))
    i.src = uri
  })
  const N = 48
  const cv = document.createElement('canvas')
  cv.width = cv.height = N
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, N, N)
  const px = ctx.getImageData(0, 0, N, N).data
  const sin = new Array(24).fill(0), cos = new Array(24).fill(0), wt = new Array(24).fill(0)
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 200) continue
    const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
    const s = max ? d / max : 0
    if (s < 0.25 || max < 0.25) continue
    let h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h = (h * 60 + 360) % 360
    const w = s * max, k = Math.floor(h / 15) % 24
    sin[k] += Math.sin((h * Math.PI) / 180) * w; cos[k] += Math.cos((h * Math.PI) / 180) * w; wt[k] += w
  }
  const best = wt.indexOf(Math.max(...wt))
  const hue = wt[best] > 0 ? (Math.atan2(sin[best], cos[best]) * 180 / Math.PI + 360) % 360 : 330
  const h = Math.round(hue), h2 = (h + 28) % 360
  return mode === 'dark'
    ? { bg: hsl(h, 38, 9), card: hsl(h, 32, 15), fg: hsl(h, 45, 94), accent: hsl(h, 85, 70), accent2: hsl(h2, 45, 32) }
    : { bg: hsl(h, 70, 96), card: '#ffffff', fg: hsl(h, 35, 15), accent: hsl(h, 72, 56), accent2: hsl(h2, 80, 86) }
}
