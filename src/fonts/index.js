import { FONTS } from './registry.js'

// Each file is loaded on demand and inlined as a data: URI, so a downloaded page needs no font host.
const FILES = import.meta.glob('./files/*.woff2', { query: '?inline', import: 'default' })
const cache = new Map()

async function faceCss(id) {
  const f = FONTS[id]
  if (!f) return ''
  if (!cache.has(id)) {
    cache.set(id, Promise.all(f.weights.map(async (w) => {
      const load = FILES[`./files/${id}-${w}.woff2`]
      if (!load) return ''
      const uri = await load()
      return `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${w};font-display:swap;src:url(${uri}) format('woff2')}`
    })).then((a) => a.join('\n')))
  }
  return cache.get(id)
}

/** @font-face rules (embedded) for the given font ids. */
export async function fontCss(ids) {
  return (await Promise.all([...new Set(ids)].map(faceCss))).filter(Boolean).join('\n')
}
