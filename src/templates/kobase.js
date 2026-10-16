import { koOptions, koStack } from '../fonts/ko-registry.js'
import { cols, esc, fontHead, hex, imgs, initial, multi, safeUrl } from './util.js'

// Shared pieces for the Korean fan templates: colours, fonts, footer, links, gallery, notice.
export const paletteColors = (p) => ({ bg: p.bg, card: p.card, fg: p.fg, accent: p.accent, accent2: p.accent2 })

export const styleGroup = (display = ['gowunbatang', 'jua', 'blackhan', 'nanumpen', 'galmuri', 'pretendard'], body = ['pretendard', 'gowundodum', 'gowunbatang', 'galmurimono']) => ({
  group: '스타일',
  items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', '배경'], ['card', '카드'], ['fg', '글자']] },
    { type: 'colors', keys: [['accent', '포인트'], ['accent2', '보조 포인트']] },
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: koOptions(display) },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: koOptions(body) },
  ],
})

export const footerGroup = {
  group: '안내와 링크',
  items: [
    { key: 'owner', label: '제작자·운영 주체', type: 'text' },
    { key: 'notice', label: '사용 안내', type: 'textarea', rows: 3 },
    { key: 'links', label: '링크', type: 'textarea', rows: 4, hint: '한 줄에 하나: 이름 | 주소 (최대 8개)' },
  ],
}

export const linksHtml = (text) => {
  const list = String(text ?? '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 8).map(cols)
  return list.length ? `<ul class="links">${list.map(([l, u]) => `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>` : ''
}
export const galleryHtml = (arr, label, title = '갤러리') => {
  const g = imgs(arr, 8)
  return g.length ? `<section class="sec" id="gallery"><h2>${esc(title)}</h2><div class="gal">${g.map((s, i) => `<figure><img src="${s}" alt="${esc(label)} ${i + 1}" loading="lazy" decoding="async"></figure>`).join('')}</div></section>` : ''
}
/** A friendlier stand-in when no illustration was uploaded (decorative, hidden from screen readers). */
export const phHtml = (name) => `<div class="ph" aria-hidden="true"><b>${esc(initial(name))}</b></div>`
export const noticeHtml = (c) => (c.notice ? `<section class="sec"><div class="notice">${multi(c.notice)}</div>${linksHtml(c.links)}</section>` : linksHtml(c.links) ? `<section class="sec">${linksHtml(c.links)}</section>` : '')
export const footerHtml = (c, name) => `<footer>${c.owner ? `© ${esc(c.owner)} · ` : ''}${esc(name)}</footer>`

const BASE = `
*{box-sizing:border-box}
html{scroll-behavior:smooth}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 16px/1.75 var(--body);overflow-x:hidden;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}
[hidden]{display:none!important}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.page{max-width:1040px;margin:0 auto;padding:clamp(20px,4vw,56px) clamp(16px,4vw,32px)}
.sec{margin-top:clamp(36px,6vw,72px)}
.sec h2{margin:0 0 18px;font:700 clamp(24px,3.2vw,34px)/1.2 var(--display)}
.notice{max-width:68ch;margin:0 auto;border:1.5px dashed var(--accent);border-radius:18px;padding:14px 20px;font-size:14.5px;text-align:center;background:color-mix(in srgb,var(--accent) 8%,var(--card))}
.links{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;list-style:none;margin:18px 0 0;padding:0}
.links a{display:inline-block;padding:7px 16px;border-radius:99px;background:var(--fg);color:var(--bg);font-size:13.5px;font-weight:600;text-decoration:none}
.gal{columns:3 200px;column-gap:12px}
.gal figure{margin:0 0 12px;break-inside:avoid;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--card)}
.gal img{display:block;width:100%;height:auto}
.chips{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}
.chips li{padding:2px 12px;border-radius:99px;background:color-mix(in srgb,var(--accent) 14%,var(--card));border:1px solid color-mix(in srgb,var(--accent) 35%,var(--card));font-size:13.5px}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px}
.ph{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 24% 18%,color-mix(in srgb,var(--accent2) 70%,#fff),transparent 62%),radial-gradient(circle at 82% 92%,color-mix(in srgb,var(--accent) 38%,transparent),transparent 58%),var(--accent2)}
.ph::before{content:"";position:absolute;inset:0;background:radial-gradient(color-mix(in srgb,var(--fg) 14%,transparent) 1.4px,transparent 1.8px) 0 0/16px 16px;opacity:.7}
.ph b{position:relative;font:700 clamp(64px,11vw,120px)/1 var(--display);color:color-mix(in srgb,var(--accent) 82%,var(--fg));text-shadow:4px 4px 0 color-mix(in srgb,var(--card) 75%,transparent)}
.gal figure{cursor:zoom-in}
dialog#lb{border:0;padding:0;background:transparent;max-width:min(96vw,1100px);max-height:96vh;overflow:visible}
dialog#lb::backdrop{background:rgba(10,8,18,.82)}
dialog#lb img{display:block;max-width:100%;max-height:86vh;margin:0 auto;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
dialog#lb button{display:block;margin:14px auto 0;padding:8px 22px;border-radius:99px;border:0;background:var(--card);color:var(--fg);font:700 14px var(--body);cursor:pointer}
.btn{display:inline-block;padding:13px 30px;border-radius:99px;background:var(--fg);color:var(--bg);font-weight:800;text-decoration:none;transition:transform .15s,background .15s}
.btn:hover{transform:translateY(-2px);background:var(--accent)}
details{border-bottom:1px solid var(--line);padding:12px 0}
summary{cursor:pointer;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:12px}
summary::after{content:"+";color:var(--accent)}
details[open] summary::after{content:"–"}
details p{margin:8px 0 0;color:var(--dim)}
footer{text-align:center;color:var(--dim);font-size:13px;padding:clamp(36px,6vw,72px) 0 8px}
@media(prefers-reduced-motion:reduce){.btn{transition:none}html{scroll-behavior:auto}}
`

const LIGHTBOX = String.raw`
(function () {
  var d = document.getElementById('lb');
  if (!d) return;
  var im = d.querySelector('img');
  document.querySelectorAll('.gal figure').forEach(function (f) {
    f.setAttribute('tabindex', '0'); f.setAttribute('role', 'button'); f.setAttribute('aria-label', '크게 보기');
    function open() { var s = f.querySelector('img'); im.src = s.src; im.alt = s.alt; d.showModal(); }
    f.addEventListener('click', open);
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  d.addEventListener('click', function (e) { if (e.target === d || e.target.tagName === 'BUTTON') d.close(); });
})();
`

/** Wraps a template body in the shared page shell. `d` holds the fallback colours. */
export function shell({ c, d, title, desc, fontCss, css = '', body, script = '', cfg = '' }) {
  const bg = hex(c.bg, d.bg), card = hex(c.card, d.card), fg = hex(c.fg, d.fg), accent = hex(c.accent, d.accent), accent2 = hex(c.accent2, d.accent2)
  const icon = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="${accent}" d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>`)
  const hasGal = body.includes('class="gal"')
  const js = [script, hasGal ? LIGHTBOX : ''].filter(Boolean).join('\n')
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="${bg}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,${icon}">
${fontHead(fontCss, '')}
<style>
:root{--bg:${bg};--card:${card};--fg:${fg};--accent:${accent};--accent2:${accent2};--display:${koStack(c.displayFont)};--body:${koStack(c.bodyFont)};--dim:color-mix(in srgb,var(--fg) 62%,var(--bg));--line:color-mix(in srgb,var(--fg) 14%,var(--bg))}${BASE}${css}</style>
</head>
<body>
${body}
${hasGal ? '<dialog id="lb" aria-label="이미지 크게 보기"><img alt=""><button type="button">닫기</button></dialog>' : ''}
${cfg ? `<script type="application/json" id="cfg">${cfg}</script>` : ''}${js ? `<script>${js}</script>` : ''}
</body>
</html>
`
}

export const fontsOf = (defaults) => (c) => { const x = { ...defaults, ...c }; return [x.displayFont, x.bodyFont] }

// "2026-12-20T23:59" -> "2026년 12월 20일 23:59" (no time-zone conversion)
export const whenKo = (s) => {
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  return m ? { iso: s, text: `${m[1]}년 ${+m[2]}월 ${+m[3]}일 ${m[4]}:${m[5]}` } : null
}
