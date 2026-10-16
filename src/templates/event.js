import { sectionDefaults, sectionFields, sections } from './sections.js'
import { esc, fontHead, fontsHref, hex, jsonForScript, list, multi, pick, safeUrl, slug, koFont, navId } from './util.js'
import { MOODS, fxDefaults, fxGroupSoft, fxOf, withFx } from './fx.js'

// Template: event page with a live countdown and a speaker grid.
const BASE_PALETTES = [
  { id: 'lime', label: '라임', bg: '#0d0f0a', fg: '#f3f5ec', accent: '#c8ff3d' },
  { id: 'paper', label: '종이', bg: '#f4efe6', fg: '#1a1612', accent: '#e0432a' },
  { id: 'gold', label: '골드', bg: '#0b1226', fg: '#eef1fb', accent: '#f5b942' },
  { id: 'lilac', label: '라일락', bg: '#efe9ff', fg: '#1d1535', accent: '#6c47ff' },
]
const PALETTES = [...BASE_PALETTES, ...MOODS.map((m) => (m))]

const FONTS = [
  koFont('pretendard'), koFont('blackhan'), koFont('jua'), koFont('gowunbatang'),
  { id: 'syne', label: 'Syne', css: "'Syne'", q: 'Syne:wght@500;700;800' },
  { id: 'bricolage', label: 'Bricolage Grotesque', css: "'Bricolage Grotesque'", q: 'Bricolage+Grotesque:wght@400;600;800' },
  { id: 'fraunces', label: 'Fraunces', css: "'Fraunces'", q: 'Fraunces:wght@400;600;800' },
]

const defaults = {
  ...sectionDefaults,
  ...fxDefaults,
  featuresTitle: '이런 시간이에요',
  features: '짧은 발표 여섯 편 | 한 편에 열 분, 슬라이드 한 장은 스크린샷보다 길지 않아요.\n진짜 대화 | 쉬는 시간을 길게, 점심은 서로 만나도록 짰어요.\n모두에게 영상 | 모든 발표를 녹화해 티켓 구매자에게 공유해요.',
  pricingTitle: '티켓',
  plans: '얼리버드 | 8만 9천 원 | 1월 31일까지 | 발표 전체;점심;영상\n*일반 | 12만 9천 원 | 2월 1일부터 | 발표 전체;점심;영상;뒤풀이\n학생 | 3만 9천 원 | 학생증 지참 | 발표 전체;영상',
  footerText: '© 2027 골목 집사 모임. 서울에서 만나요.',
  brand: '골목 집사 모임',
  nav: '일정, 발표자, 장소, 티켓',
  eyebrow: '고양이와 사는 사람들을 위한 하루짜리 모임',
  heading: '골목 집사\n모임 2027',
  subtitle: '하루, 여섯 번의 이야기, 열 분을 넘기지 않는 발표. 고양이와 함께 사는 법을 나누러 오세요.',
  date: '2027-03-12T09:00',
  place: '서울 · 달무리 골목 책방',
  cta: '티켓 받기',
  ctaUrl: '#tickets',
  doneText: '지금 진행 중이에요. 어서 들어오세요.',
  speakersTitle: '발표자',
  speakers: '치즈 집사 | 고양이 행동 연구자\n고등어 집사 | 길고양이 급식소 운영자\n두부 집사 | 수의사\n먹물 집사 | 글 쓰는 사람',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  font: 'pretendard',
}

const fields = [
  { group: '행사', open: true, items: [
    { key: 'brand', label: '행사 이름', type: 'text' },
    { key: 'eyebrow', label: '한 줄 소개', type: 'text', hint: '제목 위에 들어가는 작은 문구예요.' },
    { key: 'heading', label: '제목', type: 'textarea', rows: 2, hint: '한 줄에 한 행, 최대 3줄까지.' },
    { key: 'subtitle', label: '설명', type: 'textarea', rows: 3 },
    { key: 'date', label: '시작 시각', type: 'datetime', hint: '카운트다운은 방문자의 시간대를 기준으로 해요.' },
    { key: 'place', label: '장소', type: 'text' },
    { key: 'doneText', label: '시작 후 문구', type: 'text' },
    { key: 'nav', label: '메뉴', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'cta', label: '버튼 문구', type: 'text', half: true },
    { key: 'ctaUrl', label: '버튼 링크', type: 'text', half: true },
  ] },
  { group: '연사', open: true, items: [
    { key: 'speakersTitle', label: '제목', type: 'text' },
    { key: 'speakers', label: '연사', type: 'textarea', rows: 6, hint: '한 줄에 하나: 이름 | 역할 (최대 8개)' },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text'], ['accent', 'Accent']] },
    { key: 'font', label: '폰트', type: 'select', options: FONTS },
  ] },
  ...sectionFields,
  fxGroupSoft,
]

const DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

// "2027-03-12T09:00" -> "2027년 3월 12일 금요일 · 오전 9:00" without any time-zone conversion.
function when(s) {
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!m) return null
  const [y, mo, d, h, mi] = m.slice(1).map(Number)
  const day = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()]
  const hh = h % 12 || 12
  return { iso: s, text: `${y}년 ${mo}월 ${d}일 ${day} · ${h < 12 ? '오전' : '오후'} ${hh}:${String(mi).padStart(2, '0')}` }
}

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var box = document.getElementById('cd');
  var done = document.getElementById('cd-done');
  if (!box || !cfg.date) return;
  var target = new Date(cfg.date).getTime();
  if (isNaN(target)) return;
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function put(k, v) { var el = box.querySelector('[data-k="' + k + '"] b'); if (el) el.textContent = v; }
  function tick() {
    var left = target - Date.now();
    if (left <= 0) { box.hidden = true; if (done) done.hidden = false; return false; }
    var s = Math.floor(left / 1000);
    put('d', String(Math.floor(s / 86400)));
    put('h', pad(Math.floor(s % 86400 / 3600)));
    put('m', pad(Math.floor(s % 3600 / 60)));
    put('s', pad(s % 60));
    return true;
  }
  if (tick() !== false) {
    var id = setInterval(function () { if (tick() === false) clearInterval(id); }, 1000);
  }
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const f = pick(FONTS, c.font)
  const bg = hex(c.bg, '#0d0f0a'), fg = hex(c.fg, '#f3f5ec'), accent = hex(c.accent, '#c8ff3d')
  const sx = sections(c)
  const brand = c.brand || 'Your event'
  const heading = String(c.heading || '').split('\n').slice(0, 3)
  const w = when(c.date)
  const people = String(c.speakers || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 8)
  const initials = (n) => n.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const cfg = jsonForScript({ date: w ? w.iso : '' })
  const page = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(heading.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(f.q))}
<style>
:root{--bg:${bg};--fg:${fg};--accent:${accent};--font:${f.css},system-ui,sans-serif;--dim:color-mix(in srgb,var(--fg) 66%,var(--bg));--line:color-mix(in srgb,var(--fg) 20%,var(--bg));--sx-accent:var(--accent);--sx-head:var(--font);--sx-body:var(--font);--sx-radius:6px}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 16px/1.6 var(--font);overflow-x:hidden}
a{color:inherit}
[hidden]{display:none!important}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.first{min-height:100svh;display:flex;flex-direction:column;padding:0 clamp(18px,4vw,48px)}
.top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;border-bottom:1px solid var(--line)}
.brand{font-weight:800;font-size:19px;letter-spacing:-.02em;text-decoration:none}
.top nav{display:flex;gap:clamp(14px,2.6vw,32px);margin-left:auto;margin-right:12px}
.top nav a{text-decoration:none;font-size:14px;color:var(--dim)}
.top nav a:hover{color:var(--fg)}
.pill{padding:9px 18px;border-radius:99px;background:var(--accent);color:var(--bg);font-weight:700;font-size:14px;text-decoration:none;white-space:nowrap}
.hero{flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,3.6vw,40px);padding:clamp(28px,5vw,64px) 0}
.eyebrow{margin:0;font:700 13px/1 var(--font);letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
h1{margin:0;font:800 clamp(48px,11vw,168px)/.9 var(--font);letter-spacing:-.045em;text-wrap:balance}
h1 span{display:block}
.meta{display:flex;flex-wrap:wrap;gap:6px 28px;margin:0;font-size:clamp(15px,1.6vw,19px);font-weight:600}
.meta span+span::before{content:"";display:inline-block;width:8px;height:8px;background:var(--accent);margin-right:14px;vertical-align:middle}
.cd{display:flex;flex-wrap:wrap;gap:12px}
.cd div{min-width:92px;padding:14px 16px 12px;border:1.5px solid var(--fg);border-radius:var(--sx-radius);text-align:center}
.cd b{display:block;font:800 clamp(34px,5vw,56px)/1 var(--font);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.cd small{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
.done{margin:0;font:800 clamp(24px,3.4vw,40px)/1.1 var(--font);color:var(--accent)}
.row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px 48px}
.sub{margin:0;max-width:46ch;font-size:clamp(16px,1.6vw,19px);color:var(--dim)}
.btn{display:inline-block;padding:16px 32px;border-radius:99px;background:var(--fg);color:var(--bg);font-weight:700;text-decoration:none;transition:transform .15s,background .15s,color .15s}
.btn:hover{transform:translateY(-2px);background:var(--accent);color:var(--bg)}
.people{max-width:1200px;margin:0 auto;padding:clamp(48px,8vw,104px) clamp(18px,4vw,48px) 0}
.people h2{margin:0 0 28px;font:800 clamp(28px,4vw,48px)/1.05 var(--font);letter-spacing:-.03em}
.people ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:16px}
.people li{display:flex;align-items:center;gap:14px;padding:18px;border:1px solid var(--line);border-radius:var(--sx-radius)}
.people i{flex:0 0 52px;height:52px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--bg);font:800 17px var(--font);font-style:normal}
.people b{display:block;font-size:17px}
.people span{font-size:14px;color:var(--dim)}
@media(max-width:700px){.top nav{display:none}.top .pill{margin-left:auto}.cd div{min-width:72px;padding:10px}}
@media(prefers-reduced-motion:reduce){.btn{transition:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#">${esc(brand)}</a>
  <nav aria-label="주요 메뉴">${list(c.nav).map((n) => `<a href="#${esc(navId(n))}">${esc(n)}</a>`).join('')}</nav>
  <a class="pill" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
</header>
<main class="hero">
  ${c.eyebrow ? `<p class="eyebrow">${esc(c.eyebrow)}</p>` : ''}
  <h1>${heading.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
  <p class="meta">${w ? `<span>${esc(w.text)}</span>` : ''}${c.place ? `<span>${esc(c.place)}</span>` : ''}</p>
  ${w ? `<div class="cd" id="cd" role="timer" aria-label="행사 시작까지 남은 시간"><div data-k="d"><b>--</b><small>일</small></div><div data-k="h"><b>--</b><small>시간</small></div><div data-k="m"><b>--</b><small>분</small></div><div data-k="s"><b>--</b><small>초</small></div></div><p class="done" id="cd-done" hidden>${esc(c.doneText)}</p>` : ''}
  <div class="row">
    <p class="sub">${multi(c.subtitle)}</p>
    <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
  </div>
</main>
</div>
${people.length ? `<section class="people" id="speakers"><h2>${esc(c.speakersTitle)}</h2><ul>${people.map((l) => {
    const [n, r] = l.split('|').map((s) => s.trim())
    return `<li><i aria-hidden="true">${esc(initials(n))}</i><div><b>${esc(n)}</b><span>${esc(r || '')}</span></div></li>`
  }).join('')}</ul></section>` : ''}
${sx.html}
<script type="application/json" id="cfg">${cfg}</script>
<script>${RUNTIME}</script>
</body>
</html>
`
  return withFx(page, c, c.brand)
}

export default {
  id: 'event',
  group: '일반',
  name: '이벤트 카운트다운',
  blurb: '실시간 카운트다운, 연사, 티켓이 있는 행사 페이지.',
  tag: '행사',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => [{ ...defaults, ...c }.font],
}
