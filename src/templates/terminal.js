import { sectionDefaults, sectionFields, sections } from './sections.js'
import { clamp, esc, fontHead, fontsHref, hex, jsonForScript, list, MONO_FONTS, multi, pick, safeUrl, slug } from './util.js'

// Template: terminal launch page (live-typing terminal window next to the pitch).
const PALETTES = [
  { id: 'phosphor', label: 'Phosphor', bg: '#0b100d', fg: '#d8f5e2', accent: '#4ade80' },
  { id: 'amber', label: 'Amber', bg: '#120d06', fg: '#fde8c8', accent: '#fbbf24' },
  { id: 'ice', label: 'Ice', bg: '#0a1018', fg: '#dbe9fb', accent: '#60a5fa' },
  { id: 'chalk', label: 'Chalk', bg: '#f3f2ee', fg: '#15151a', accent: '#e4572e' },
]

const defaults = {
  ...sectionDefaults,
  features: 'One command | init, build, test and deploy from a single binary.\nWorks offline | Cache everything locally and sync when you are back.\nReadable logs | Plain text output you can pipe anywhere.',
  plans: 'Hobby | $0 | Side projects | 3 apps;Community support\n*Pro | $12/mo | Shipping weekly | Unlimited apps;Preview URLs;Email support\nTeam | $9/seat | Shared deploys | Roles;Audit log;SSO',
  footerText: '© 2026 shipit. MIT licensed.',
  brand: 'shipit',
  nav: 'Docs, Changelog, Pricing, GitHub',
  heading: 'Ship it from\nyour terminal.',
  subtitle: 'One command builds, tests and deploys your app. No dashboards, no YAML, no waiting for a build queue.',
  cta: 'Get started',
  ctaUrl: '#start',
  link: 'Read the docs',
  linkUrl: '#docs',
  install: 'npm i -g shipit',
  script: '$ shipit init\nCreated shipit.json\n$ shipit deploy\nBuilding 214 files...\nTests passed (38/38)\nLive at https://my-app.shipit.dev',
  stats: 'MIT licensed, 3.1k stars, Works offline',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  bodyFont: 'jetbrains',
  scan: true,
}

const fields = [
  { group: 'Content', open: true, items: [
    { key: 'brand', label: 'Brand name', type: 'text' },
    { key: 'heading', label: 'Headline', type: 'textarea', rows: 2, hint: 'One line per row, up to 3.' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 3 },
    { key: 'nav', label: 'Menu', type: 'text', hint: 'Comma separated.' },
    { key: 'cta', label: 'Button text', type: 'text', half: true },
    { key: 'ctaUrl', label: 'Button link', type: 'text', half: true },
    { key: 'link', label: 'Second link', type: 'text', half: true },
    { key: 'linkUrl', label: 'Second URL', type: 'text', half: true },
    { key: 'stats', label: 'Facts', type: 'text', hint: 'Comma separated.' },
  ] },
  { group: 'Terminal', open: true, items: [
    { key: 'install', label: 'Install command', type: 'text', hint: 'Shown with a copy button.' },
    { key: 'script', label: 'Terminal script', type: 'textarea', rows: 8, hint: 'Lines starting with "$ " are typed. Other lines print as output.' },
    { key: 'scan', label: 'CRT scanlines', type: 'check' },
  ] },
  { group: 'Style', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text'], ['accent', 'Accent']] },
    { key: 'bodyFont', label: 'Font', type: 'select', options: MONO_FONTS },
  ] },
  ...sectionFields,
]

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.getElementById('term');
  var lines = cfg.lines;

  function row(text, cmd) {
    var d = document.createElement('div');
    d.className = cmd ? 'ln cmd' : 'ln';
    body.appendChild(d);
    return d;
  }
  function play() {
    body.textContent = '';
    var i = 0;
    (function next() {
      if (i >= lines.length) { setTimeout(play, 4200); return; }
      var raw = lines[i++], cmd = raw.slice(0, 2) === '$ ';
      var t = cmd ? raw.slice(2) : raw;
      var d = row(t, cmd);
      if (!cmd) { d.textContent = t; setTimeout(next, 420); return; }
      var k = 0;
      (function tick() {
        d.textContent = t.slice(0, k++);
        if (k <= t.length) setTimeout(tick, 55); else setTimeout(next, 500);
      })();
    })();
  }
  if (reduce) { lines.forEach(function (raw) { var cmd = raw.slice(0, 2) === '$ '; row(raw, cmd).textContent = cmd ? raw.slice(2) : raw; }); } else { play(); }

  var b = document.getElementById('copy');
  if (b) b.addEventListener('click', function () {
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(cfg.install).then(done, function () { b.textContent = 'Select it'; });
    else b.textContent = 'Select it';
  });
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const bf = pick(MONO_FONTS, c.bodyFont)
  const bg = hex(c.bg, '#0b100d'), fg = hex(c.fg, '#d8f5e2'), accent = hex(c.accent, '#4ade80')
  const sx = sections(c)
  const brand = c.brand || 'Your brand'
  const heading = String(c.heading || '').split('\n').slice(0, 3)
  const script = String(c.script || '').split('\n').map((l) => l.replace(/\s+$/, '')).filter(Boolean).slice(0, 14)
  const cfg = jsonForScript({ lines: script, install: String(c.install || '') })
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(heading.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(bf.q))}
<style>
:root{--bg:${bg};--fg:${fg};--accent:${accent};--mono:${bf.css},ui-monospace,Menlo,monospace;--dim:color-mix(in srgb,var(--fg) 58%,var(--bg));--line:color-mix(in srgb,var(--fg) 20%,var(--bg));--grid:color-mix(in srgb,var(--fg) 7%,var(--bg));--sx-accent:var(--accent);--sx-head:var(--mono);--sx-body:var(--mono);--sx-radius:0px}
.first{min-height:100svh;display:flex;flex-direction:column}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 15px/1.65 var(--mono);overflow-x:hidden;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:44px 44px;background-position:-1px -1px}
a{color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.top{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px clamp(18px,4vw,48px);background:var(--bg);border-bottom:1px solid var(--line)}
.brand{font-weight:700;font-size:17px;text-decoration:none;display:flex;align-items:center;gap:8px}
.brand::before{content:">_";color:var(--accent)}
.top nav{display:flex;gap:clamp(14px,2.4vw,30px);flex-wrap:wrap;justify-content:flex-end}
.top nav a{font-size:13px;text-decoration:none;color:var(--dim)}
.top nav a:hover{color:var(--fg)}
.hero{flex:1;display:grid;grid-template-columns:1fr 1.05fr;align-items:center;gap:clamp(24px,5vw,72px);padding:clamp(28px,5vw,64px) clamp(18px,4vw,48px)}
h1{margin:0 0 20px;font:700 clamp(34px,5.6vw,76px)/1.04 var(--mono);letter-spacing:-.035em}
h1 span{display:block}
h1 span:last-child{color:var(--accent)}
.sub{max-width:44ch;margin:0 0 26px;color:var(--dim)}
.install{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:420px;border:1px solid var(--line);background:color-mix(in srgb,var(--bg) 88%,var(--fg));padding:10px 10px 10px 16px;margin-bottom:22px}
.install code{font:inherit;font-size:14px;overflow-x:auto;white-space:nowrap}
.install code::before{content:"$ ";color:var(--accent)}
.install button{font:inherit;font-size:12px;font-weight:700;background:none;color:var(--fg);border:1px solid var(--line);padding:5px 12px;cursor:pointer}
.install button:hover{border-color:var(--accent);color:var(--accent)}
.ctas{display:flex;align-items:center;flex-wrap:wrap;gap:12px 22px;margin-bottom:26px}
.btn{display:inline-block;background:var(--accent);color:var(--bg);padding:12px 24px;text-decoration:none;font-weight:700;font-size:14px;border:2px solid var(--accent);transition:transform .12s}
.btn:hover{transform:translateY(-2px)}
.link{font-size:14px;text-decoration:none;border-bottom:1px solid var(--accent);padding-bottom:1px}
.facts{display:flex;flex-wrap:wrap;gap:6px 24px;list-style:none;margin:0;padding:0;font-size:12.5px;color:var(--dim)}
.facts li::before{content:"✓ ";color:var(--accent)}
.win{border:1px solid var(--line);background:color-mix(in srgb,var(--bg) 92%,#000);box-shadow:10px 10px 0 color-mix(in srgb,var(--accent) 30%,transparent);position:relative;overflow:hidden;min-width:0}
.win .bar{display:flex;align-items:center;gap:7px;padding:11px 14px;border-bottom:1px solid var(--line);font-size:12px;color:var(--dim)}
.win .bar i{width:10px;height:10px;border-radius:50%;background:var(--line)}
.win .bar i:first-child{background:var(--accent)}
.win .bar span{margin-left:8px}
#term{min-height:300px;padding:18px 18px 22px;font-size:14px}
.ln{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dim)}
.ln.cmd{color:var(--fg)}
.ln.cmd::before{content:"$ ";color:var(--accent)}
.ln.cmd:last-child::after{content:"";display:inline-block;width:.6em;height:1.1em;background:var(--accent);vertical-align:text-bottom;margin-left:2px;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
${c.scan ? '.win::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(transparent 0 2px,rgba(0,0,0,.18) 3px)}' : ''}
@media(max-width:860px){.hero{grid-template-columns:1fr}.top nav{display:none}}
@media(prefers-reduced-motion:reduce){.ln.cmd:last-child::after{animation:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#">${esc(brand)}</a>
  <nav aria-label="Main">${list(c.nav).map((n) => `<a href="#${esc(slug(n))}">${esc(n)}</a>`).join('')}</nav>
</header>
<main class="hero">
  <div>
    <h1>${heading.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
    <p class="sub">${multi(c.subtitle)}</p>
    ${c.install ? `<div class="install"><code>${esc(c.install)}</code><button id="copy" type="button">Copy</button></div>` : ''}
    <div class="ctas">
      <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
      ${c.link ? `<a class="link" href="${esc(safeUrl(c.linkUrl))}">${esc(c.link)}</a>` : ''}
    </div>
    <ul class="facts">${list(c.stats).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
  </div>
  <div class="win" aria-label="Terminal demo">
    <div class="bar"><i></i><i></i><i></i><span>${esc(slug(brand).replace(/^-|-$/g, '') || 'app')} — zsh</span></div>
    <div id="term"></div>
  </div>
</main>
</div>
${sx.html}
<script type="application/json" id="cfg">${cfg}</script>
<script>${RUNTIME}</script>
</body>
</html>
`
}

export default {
  id: 'terminal',
  name: 'Terminal Launch',
  blurb: 'A developer-tool landing page with a live-typing terminal.',
  tag: 'Developer tool',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.bodyFont] },
}
