import { koOptions, koStack } from '../fonts/ko-registry.js'
import { cols, esc, fontHead, hex, imgSrc, imgs, initial, jsonForScript, lines, multi, safeUrl, ymd } from './util.js'

// Template: 자캐 커플 아카이브 — two characters, a D+ counter, a timeline and a Q&A.
const PALETTES = [
  { id: 'rose', label: '로즈 밀크', bg: '#fff3f0', card: '#ffffff', fg: '#3a2226', accent: '#e5566d', accent2: '#ffd5cf' },
  { id: 'night', label: '별밤', bg: '#0f1230', card: '#1a1e47', fg: '#eef0ff', accent: '#ffc857', accent2: '#4651c7' },
  { id: 'soda', label: '소다 블루', bg: '#eef7ff', card: '#ffffff', fg: '#1b2a3d', accent: '#3b8df0', accent2: '#ffd1e6' },
  { id: 'wine', label: '와인', bg: '#1c0d14', card: '#2a1520', fg: '#f6e8ee', accent: '#e0587a', accent2: '#7a1f3d' },
]

const defaults = {
  title: '서하 × 하윤',
  subtitle: '새벽 천문대에서 시작된 두 사람의 기록',
  date: '2025-03-14',
  dateLabel: '함께한 지',
  nameA: '이서하',
  infoA: '새벽 천문대의 관측 기사 · 11월 3일생',
  imageA: '',
  nameB: '정하윤',
  infoB: '천문대 정비사 · 6월 21일생',
  imageB: '',
  quoteA: '하윤이 옆에 있으면 길을 잃어도 괜찮아.',
  quoteB: '서하가 올려다보는 하늘을 같이 보고 싶었어.',
  story: '같은 천문대에서 일하던 두 사람은 별똥별이 많이 떨어지던 밤에 처음으로 서로의 이름을 불렀어요. 이 페이지는 그날부터 지금까지의 이야기를 모아 두는 작은 보관함입니다.',
  timeline: '2025-03-14 | 첫 고백 | 별똥별이 쏟아지던 옥상에서.\n2025-05-02 | 첫 여행 | 길치 서하가 처음으로 지도를 하윤에게 맡긴 날.\n2025-09-20 | 같이 살기 시작 | 천문대 숙소를 나와 작은 집으로.\n2026-03-14 | 1주년 | 처음 만난 옥상에서 다시 별을 봤어요.',
  qa: '좋아하는 계절 | 겨울 | 여름\n아침형 / 저녁형 | 새벽형 | 저녁형\n제일 좋아하는 음식 | 따뜻한 홍차 | 서하가 끓여 주는 죽\n서로의 첫인상 | 조용한 사람 | 자꾸 길을 잃는 사람',
  gallery: [],
  owner: '제작자 닉네임',
  notice: '두 캐릭터는 제작자의 오리지널 캐릭터(자캐)입니다. 무단 도용과 AI 학습 사용을 금지합니다.',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/',
  bg: PALETTES[0].bg,
  card: PALETTES[0].card,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  accent2: PALETTES[0].accent2,
  displayFont: 'gowunbatang',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '커플 정보', open: true, items: [
    { key: 'title', label: '커플 이름', type: 'text', hint: '예: 서하 × 하윤' },
    { key: 'subtitle', label: '한 줄 소개', type: 'text' },
    { key: 'date', label: '기념일 기준일', type: 'date', hint: '이 날이 D+1일이에요. 비워 두면 카운터를 숨겨요.' },
    { key: 'dateLabel', label: '카운터 문구', type: 'text' },
    { key: 'story', label: '소개글', type: 'textarea', rows: 4 },
  ] },
  { group: '첫 번째 캐릭터', open: true, items: [
    { key: 'nameA', label: '이름', type: 'text' },
    { key: 'infoA', label: '소개', type: 'text' },
    { key: 'imageA', label: '일러스트', type: 'image', theme: true },
    { key: 'quoteA', label: '상대에게 한마디', type: 'text' },
  ] },
  { group: '두 번째 캐릭터', open: true, items: [
    { key: 'nameB', label: '이름', type: 'text' },
    { key: 'infoB', label: '소개', type: 'text' },
    { key: 'imageB', label: '일러스트', type: 'image' },
    { key: 'quoteB', label: '상대에게 한마디', type: 'text' },
  ] },
  { group: '타임라인', items: [
    { key: 'timeline', label: '기록', type: 'textarea', rows: 7, hint: '한 줄에 하나: 날짜 | 제목 | 내용 (최대 12개)' },
  ] },
  { group: '취향 문답', items: [
    { key: 'qa', label: '문답', type: 'textarea', rows: 5, hint: '한 줄에 하나: 질문 | 첫 번째 답 | 두 번째 답 (최대 8개)' },
  ] },
  { group: '갤러리', items: [
    { key: 'gallery', label: '커플 일러스트 모음', type: 'images', max: 8, hint: '최대 8장' },
  ] },
  { group: '안내와 링크', items: [
    { key: 'owner', label: '제작자', type: 'text' },
    { key: 'notice', label: '사용 안내', type: 'textarea', rows: 3 },
    { key: 'links', label: '링크', type: 'textarea', rows: 3, hint: '한 줄에 하나: 이름 | 주소' },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', '배경'], ['card', '카드'], ['fg', '글자']] },
    { type: 'colors', keys: [['accent', '포인트'], ['accent2', '보조 포인트']] },
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: koOptions(['gowunbatang', 'jua', 'blackhan', 'nanumpen', 'galmuri', 'pretendard']) },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: koOptions(['pretendard', 'gowundodum', 'gowunbatang', 'galmurimono']) },
  ] },
]

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cfg.date || '');
  var count = document.getElementById('dday'), next = document.getElementById('dnext');
  if (!m || !count) return;
  var y = +m[1], mo = +m[2] - 1, d = +m[3], DAY = 86400000;
  var start = new Date(y, mo, d), now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var n = Math.round((today - start) / DAY) + 1;
  if (n < 1) { count.textContent = 'D-' + (1 - n); if (next) next.textContent = ''; return; }
  count.textContent = 'D+' + n;
  var cand = [], k = Math.floor(n / 100) + 1;
  cand.push({ label: k * 100 + '일', date: new Date(y, mo, d + k * 100 - 1) });
  var yy = today.getFullYear(), ann = new Date(yy, mo, d);
  if (ann < today) { yy++; ann = new Date(yy, mo, d); }
  if (yy > y) cand.push({ label: (yy - y) + '주년', date: ann });
  cand.sort(function (a, b) { return a.date - b.date; });
  var c = cand[0], left = Math.round((c.date - today) / DAY);
  if (next) next.textContent = '다음 기념일 · ' + c.label + (left === 0 ? ' 오늘이에요' : ' · ' + left + '일 남음');
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const bg = hex(c.bg, '#fff3f0'), card = hex(c.card, '#ffffff'), fg = hex(c.fg, '#3a2226')
  const accent = hex(c.accent, '#e5566d'), accent2 = hex(c.accent2, '#ffd5cf')
  const date = ymd(c.date)
  const tl = lines(c.timeline, 12).map(cols)
  const qa = lines(c.qa, 8).map(cols)
  const links = lines(c.links, 8).map(cols)
  const gallery = imgs(c.gallery, 8)
  const imgA = imgSrc(c.imageA), imgB = imgSrc(c.imageB)
  const person = (cls, name, info, img) => `<article class="who ${cls}"><div class="av">${img ? `<img src="${img}" alt="${esc(name)} 일러스트">` : `<span aria-hidden="true">${esc(initial(name))}</span>`}</div><h2>${esc(name)}</h2><p>${esc(info)}</p></article>`
  const cfg = jsonForScript({ date })
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.title)} — 커플 아카이브</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, '')}
<style>
:root{--bg:${bg};--card:${card};--fg:${fg};--accent:${accent};--accent2:${accent2};--display:${koStack(c.displayFont)};--body:${koStack(c.bodyFont)};--dim:color-mix(in srgb,var(--fg) 62%,var(--bg));--line:color-mix(in srgb,var(--fg) 14%,var(--bg))}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 16px/1.75 var(--body);overflow-x:hidden;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.page{max-width:1000px;margin:0 auto;padding:clamp(24px,5vw,64px) clamp(16px,4vw,32px)}
header{text-align:center;margin-bottom:clamp(28px,5vw,56px)}
header h1{margin:0;font:700 clamp(38px,7vw,84px)/1.05 var(--display);letter-spacing:-.02em}
header p{margin:10px 0 0;color:var(--dim);font-size:clamp(15px,1.8vw,19px)}
.pair{display:grid;grid-template-columns:1fr auto 1fr;gap:clamp(12px,3vw,32px);align-items:center;margin-bottom:clamp(32px,5vw,64px)}
.who{background:var(--card);border:1.5px solid var(--line);border-radius:28px;padding:18px 18px 22px;text-align:center;box-shadow:6px 6px 0 var(--accent2)}
.who+.mid+.who{box-shadow:-6px 6px 0 var(--accent2)}
.av{width:min(100%,220px);aspect-ratio:1;margin:0 auto 14px;border-radius:50%;overflow:hidden;background:var(--accent2);position:relative;border:4px solid var(--card);outline:2px solid var(--accent)}
.av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.av span{position:absolute;inset:0;display:grid;place-items:center;font:700 80px/1 var(--display);color:var(--accent)}
.who h2{margin:0;font:700 clamp(22px,3vw,30px) var(--display)}
.who p{margin:4px 0 0;color:var(--dim);font-size:14.5px}
.mid{text-align:center;min-width:140px}
.heart{width:44px;height:40px;margin:0 auto 10px;background:var(--accent);clip-path:path('M22 40C-14 14 6 -8 22 8C38 -8 58 14 22 40Z');position:relative}
.cnt{font:800 clamp(34px,5vw,56px)/1 var(--display);color:var(--accent);letter-spacing:-.02em}
.mid small{display:block;margin-top:6px;color:var(--dim);font-size:13px}
.mid .next{display:block;margin-top:2px;font-size:12.5px;font-weight:600;color:var(--fg)}
section{margin-bottom:clamp(32px,5vw,64px)}
h3{margin:0 0 18px;font:700 clamp(22px,2.8vw,30px)/1.2 var(--display);text-align:center}
.story{max-width:62ch;margin:0 auto;text-align:center;color:var(--dim)}
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px}
.q{position:relative;background:var(--card);border:1.5px solid var(--line);border-radius:22px;padding:18px 22px}
.q b{display:block;font-size:13px;color:var(--accent);margin-bottom:4px}
.q p{margin:0;font-size:16.5px}
.tl{list-style:none;margin:0 auto;padding:0;max-width:720px;position:relative}
.tl::before{content:"";position:absolute;left:11px;top:6px;bottom:6px;width:2px;background:var(--line)}
.tl li{position:relative;padding:0 0 22px 40px}
.tl li::before{content:"";position:absolute;left:3px;top:6px;width:18px;height:18px;border-radius:50%;background:var(--accent);border:4px solid var(--bg)}
.tl time{font-size:13px;font-weight:700;color:var(--accent)}
.tl b{display:block;font-size:18px}
.tl p{margin:2px 0 0;color:var(--dim);font-size:15px}
.qa{width:100%;border-collapse:separate;border-spacing:0 8px;font-size:15px}
.qa th,.qa td{padding:12px 16px;background:var(--card);text-align:center}
.qa th:first-child,.qa td:first-child{border-radius:14px 0 0 14px;text-align:left;color:var(--dim);font-weight:600}
.qa th:last-child,.qa td:last-child{border-radius:0 14px 14px 0}
.qa thead th{background:none;color:var(--accent);font-size:14px}
.gal{columns:3 200px;column-gap:12px}
.gal figure{margin:0 0 12px;break-inside:avoid;border-radius:18px;overflow:hidden;border:1px solid var(--line)}
.gal img{display:block;width:100%;height:auto}
.notice{max-width:62ch;margin:0 auto;border:1.5px dashed var(--accent);border-radius:18px;padding:14px 20px;font-size:14.5px;text-align:center}
.links{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;list-style:none;margin:18px 0 0;padding:0}
.links a{display:inline-block;padding:7px 16px;border-radius:99px;background:var(--fg);color:var(--bg);font-size:13.5px;font-weight:600;text-decoration:none}
footer{text-align:center;color:var(--dim);font-size:13px;padding-top:8px}
@media(max-width:720px){.pair{grid-template-columns:1fr 1fr}.mid{grid-column:1/-1;grid-row:1}.who+.mid+.who{box-shadow:6px 6px 0 var(--accent2)}.qa th:first-child,.qa td:first-child{width:34%}}
</style>
</head>
<body>
<div class="page">
  <header><h1>${esc(c.title)}</h1>${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ''}</header>
  <div class="pair">
    ${person('a', c.nameA, c.infoA, imgA)}
    <div class="mid"><div class="heart" aria-hidden="true"></div>${date ? `<div class="cnt" id="dday">D+--</div><small>${esc(c.dateLabel)}</small><span class="next" id="dnext"></span>` : ''}</div>
    ${person('b', c.nameB, c.infoB, imgB)}
  </div>
  ${c.story ? `<section><p class="story">${multi(c.story)}</p></section>` : ''}
  ${c.quoteA || c.quoteB ? `<section><h3>서로에게 한마디</h3><div class="quotes">${c.quoteA ? `<div class="q"><b>${esc(c.nameA)} → ${esc(c.nameB)}</b><p>${esc(c.quoteA)}</p></div>` : ''}${c.quoteB ? `<div class="q"><b>${esc(c.nameB)} → ${esc(c.nameA)}</b><p>${esc(c.quoteB)}</p></div>` : ''}</div></section>` : ''}
  ${tl.length ? `<section id="timeline"><h3>타임라인</h3><ol class="tl">${tl.map(([d, t, x]) => `<li><time>${esc(d)}</time><b>${esc(t || '')}</b>${x ? `<p>${esc(x)}</p>` : ''}</li>`).join('')}</ol></section>` : ''}
  ${qa.length ? `<section id="qa"><h3>취향 문답</h3><table class="qa"><thead><tr><th></th><th>${esc(c.nameA)}</th><th>${esc(c.nameB)}</th></tr></thead><tbody>${qa.map(([q, a, b]) => `<tr><td>${esc(q)}</td><td>${esc(a || '')}</td><td>${esc(b || '')}</td></tr>`).join('')}</tbody></table></section>` : ''}
  ${gallery.length ? `<section id="gallery"><h3>갤러리</h3><div class="gal">${gallery.map((g, i) => `<figure><img src="${g}" alt="${esc(c.title)} 일러스트 ${i + 1}"></figure>`).join('')}</div></section>` : ''}
  ${c.notice ? `<section><div class="notice">${multi(c.notice)}</div>${links.length ? `<ul class="links">${links.map(([l, u]) => `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>` : ''}</section>` : ''}
  <footer>${c.owner ? `© ${esc(c.owner)} · ` : ''}${esc(c.title)}</footer>
</div>
<script type="application/json" id="cfg">${cfg}</script>
<script>${RUNTIME}</script>
</body>
</html>
`
}

export default {
  id: 'couple',
  group: '덕질',
  name: '자캐 커플 아카이브',
  blurb: '두 캐릭터, D+ 카운터, 타임라인, 취향 문답, 갤러리를 모아 두는 보관함.',
  tag: '자캐 커플',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.displayFont, x.bodyFont] },
}
