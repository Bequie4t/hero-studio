// Sanity checks: sprite grids are 16x16, and every template escapes hostile input in every field.
import { parse } from 'parse5'
import { SPRITES } from '../src/sprites.js'
import { TEMPLATES } from '../src/templates/index.js'

let bad = 0
for (const [id, s] of Object.entries(SPRITES)) {
  if (s.rows.length !== 16) { console.error(id, 'rows', s.rows.length); bad++ }
  s.rows.forEach((r, i) => { if (r.length !== 16) { console.error(id, 'row', i, 'len', r.length); bad++ } })
}

const EVIL = '<img src=x onerror=alert(1)><script>alert(1)</script>"\'`${7*7}'
const BAD_IMG = ['data:image/png;base64,AAAA" onerror="alert(1)', 'javascript:alert(1)', '<svg onload=alert(1)>']
const hostile = (defaults) => Object.fromEntries(Object.entries(defaults).map(([k, v]) => [
  k,
  Array.isArray(v) ? BAD_IMG : typeof v !== 'string' ? v : /url|link/i.test(k) && !/^links$/.test(k) ? 'javascript:alert(1)' : k === 'photo' || k === 'shot' || /^(portrait|avatar|banner|image[AB])$/.test(k) ? BAD_IMG[0] : EVIL,
]))
// Walks the parsed document: no event-handler attributes, no javascript:/data: links, no injected <script>.
function audit(html) {
  const problems = []
  const walk = (n) => {
    if (n.attrs) for (const { name, value } of n.attrs) {
      if (/^on/i.test(name)) problems.push(`<${n.nodeName} ${name}>`)
      if (/^(href|src|action|formaction|xlink:href)$/i.test(name) && /^\s*(javascript:|vbscript:|data:(?!image\/(png|jpeg|webp|gif);base64,))/i.test(value)) problems.push(`<${n.nodeName} ${name}="${value.slice(0, 20)}">`)
    }
    if (n.nodeName === 'script' && !/application\/json/.test((n.attrs.find((a) => a.name === 'type') || {}).value || '')) {
      const text = (n.childNodes || []).map((c) => c.value || '').join('')
      if (/alert\(1\)|onerror/.test(text)) problems.push('injected script text')
    }
    if (n.nodeName === 'script' && (n.attrs.find((a) => a.name === 'type') || {}).value === 'application/json') {
      const text = (n.childNodes || []).map((c) => c.value || '').join('')
      if (/<\/script/i.test(text)) problems.push('json block can be closed early')
    }
    for (const c of n.childNodes || []) walk(c)
  }
  walk(parse(html))
  if (/<img src=x/.test(html)) problems.push('raw <img src=x> in output')
  return problems
}

// The audit itself must notice real problems.
const known = audit('<p><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">x</a><script>alert(1)</script></p>')
if (known.length < 3) { console.error('audit self-test failed', known); bad++ }

for (const t of TEMPLATES) {
  const html = t.build(hostile(t.defaults))
  const hit = audit(html)
  if (hit.length) { console.error(t.id, 'escaping failed', hit); bad++ }
  const ok = t.build(t.defaults)
  if (!ok.includes('<!doctype html>')) { console.error(t.id, 'bad default build'); bad++ }
  if (!Array.isArray(t.fonts(t.defaults)) || !t.fonts(t.defaults).length) { console.error(t.id, 'no fonts listed'); bad++ }
  if (!t.group) { console.error(t.id, 'missing group'); bad++ }
  // every editor field key must exist in the defaults
  for (const g of t.fields) for (const it of g.items) {
    if (it.key && !(it.key in t.defaults)) { console.error(t.id, 'field without default:', it.key); bad++ }
    for (const [k] of it.keys || []) if (!(k in t.defaults)) { console.error(t.id, 'colour without default:', k); bad++ }
  }
}
console.log(bad ? `FAILED (${bad})` : `ok: ${TEMPLATES.length} templates build and escape input; sprites 16x16`)
process.exit(bad ? 1 : 0)
