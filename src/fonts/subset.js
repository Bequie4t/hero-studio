// Browser font subsetter: WOFF in -> harfbuzz (WASM) keeps only the wanted characters -> WOFF out.
// The harfbuzz calls follow the `subset-font` package, which needs Node. WOFF is used because the
// browser can inflate and deflate it natively (DecompressionStream / CompressionStream).
import wasmUrl from 'harfbuzzjs/dist/harfbuzz-subset.wasm?url'

const HB_MEMORY_MODE_WRITABLE = 2
const HB_SUBSET_SETS_LAYOUT_FEATURE_TAG = 6
const HB_SUBSET_FLAGS_NO_HINTING = 1

let hbPromise
export function useWasmBytes(bytes) { // for tests that run outside a browser
  hbPromise = WebAssembly.instantiate(bytes).then(({ instance }) => { instance.exports._initialize(); return instance.exports })
}
function hb() {
  if (!hbPromise) {
    hbPromise = fetch(wasmUrl).then((r) => r.arrayBuffer()).then((b) => WebAssembly.instantiate(b)).then(({ instance }) => {
      instance.exports._initialize()
      return instance.exports
    })
  }
  return hbPromise
}

async function pipe(stream, bytes) {
  const w = stream.writable.getWriter()
  w.write(bytes); w.close()
  return new Uint8Array(await new Response(stream.readable).arrayBuffer())
}
const inflate = (b) => pipe(new DecompressionStream('deflate'), b)
const deflate = (b) => pipe(new CompressionStream('deflate'), b)

const tag = (dv, o) => String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3))
const pad4 = (n) => (n + 3) & ~3

/** WOFF -> sfnt (TrueType) bytes. */
async function woffToSfnt(woff) {
  const dv = new DataView(woff.buffer, woff.byteOffset, woff.byteLength)
  if (tag(dv, 0) !== 'wOFF') return woff // already sfnt
  const flavor = dv.getUint32(4), n = dv.getUint16(12)
  const tables = []
  for (let i = 0; i < n; i++) {
    const o = 44 + i * 20
    const off = dv.getUint32(o + 4), comp = dv.getUint32(o + 8), orig = dv.getUint32(o + 12)
    let data = woff.subarray(off, off + comp)
    if (comp < orig) data = await inflate(data)
    tables.push({ tag: tag(dv, o), checksum: dv.getUint32(o + 16), data })
  }
  let pos = 12 + 16 * n
  const out = new Uint8Array(pos + tables.reduce((s, t) => s + pad4(t.data.length), 0))
  const od = new DataView(out.buffer)
  od.setUint32(0, flavor); od.setUint16(4, n)
  let sr = 1, es = 0
  while (sr * 2 <= n) { sr *= 2; es++ }
  od.setUint16(6, sr * 16); od.setUint16(8, es); od.setUint16(10, n * 16 - sr * 16)
  tables.forEach((t, i) => {
    const o = 12 + i * 16
    for (let k = 0; k < 4; k++) out[o + k] = t.tag.charCodeAt(k)
    od.setUint32(o + 4, t.checksum); od.setUint32(o + 8, pos); od.setUint32(o + 12, t.data.length)
    out.set(t.data, pos)
    pos += pad4(t.data.length)
  })
  return out
}

/** sfnt (TrueType) bytes -> WOFF. */
async function sfntToWoff(sfnt) {
  const dv = new DataView(sfnt.buffer, sfnt.byteOffset, sfnt.byteLength)
  const n = dv.getUint16(4)
  const tables = []
  for (let i = 0; i < n; i++) {
    const o = 12 + i * 16
    const off = dv.getUint32(o + 8), len = dv.getUint32(o + 12)
    const raw = sfnt.subarray(off, off + len)
    const z = await deflate(raw)
    tables.push({ tag: tag(dv, o), checksum: dv.getUint32(o + 4), orig: len, data: z.length < len ? z : raw })
  }
  tables.sort((a, b) => (a.tag < b.tag ? -1 : 1))
  let pos = 44 + 20 * n
  const total = pos + tables.reduce((s, t) => s + pad4(t.data.length), 0)
  const out = new Uint8Array(total)
  const od = new DataView(out.buffer)
  od.setUint32(0, 0x774f4646); od.setUint32(4, dv.getUint32(0)); od.setUint32(8, total); od.setUint16(12, n)
  od.setUint32(16, 12 + 16 * n + tables.reduce((s, t) => s + pad4(t.orig), 0))
  tables.forEach((t, i) => {
    const o = 44 + i * 20
    for (let k = 0; k < 4; k++) out[o + k] = t.tag.charCodeAt(k)
    od.setUint32(o + 4, pos); od.setUint32(o + 8, t.data.length); od.setUint32(o + 12, t.orig); od.setUint32(o + 16, t.checksum)
    out.set(t.data, pos)
    pos += pad4(t.data.length)
  })
  return out
}

/** Keeps only `chars` in a WOFF/TTF font and returns a WOFF. */
export async function subsetToWoff(fontBytes, chars) {
  const x = await hb()
  const heap = () => new Uint8Array(x.memory.buffer) // the heap can grow, so take a fresh view each time
  const font = await woffToSfnt(fontBytes)

  const input = x.hb_subset_input_create_or_fail()
  if (!input) throw new Error('harfbuzz: could not create subset input')
  const buf = x.malloc(font.byteLength)
  heap().set(font, buf)
  const blob = x.hb_blob_create(buf, font.byteLength, HB_MEMORY_MODE_WRITABLE, 0, 0)
  const face = x.hb_face_create(blob, 0)
  x.hb_blob_destroy(blob)

  const features = x.hb_subset_input_set(input, HB_SUBSET_SETS_LAYOUT_FEATURE_TAG)
  x.hb_set_clear(features)
  x.hb_set_invert(features)
  x.hb_subset_input_set_flags(input, x.hb_subset_input_get_flags(input) | HB_SUBSET_FLAGS_NO_HINTING)
  const unicodes = x.hb_subset_input_unicode_set(input)
  for (const c of chars) x.hb_set_add(unicodes, c.codePointAt(0))

  let subset
  try {
    subset = x.hb_subset_or_fail(face, input)
    if (!subset) throw new Error('harfbuzz: subsetting failed')
  } finally {
    x.hb_subset_input_destroy(input)
  }
  const result = x.hb_face_reference_blob(subset)
  const off = x.hb_blob_get_data(result, 0)
  const len = x.hb_blob_get_length(result)
  const out = new Uint8Array(heap().subarray(off, off + len)) // copy out of wasm memory
  x.hb_blob_destroy(result); x.hb_face_destroy(subset); x.hb_face_destroy(face); x.free(buf)
  if (!len) throw new Error('harfbuzz: empty subset')
  return sfntToWoff(out)
}
