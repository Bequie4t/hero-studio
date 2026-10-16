import { sectionDefaults, sectionFields, sections } from './sections.js'
import { esc, fontHead, fontsHref, hex, imgSrc, list, multi, pick, safeUrl, slug } from './util.js'

// Template: editorial portfolio hero (oversized name, availability pill, project index).
const PALETTES = [
  { id: 'cream', label: 'Cream', bg: '#efe9df', fg: '#1b1a17', accent: '#d9461f' },
  { id: 'ink', label: 'Ink', bg: '#111111', fg: '#f1efe9', accent: '#c8ff3d' },
  { id: 'sky', label: 'Sky', bg: '#dfeaf5', fg: '#0f1b2d', accent: '#3b6cf6' },
  { id: 'blush', label: 'Blush', bg: '#f6e3e0', fg: '#2a1214', accent: '#c2314d' },
]

const FONTS = [
  { id: 'bricolage', label: 'Bricolage Grotesque', css: "'Bricolage Grotesque'", q: 'Bricolage+Grotesque:wght@400;600;800' },
  { id: 'fraunces', label: 'Fraunces', css: "'Fraunces'", q: 'Fraunces:wght@400;600;800' },
  { id: 'syne', label: 'Syne', css: "'Syne'", q: 'Syne:wght@500;700;800' },
]

const defaults = {
  ...sectionDefaults,
  features: 'Brand identity | Names, marks and the rules that keep them consistent.\nWebsites | Fast, accessible sites you can edit without a developer.\nMotion | Short loops and launch films for product moments.',
  plans: 'Sprint | $2,400 | One focused week | Brief and moodboard;Two concepts;One round of edits\n*Studio | $6,800 | A full identity | Logo system;Guidelines;Launch assets\nRetainer | $3,200/mo | Ongoing design | Weekly hours;Priority queue',
  pricingTitle: 'Ways to work together',
  footerText: '© 2026 Mara Ellison. Made by hand.',
  brand: 'Mara Ellison',
  nav: 'Work, About, Notes, Contact',
  status: 'Booking projects for November',
  heading: 'Designer\nof small, loud\nbrands.',
  subtitle: 'I help young studios and shops look like the best version of themselves. Based in Lisbon, working everywhere.',
  photo: '',
  photoAlt: '',
  cta: 'Say hello',
  ctaUrl: 'mailto:hello@example.com',
  projectsTitle: 'Selected work',
  projects: 'Fieldnote Coffee | Identity | 2026\nBasalt Ceramics | Website | 2025\nKitebird Air | Motion | 2025\nOxbow Press | Packaging | 2024',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  font: 'bricolage',
}

const fields = [
  { group: 'Content', open: true, items: [
    { key: 'brand', label: 'Your name', type: 'text' },
    { key: 'status', label: 'Availability', type: 'text', hint: 'Small pill at the top. Leave empty to hide.' },
    { key: 'heading', label: 'Headline', type: 'textarea', rows: 3, hint: 'One line per row, up to 3.' },
    { key: 'subtitle', label: 'Intro', type: 'textarea', rows: 3 },
    { key: 'photo', label: 'Portrait', type: 'image', hint: 'Shown beside your name in an arch.' },
    { key: 'photoAlt', label: 'Portrait description', type: 'text', hint: 'Read aloud by screen readers.' },
    { key: 'nav', label: 'Menu', type: 'text', hint: 'Comma separated.' },
    { key: 'cta', label: 'Button text', type: 'text', half: true },
    { key: 'ctaUrl', label: 'Button link', type: 'text', half: true },
  ] },
  { group: 'Projects', open: true, items: [
    { key: 'projectsTitle', label: 'Title', type: 'text' },
    { key: 'projects', label: 'Projects', type: 'textarea', rows: 6, hint: 'One per line: Name | Type | Year (up to 8).' },
  ] },
  { group: 'Style', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text'], ['accent', 'Accent']] },
    { key: 'font', label: 'Font', type: 'select', options: FONTS },
  ] },
  ...sectionFields,
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const f = pick(FONTS, c.font)
  const bg = hex(c.bg, '#efe9df'), fg = hex(c.fg, '#1b1a17'), accent = hex(c.accent, '#d9461f')
  const sx = sections(c)
  const photo = imgSrc(c.photo)
  const brand = c.brand || 'Your name'
  const heading = String(c.heading || '').split('\n').slice(0, 3)
  const projects = String(c.projects || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 8)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(heading.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(f.q))}
<style>
:root{--bg:${bg};--fg:${fg};--accent:${accent};--font:${f.css},Georgia,serif;--dim:color-mix(in srgb,var(--fg) 62%,var(--bg));--line:color-mix(in srgb,var(--fg) 22%,var(--bg));--sx-accent:var(--accent);--sx-head:var(--font);--sx-body:var(--font);--sx-radius:4px}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 17px/1.55 var(--font);overflow-x:hidden}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.first{min-height:100svh;display:flex;flex-direction:column;padding:0 clamp(18px,4vw,48px)}
.top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;flex-wrap:wrap}
.brand{font-weight:800;font-size:19px;letter-spacing:-.02em;text-decoration:none}
.top nav{display:flex;gap:clamp(14px,2.4vw,32px)}
.top nav a{text-decoration:none;font-size:15px}
.top nav a:hover{color:var(--accent)}
.status{display:inline-flex;align-items:center;gap:9px;border:1.5px solid var(--fg);border-radius:99px;padding:6px 14px;font-size:13px;font-weight:600}
.status::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--accent);animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.6);opacity:.5}}
.hero{flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(22px,4vw,44px);padding:clamp(16px,3vw,40px) 0}
h1{margin:0;font:800 clamp(46px,11.5vw,184px)/.9 var(--font);letter-spacing:-.05em;text-wrap:balance}
h1 span{display:block}
h1 span:last-child{color:var(--accent)}
.headline{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.portrait{flex:0 0 clamp(120px,17vw,250px);width:clamp(120px,17vw,250px);aspect-ratio:4/5;object-fit:cover;border-radius:999px 999px 14px 14px}
.row{display:flex;justify-content:space-between;align-items:flex-end;gap:24px 48px;flex-wrap:wrap}
.sub{margin:0;max-width:40ch;font-size:clamp(16px,1.7vw,20px)}
.btn{display:inline-flex;align-items:center;gap:10px;background:var(--fg);color:var(--bg);padding:16px 28px;border-radius:99px;font-weight:700;text-decoration:none;transition:gap .2s,background .2s}
.btn::after{content:"\\2192"}
.btn:hover{gap:16px;background:var(--accent)}
.work{border-top:1.5px solid var(--fg);margin-top:clamp(12px,3vw,32px)}
.work h2{margin:14px 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--dim)}
.work ol{list-style:none;margin:0;padding:0}
.work li{display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:baseline;border-bottom:1px solid var(--line);padding:14px 0;font-size:clamp(18px,2.4vw,30px);font-weight:600;letter-spacing:-.02em;transition:padding-left .2s,color .2s;cursor:default}
.work li:hover{padding-left:12px;color:var(--accent)}
.work li strong{font-weight:inherit}
.work li span{font-size:14px;font-weight:500;color:var(--dim);letter-spacing:0}
@media(max-width:640px){.top nav{display:none}.work li{grid-template-columns:1fr auto}.work li span:nth-child(2){display:none}}
@media(prefers-reduced-motion:reduce){.status::before{animation:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#">${esc(brand)}</a>
  <nav aria-label="Main">${list(c.nav).map((n) => `<a href="#${esc(slug(n))}">${esc(n)}</a>`).join('')}</nav>
  ${c.status ? `<span class="status">${esc(c.status)}</span>` : ''}
</header>
<main class="hero">
  <div class="headline"><h1>${heading.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>${photo ? `<img class="portrait" src="${photo}" alt="${esc(c.photoAlt)}">` : ''}</div>
  <div class="row">
    <p class="sub">${multi(c.subtitle)}</p>
    <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
  </div>
  ${projects.length ? `<section class="work" id="work"><h2>${esc(c.projectsTitle)}</h2><ol>${projects
    .map((l) => {
      const [n, t, y] = l.split('|').map((s) => s.trim())
      return `<li><strong>${esc(n)}</strong><span>${esc(t || '')}</span><span>${esc(y || '')}</span></li>`
    })
    .join('')}</ol></section>` : ''}
</main>
</div>
${sx.html}
</body>
</html>
`
}

export default {
  id: 'folio',
  name: 'Folio',
  blurb: 'An editorial portfolio page with an oversized name and project index.',
  tag: 'Portfolio',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.font] },
}
