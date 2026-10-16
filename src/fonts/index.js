import { subsetToWoff } from './subset.js'
import { FONTS } from './registry.js'
import { KO_FONTS } from './ko-registry.js'

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

const b64 = (u8) => {
  let s = ''
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000))
  return btoa(s)
}
const sources = new Map()
const koCache = new Map()

function koSource(id, w) {
  const k = `${id}-${w}`
  if (!sources.has(k)) sources.set(k, fetch(`${import.meta.env.BASE_URL}fonts/ko/${k}.woff`).then((r) => { if (!r.ok) throw new Error(k); return r.arrayBuffer() }).then((b) => new Uint8Array(b)))
  return sources.get(k)
}

// Korean fonts are trimmed to the characters the page actually uses, so each face is a few KB.
async function koFace(id, chars, used) {
  const f = KO_FONTS[id]
  if (!f) return ''
  // Only the weights the page asks for (each mapped to the nearest weight the font has).
  const want = new Set([...(used?.length ? used : [400])].map((w) => f.weights.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a))))
  const weights = f.weights.filter((w) => want.has(w))
  const key = `${id}|${weights.join(',')}|${chars}`
  if (!koCache.has(key)) {
    koCache.set(key, Promise.all(weights.map(async (w) => {
      const out = await subsetToWoff(await koSource(id, w), chars)
      return `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff;base64,${b64(out)}) format('woff')}`
    })).then((a) => a.join('\n')))
    if (koCache.size > 24) koCache.delete(koCache.keys().next().value)
  }
  return koCache.get(key)
}

/** Unique characters of a page (plus printable ASCII), used to trim Korean fonts. */
export function charsOf(html) {
  let ascii = ''
  for (let i = 0x20; i < 0x7f; i++) ascii += String.fromCharCode(i)
  return [...new Set(html + ascii)].sort().join('')
}

/** Font weights a page's CSS asks for (400 and 700 are always counted as the defaults). */
export function weightsOf(html) {
  const css = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || ''
  const out = new Set([400])
  for (const m of css.matchAll(/font(?:-weight)?\s*:\s*([^;}]*)/g)) {
    for (const n of m[1].matchAll(/\b([1-9]00)\b/g)) out.add(Number(n[1]))
    if (/\bbold\b/.test(m[1])) out.add(700)
  }
  return [...out].sort((a, b) => a - b)
}

/** @font-face rules (embedded) for the given font ids; `chars` and `weights` trim the Korean ones. */
export async function fontCss(ids, chars = charsOf(''), weights) {
  const list = [...new Set(ids)]
  const parts = await Promise.all(list.map((id) => (KO_FONTS[id] ? koFace(id, chars, weights) : faceCss(id))))
  return parts.filter(Boolean).join('\n')
}
