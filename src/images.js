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
