// Template: pixel mascot hero (scanline mascot, typewriter speech bubble, ticker strip).
const BASE_PALETTES = [
  { id: 'paper', label: '종이', bg: '#f1f1ee', fg: '#0a0a0a', accent: '#0a0a0a' },
  { id: 'mint', label: '민트', bg: '#e6f4ec', fg: '#0b2a1e', accent: '#10b981' },
  { id: 'peach', label: '복숭아', bg: '#fff0e3', fg: '#2b1608', accent: '#ff6a3d' },
  { id: 'night', label: '밤', bg: '#0c0d12', fg: '#eaeaf0', accent: '#7cf3c5' },
]
const PALETTES = [...BASE_PALETTES, ...MOODS.map((m) => (m))]
const DISPLAY_FONTS = [
  koFont('galmuri'), koFont('jua'), koFont('blackhan'),
  { id: 'pixelify', label: 'Pixelify Sans', css: "'Pixelify Sans'", q: 'Pixelify+Sans:wght@500;700' },
  { id: 'silkscreen', label: 'Silkscreen', css: "'Silkscreen'", q: 'Silkscreen:wght@400;700' },
  { id: 'press', label: 'Press Start 2P', css: "'Press Start 2P'", q: 'Press+Start+2P' },
]
const defaults = {
  ...sectionDefaults,
  ...fxDefaults,
  features: '소음 걸러 주기 | 뉴스레터와 영수증, 알림을 아침 전에 정리해 둬요.\n핑퐁 없는 일정 | 후보를 세 번 제안하고 맞는 시간으로 확정해요.\n집중 지켜 주기 | 급하지 않은 알림은 쉬는 시간까지 붙잡아 둬요.',
  plans: '무료 | 0원 | 편지함 하나 | 편지함 1개;매일 요약;커뮤니티 도움\n*프로 | 월 8,000원 | 바쁜 집사용 | 편지함 3개;일정 잡기;우선 도움\n팀 | 인당 월 6,000원 | 작은 팀용 | 공용 규칙;관리자 권한;도입 상담',
  footerText: '© 2026 나비 · 골목에서 정성껏 만들었어요.',
  brand: '나비',
  featuresTitle: '나비가 해 주는 일',
  pricingTitle: '요금',
  nav: '능력, 하루, 아지트, 이야기, 도움',
  heading: '나비,\n편지함\n고양이',
  subtitle: '나비는 밤마다 편지함 위를 사뿐사뿐 걸으며 소음은 정리하고, 정말 필요한 메일만 남겨 둬요.',
  cta: '무료로 시작',
  ctaUrl: '#start',
  link: '나비가 일하는 모습',
  linkUrl: '#demo',
  bubbles: '야옹! 메일 12통 정리했어요.\n청구서 1건은 표시해 뒀어요.\n---\n회의를 옮겼어요.\n오후 3시는 비어 있어요.\n---\n받은편지함 0통.\n이제 낮잠 자러 가요.',
  stats: '정리한 편지함 2.4만 개, 만족도 10점 중 9점, 잃어버린 메일 0통',
  mascot: 'cat',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  displayFont: 'galmuri',
  bodyFont: 'galmurimono',
  lines: 5,
  layout: 'right',
  ticker: true,
  tickerItems: '메일 정리, 일정 잡기, 집중 지키기, 답장 초안, 청구서 독촉',
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
  fxGroupSoft,
]
import { SPRITES } from '../sprites.js'
import { sectionDefaults, sectionFields, sections } from './sections.js'
import { clamp, esc, fontHead, fontsHref, hex, jsonForScript, list, MONO_FONTS, multi, pick, safeUrl, slug, koFont, navId } from './util.js'
import { MOODS, fxDefaults, fxGroupSoft, fxOf, withFx } from './fx.js'

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

  const page = `<!doctype html>
<html lang="ko">
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
  <nav aria-label="주요 메뉴">${list(c.nav).map((n) => `<a href="#${esc(navId(n))}">${esc(n)}</a>`).join('')}</nav>
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
    <canvas id="mascot" role="img" aria-label="움직이는 픽셀 마스코트"></canvas>
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
  return withFx(page, c, c.brand)
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
