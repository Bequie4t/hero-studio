// Template: pixel mascot hero (scanline mascot, typewriter speech bubble, ticker strip).
const PALETTES = [
  { id: 'paper', label: '종이', bg: '#f1f1ee', fg: '#0a0a0a', accent: '#0a0a0a' },
  { id: 'mint', label: '민트', bg: '#e6f4ec', fg: '#0b2a1e', accent: '#10b981' },
  { id: 'peach', label: '복숭아', bg: '#fff0e3', fg: '#2b1608', accent: '#ff6a3d' },
  { id: 'night', label: '밤', bg: '#0c0d12', fg: '#eaeaf0', accent: '#7cf3c5' },
]
const DISPLAY_FONTS = [
  { id: 'pixelify', label: 'Pixelify Sans', css: "'Pixelify Sans'", q: 'Pixelify+Sans:wght@500;700' },
  { id: 'silkscreen', label: 'Silkscreen', css: "'Silkscreen'", q: 'Silkscreen:wght@400;700' },
  { id: 'press', label: 'Press Start 2P', css: "'Press Start 2P'", q: 'Press+Start+2P' },
]
const defaults = {
  ...sectionDefaults,
  features: 'Sorts the noise | Pip files newsletters, receipts and alerts before you wake up.\nBooks without ping-pong | Proposes three times, then confirms the one that works.\nGuards your focus | Holds low-priority pings until your next break.',
  plans: 'Free | $0 | For one inbox | 1 inbox;Daily summary;Community help\n*Pro | $8/mo | For busy people | 3 inboxes;Meeting booking;Priority help\nTeam | $6/seat | For small crews | Shared rules;Admin controls;Onboarding call',
  footerText: '© 2026 Pip. All rights reserved.',
  brand: 'Pip',
  nav: 'Powers, Routine, Haunts, Story, Help',
  heading: 'PIP\nINBOX GHOST',
  subtitle: 'Pip floats through your inbox at night, files the noise, and leaves only what needs you.',
  cta: 'Start Free',
  ctaUrl: '#start',
  link: 'See Pip work',
  linkUrl: '#demo',
  bubbles: 'Boo! 12 emails filed,\n1 invoice flagged.\n---\nMeeting moved.\nYou are free at 3pm.\n---\nInbox zero. Go outside.',
  stats: '24k inboxes cleared, 9/10 smiles, 0 lost threads',
  mascot: 'ghost',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  displayFont: 'pixelify',
  bodyFont: 'jetbrains',
  lines: 5,
  layout: 'right',
  ticker: true,
  tickerItems: 'Sorts mail, Books meetings, Guards focus, Drafts replies, Chases invoices',
}
const fields = [
  { group: '내용', open: true, items: [
    { key: 'brand', label: '브랜드 이름', type: 'text' },
    { key: 'heading', label: '제목', type: 'textarea', rows: 2, hint: '한 줄에 한 행, 최대 3줄까지.' },
    { key: 'subtitle', label: '소제목', type: 'textarea', rows: 3 },
    { key: 'nav', label: '메뉴', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'cta', label: '버튼 문구', type: 'text', half: true },
    { key: 'ctaUrl', label: '버튼 링크', type: 'text', half: true },
    { key: 'link', label: '보조 링크', type: 'text', half: true },
    { key: 'linkUrl', label: '보조 링크 주소', type: 'text', half: true },
    { key: 'stats', label: '수치', type: 'text', hint: '쉼표(,)로 구분해요.' },
  ] },
  { group: '마스코트', open: true, items: [
    { key: 'mascot', label: '마스코트', type: 'choice', options: Object.entries(SPRITES).map(([id, s]) => ({ id, label: s.label })) },
    { key: 'bubbles', label: '말풍선', type: 'textarea', rows: 6, hint: '메시지는 --- 만 적은 줄로 나눠요.' },
    { key: 'lines', label: '스캔라인 굵기', type: 'range', min: 3, max: 8 },
    { key: 'layout', label: '배치', type: 'choice', options: [{ id: 'right', label: '마스코트 오른쪽' }, { id: 'left', label: '마스코트 왼쪽' }] },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text'], ['accent', 'Accent']] },
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: DISPLAY_FONTS },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: MONO_FONTS },
  ] },
  { group: '흐르는 띠', items: [
    { key: 'ticker', label: '흐르는 띠 보이기', type: 'check' },
    { key: 'tickerItems', label: '항목', type: 'text', hint: '쉼표(,)로 구분해요.' },
  ] },
  ...sectionFields,
]
import { SPRITES } from '../sprites.js'
import { sectionDefaults, sectionFields, sections } from './sections.js'
import { clamp, esc, fontHead, fontsHref, hex, jsonForScript, list, MONO_FONTS, multi, pick, safeUrl, slug } from './util.js'

// A tiny 5x5 mirrored logo mark derived from the brand name.
function logoMark(name, fg) {
  let h = 2166136261
  for (const ch of name || 'x') h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  let rects = ''
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < 3; x++) {
      if ((h >>> (y * 3 + x)) & 1) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`
        if (x < 2) rects += `<rect x="${4 - x}" y="${y}" width="1" height="1"/>`
      }
    }
  rects += '<rect x="2" y="2" width="1" height="1"/>'
  return `<svg class="mark" viewBox="0 0 5 5" width="26" height="26" fill="${fg}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`
}

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* speech bubble typewriter */
  var out = document.getElementById('bt');
  var msgs = cfg.bubbles;
  var mi = 0, ci = 0;
  function type() {
    var m = msgs[mi % msgs.length];
    if (ci <= m.length) {
      out.textContent = m.slice(0, ci++);
      setTimeout(type, 42);
    } else {
      setTimeout(function () { mi++; ci = 0; type(); }, 2200);
    }
  }
  if (msgs.length) { if (reduce) out.textContent = msgs[0]; else type(); }

  /* scanline mascot */
  var cv = document.getElementById('mascot');
  var ctx = cv.getContext('2d');
  var rows = cfg.sprite.rows, eyeRows = cfg.sprite.eyeRows;
  var N = rows.length, LV = { '.': 0.14, 'o': 0.36, '#': 0.7, '@': 1 };
  var W = 0;
  function fit() {
    var s = cv.parentElement.clientWidth, d = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(s * d);
    cv.width = cv.height = W;
    cv.style.width = cv.style.height = s + 'px';
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, W);
    var cs = W / N, stripes = cfg.lines, sh = cs / stripes;
    var reveal = reduce ? 1 : Math.min(1, t / 900);
    var bob = reduce ? 0 : Math.sin(t / 520) * cs * 0.16;
    var blink = !reduce && (t % 3800) > 3640;
    var g = !reduce && (t % 2700) < 110 ? Math.floor(t / 2700) * 5 % N : -1;
    ctx.fillStyle = cfg.fg;
    /* ground shadow */
    for (var k = 0; k < 5; k++) {
      var sw = cs * (9 - k * 1.3), y = cs * 14.2 + k * sh * 1.4;
      ctx.globalAlpha = 0.5 - k * 0.08;
      ctx.fillRect(W / 2 - sw / 2, y, sw, Math.max(1, sh * 0.35));
    }
    ctx.globalAlpha = 1;
    for (var r = 0; r < N; r++) {
      var row = rows[r], ox = r === g ? cs * 0.35 : 0;
      for (var c = 0; c < N; c++) {
        var ch = row.charAt(c);
        if (blink && ch === '@' && eyeRows.indexOf(r) > -1) ch = 'o';
        var lv = LV[ch];
        if (!lv) continue;
        for (var j = 0; j < stripes; j++) {
          var shimmer = reduce ? 1 : 0.88 + 0.12 * Math.sin(t / 300 + r * 0.9 + j);
          var th = sh * (0.16 + 0.84 * lv) * reveal * shimmer;
          ctx.fillRect(c * cs + ox, r * cs + j * sh + bob + (sh - th) / 2, cs + 0.6, th);
        }
      }
    }
  }
  function loop(t) { draw(t); if (!reduce) requestAnimationFrame(loop); }
  fit();
  window.addEventListener('resize', function () { fit(); if (reduce) draw(0); });
  requestAnimationFrame(loop);
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const sprite = SPRITES[c.mascot] || SPRITES.ghost
  const df = pick(DISPLAY_FONTS, c.displayFont)
  const bf = pick(MONO_FONTS, c.bodyFont)
  const bg = hex(c.bg, '#f1f1ee'), fg = hex(c.fg, '#0a0a0a'), accent = hex(c.accent, fg)
  const brand = c.brand || 'Your brand'
  const headingLines = String(c.heading || '').split('\n').slice(0, 3)
  const bubbles = String(c.bubbles || '').split(/\n---\n?/).map((s) => s.trim()).filter(Boolean)
  const lines = clamp(c.lines, 3, 8)
  const sx = sections(c)
  const tick = list(c.tickerItems)
  const tickRow = tick.map((t) => `<span>${esc(t)}</span>`).join('')
  const cfg = jsonForScript({ bubbles, fg, lines, sprite: { rows: sprite.rows, eyeRows: sprite.eyeRows } })

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(headingLines.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(df.q, bf.q))}
<style>
:root{--bg:${bg};--fg:${fg};--accent:${accent};--display:${df.css},'Courier New',monospace;--body:${bf.css},ui-monospace,Menlo,monospace;--sx-accent:var(--accent);--sx-head:var(--display);--sx-body:var(--body);--sx-radius:0px}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 15px/1.6 var(--body);overflow-x:hidden}
.first{min-height:100svh;display:flex;flex-direction:column}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.top{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px clamp(18px,4vw,48px)}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font:700 18px var(--display)}
.top nav{display:flex;gap:clamp(14px,2.4vw,32px);flex-wrap:wrap;justify-content:flex-end}
.top nav a{text-decoration:none;font-size:13px}
.top nav a:hover{text-decoration:underline;text-underline-offset:5px}
.hero{flex:1;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:clamp(12px,4vw,56px);padding:clamp(8px,3vw,32px) clamp(18px,4vw,48px) clamp(28px,5vw,56px)}
.layout-left .stage{order:-1}
h1{margin:0 0 clamp(18px,3vw,32px);font:700 clamp(38px,7.6vw,108px)/.98 var(--display);text-transform:uppercase;letter-spacing:.01em;overflow-wrap:anywhere}
h1 span{display:block}
.sub{max-width:36ch;margin:0 0 28px;font-size:15px}
.ctas{display:flex;align-items:center;flex-wrap:wrap;gap:12px 22px;margin-bottom:28px}
.btn{display:inline-block;background:var(--fg);color:var(--bg);padding:13px 24px;text-decoration:none;font-weight:700;font-size:14px;border:2px solid var(--fg);box-shadow:4px 4px 0 var(--accent);transition:transform .12s,box-shadow .12s}
.btn:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--accent)}
.link{text-decoration:none;font-size:14px;font-weight:500}
.link:hover{text-decoration:underline;text-underline-offset:5px}
.stats{display:flex;flex-wrap:wrap;gap:6px 22px;list-style:none;margin:0;padding:0;font-size:12.5px}
.stats li+li::before{content:"";display:inline-block;width:6px;height:6px;background:var(--accent);margin-right:22px;vertical-align:middle}
.stage{position:relative;width:min(100%,540px);aspect-ratio:1;justify-self:center}
.stage canvas{position:absolute;inset:0;image-rendering:pixelated}
.bubble{position:absolute;top:2%;right:0;z-index:2;max-width:76%;min-width:56%;background:var(--bg);border:3px solid var(--fg);box-shadow:5px 5px 0 var(--fg);padding:12px 16px;font-size:13.5px;font-weight:500;min-height:3.9em}
.bubble::after{content:"";position:absolute;left:22px;bottom:-14px;width:12px;height:12px;background:var(--bg);border:3px solid var(--fg);border-top:0;border-left:0;transform:rotate(45deg) translate(-4px,-4px)}
.layout-left .bubble{right:auto;left:0}
#bt{white-space:pre-line}
.caret{display:inline-block;width:.55em;height:1.05em;background:var(--fg);vertical-align:text-bottom;margin-left:2px;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.ticker{border-top:2px solid var(--fg);overflow:hidden;white-space:nowrap;font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.ticker div{display:inline-flex;gap:0;animation:slide 26s linear infinite;padding:11px 0}
.ticker span{padding:0 22px}
.ticker span::after{content:"";display:inline-block;width:7px;height:7px;background:var(--accent);margin-left:44px;vertical-align:middle}
@keyframes slide{to{transform:translateX(-50%)}}
@media(max-width:820px){.hero{grid-template-columns:1fr;gap:28px}.layout-left .stage{order:0}.stage{width:min(100%,420px)}.top nav{display:none}}
@media(prefers-reduced-motion:reduce){.caret,.ticker div{animation:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#">${logoMark(brand, fg)}<span>${esc(brand)}</span></a>
  <nav aria-label="Main">${list(c.nav).map((n) => `<a href="#${esc(slug(n))}">${esc(n)}</a>`).join('')}</nav>
</header>
<main class="hero layout-${c.layout === 'left' ? 'left' : 'right'}">
  <div class="copy">
    <h1>${headingLines.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
    <p class="sub">${multi(c.subtitle)}</p>
    <div class="ctas">
      <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
      ${c.link ? `<a class="link" href="${esc(safeUrl(c.linkUrl))}">${esc(c.link)} &rsaquo;</a>` : ''}
    </div>
    <ul class="stats">${list(c.stats).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
  </div>
  <div class="stage">
    <div class="bubble"><span id="bt"></span><i class="caret"></i></div>
    <canvas id="mascot" role="img" aria-label="Animated pixel mascot"></canvas>
  </div>
</main>
${c.ticker && tick.length ? `<div class="ticker" aria-hidden="true"><div>${tickRow}${tickRow}${tickRow}${tickRow}</div></div>` : ''}
</div>
${sx.html}
<script type="application/json" id="cfg">${cfg}</script>
<script>${RUNTIME}</script>
</body>
</html>
`
}

export default {
  id: 'pixel',
  group: '일반',
  name: '픽셀 마스코트',
  blurb: '스캔라인 픽셀 마스코트와 말하는 말풍선.',
  tag: 'AI 에이전트',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.displayFont, x.bodyFont] },
}
