// Sanity checks: sprite grids are 16x16, and the generator escapes user input.
import { SPRITES } from '../src/sprites.js'
import { TEMPLATES } from '../src/templates/index.js'

let bad = 0
for (const [id, s] of Object.entries(SPRITES)) {
  if (s.rows.length !== 16) { console.error(id, 'rows', s.rows.length); bad++ }
  s.rows.forEach((r, i) => { if (r.length !== 16) { console.error(id, 'row', i, 'len', r.length); bad++ } })
}
const evil = { brand: '<img src=x onerror=alert(1)>', heading: '<b>x</b>', subtitle: '<i>y</i>', cta: '<u>z</u>', ctaUrl: 'javascript:alert(1)', linkUrl: 'data:text/html,1', bg: 'red;}</style><script>alert(1)</script>', bubbles: '</script><script>alert(1)</script>', script: '$ </script><script>alert(1)</script>', install: '</script><b>', badge: '<s>', logos: '<s>a</s>', photo: 'data:image/png;base64,AAAA" onerror="alert(1)', shot: 'javascript:alert(1)', photoAlt: '"><script>alert(1)</script>', price: '<b>', place: '<i>', eyebrow: '<u>', date: '2027-01-01T00:00"><script>alert(1)</script>', speakers: '<b>x</b> | <i>y</i>', perks: '<u>p</u>' }
for (const t of TEMPLATES) {
  const html = t.build(evil)
  const hit = [/<img src=x/, /<b>x<\/b>/, /<u>z<\/u>/, /href="javascript:/i, /href="data:/i, /<script>alert/, /<\/script><script>alert/, /<[a-z][^>]*\sonerror=/i, /<b>x<\/b>/, /<i>y<\/i>/, /<u>p<\/u>/, /<s>a<\/s>/].filter((r) => r.test(html))
  if (hit.length) { console.error(t.id, 'escaping failed', hit.map(String)); bad++ }
  if (!t.build(t.defaults).includes('<!doctype html>')) { console.error(t.id, 'bad default build'); bad++ }
}
console.log(bad ? `FAILED (${bad})` : 'ok: sprites 16x16, all templates escape input')
process.exit(bad ? 1 : 0)
