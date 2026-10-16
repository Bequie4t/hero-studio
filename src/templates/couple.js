import { cols, esc, hex, imgSrc, jsonForScript, lines, multi, ymd } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, noticeHtml, paletteColors, phHtml, shell, styleGroup } from './kobase.js'

// Template: 자캐 커플 아카이브 — two characters with their own colours, a D+ counter with progress to the next
// milestone, an automatic anniversary list, timeline, Q&A and gallery.
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
  colorA: '#e5566d',
  quoteA: '하윤이 옆에 있으면 길을 잃어도 괜찮아.',
  nameB: '정하윤',
  infoB: '천문대 정비사 · 6월 21일생',
  imageB: '',
  colorB: '#4a8df0',
  quoteB: '서하가 올려다보는 하늘을 같이 보고 싶었어.',
  story: '같은 천문대에서 일하던 두 사람은 별똥별이 많이 떨어지던 밤에 처음으로 서로의 이름을 불렀어요. 이 페이지는 그날부터 지금까지의 이야기를 모아 두는 작은 보관함입니다.',
  timeline: '2025-03-14 | 첫 고백 | 별똥별이 쏟아지던 옥상에서.\n2025-05-02 | 첫 여행 | 길치 서하가 처음으로 지도를 하윤에게 맡긴 날.\n2025-09-20 | 같이 살기 시작 | 천문대 숙소를 나와 작은 집으로.\n2026-03-14 | 1주년 | 처음 만난 옥상에서 다시 별을 봤어요.',
  qa: '좋아하는 계절 | 겨울 | 여름\n아침형 / 저녁형 | 새벽형 | 저녁형\n제일 좋아하는 음식 | 따뜻한 홍차 | 서하가 끓여 주는 죽\n서로의 첫인상 | 조용한 사람 | 자꾸 길을 잃는 사람',
  gallery: [],
  owner: '제작자 닉네임',
  notice: '두 캐릭터는 제작자의 오리지널 캐릭터(자캐)입니다. 무단 도용과 AI 학습 사용을 금지합니다.',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/',
  ...paletteColors(PALETTES[0]),
  displayFont: 'gowunbatang',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '커플 정보', open: true, items: [
    { key: 'title', label: '커플 이름', type: 'text', hint: '예: 서하 × 하윤' },
    { key: 'subtitle', label: '한 줄 소개', type: 'text' },
    { key: 'date', label: '기념일 기준일', type: 'date', hint: '이 날이 D+1일이에요. 100일 단위와 주년 기념일이 자동으로 계산돼요. 비우면 카운터를 숨겨요.' },
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
    { key: 'gallery', label: '커플 일러스트 모음', type: 'images', max: 8, hint: '최대 8장. 방문자가 누르면 크게 볼 수 있어요.' },
  ] },
  footerGroup,
  (() => { const g = styleGroup(); g.items.splice(3, 0, { type: 'colors', keys: [['colorA', '첫 번째 캐릭터 색'], ['colorB', '두 번째 캐릭터 색']] }); return g })(),
]

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cfg.date || '');
  var count = document.getElementById('dday');
  if (!m || !count) return;
  var y = +m[1], mo = +m[2] - 1, d = +m[3], DAY = 86400000;
  var start = new Date(y, mo, d), now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var n = Math.round((today - start) / DAY) + 1;
  var next = document.getElementById('dnext'), bar = document.getElementById('dprog'), list = document.getElementById('anni');
  if (n < 1) { count.textContent = 'D-' + (1 - n); return; }
  count.textContent = 'D+' + n;

  var items = [];
  [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000].forEach(function (k) { items.push({ label: k + '일', date: new Date(y, mo, d + k - 1) }); });
  for (var i = 1; i <= 10; i++) items.push({ label: i + '주년', date: new Date(y + i, mo, d) });
  items.sort(function (a, b) { return a.date - b.date; });
  var up = items.filter(function (x) { return x.date >= today; });
  var past = items.filter(function (x) { return x.date < today; });
  function fmt(t) { return t.getFullYear() + '.' + String(t.getMonth() + 1).padStart(2, '0') + '.' + String(t.getDate()).padStart(2, '0'); }

  if (up[0]) {
    var left = Math.round((up[0].date - today) / DAY);
    if (next) next.textContent = '다음 기념일 · ' + up[0].label + (left === 0 ? ' 오늘이에요' : ' · ' + left + '일 남음');
    var prev = past.length ? past[past.length - 1].date : start;
    if (bar) bar.style.width = Math.max(4, Math.min(100, ((today - prev) / (up[0].date - prev)) * 100)) + '%';
  }
  if (list) {
    var rows = past.slice(-2).map(function (x) { return { x: x, done: true }; }).concat(up.slice(0, 6).map(function (x) { return { x: x, done: false }; }));
    rows.forEach(function (r) {
      var li = document.createElement('li');
      if (r.done) li.className = 'done';
      var left2 = Math.round((r.x.date - today) / DAY);
      var a = document.createElement('b'); a.textContent = r.x.label;
      var t = document.createElement('time'); t.textContent = fmt(r.x.date);
      var s = document.createElement('span'); s.textContent = r.done ? '지났어요' : left2 === 0 ? '오늘!' : 'D-' + left2;
      li.appendChild(a); li.appendChild(t); li.appendChild(s); list.appendChild(li);
    });
    document.getElementById('annisec').hidden = false;
  }
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const colA = hex(c.colorA, '#e5566d'), colB = hex(c.colorB, '#4a8df0')
  const date = ymd(c.date)
  const tl = lines(c.timeline, 12).map(cols)
  const qa = lines(c.qa, 8).map(cols)
  const imgA = imgSrc(c.imageA), imgB = imgSrc(c.imageB)
  const person = (cls, name, info, img) => `<article class="who ${cls}"><div class="av">${img ? `<img src="${img}" alt="${esc(name)} 일러스트">` : phHtml(name)}</div><h2>${esc(name)}</h2><p>${esc(info)}</p></article>`
  const cfg = jsonForScript({ date })
  const css = `
.who.a{--pc:${colA}}.who.b{--pc:${colB}}
.page{max-width:1000px;margin:0 auto;padding:clamp(24px,5vw,64px) clamp(16px,4vw,32px)}
header{text-align:center;margin-bottom:clamp(28px,5vw,56px)}
header h1{margin:0;font:700 clamp(38px,7vw,84px)/1.05 var(--display);letter-spacing:-.02em}
header p{margin:10px 0 0;color:var(--dim);font-size:clamp(15px,1.8vw,19px)}
.pair{display:grid;grid-template-columns:1fr auto 1fr;gap:clamp(12px,3vw,32px);align-items:center;margin-bottom:clamp(32px,5vw,64px)}
.who{background:var(--card);border:1.5px solid var(--line);border-top:6px solid var(--pc);border-radius:28px;padding:18px 18px 24px;text-align:center;box-shadow:6px 6px 0 color-mix(in srgb,var(--pc) 30%,transparent)}
.who.b{box-shadow:-6px 6px 0 color-mix(in srgb,var(--pc) 30%,transparent)}
.av{width:min(100%,220px);aspect-ratio:1;margin:0 auto 14px;border-radius:50%;overflow:hidden;position:relative;border:4px solid var(--card);outline:3px solid var(--pc)}
.av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.av .ph b{font-size:84px}
.who h2{margin:0;font:700 clamp(22px,3vw,30px) var(--display);color:var(--pc)}
.who p{margin:4px 0 0;color:var(--dim);font-size:14.5px}
.mid{text-align:center;min-width:150px}
.heart{width:44px;height:40px;margin:0 auto 10px;background:linear-gradient(90deg,${colA},${colB});clip-path:path('M22 40C-14 14 6 -8 22 8C38 -8 58 14 22 40Z')}
.cnt{font:800 clamp(34px,5vw,56px)/1 var(--display);letter-spacing:-.02em}
.mid small{display:block;margin-top:6px;color:var(--dim);font-size:13px}
.prog{height:10px;margin:12px auto 6px;max-width:150px;border-radius:99px;background:color-mix(in srgb,var(--fg) 12%,var(--card));overflow:hidden}
.prog i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,${colA},${colB});transition:width .8s ease}
.mid .next{display:block;font-size:12.5px;font-weight:700}
.sec{margin-top:clamp(32px,5vw,64px)}
.sec h2{text-align:center;margin:0 0 20px;font:700 clamp(22px,2.8vw,30px)/1.2 var(--display)}
.story{max-width:62ch;margin:0 auto;text-align:center;color:var(--dim)}
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px}
.q{position:relative;background:var(--card);border:1.5px solid var(--line);border-radius:22px;padding:18px 22px}
.q:nth-child(1){border-left:6px solid ${colA}}.q:nth-child(2){border-right:6px solid ${colB};text-align:right}
.q b{display:block;font-size:13px;color:var(--dim);margin-bottom:4px}
.q p{margin:0;font-size:16.5px}
.anni{list-style:none;margin:0 auto;padding:0;max-width:640px;display:grid;gap:8px}
.anni li{display:grid;grid-template-columns:5em 1fr auto;gap:14px;align-items:center;padding:10px 18px;background:var(--card);border:1px solid var(--line);border-radius:16px}
.anni b{font:700 17px var(--display)}
.anni time{color:var(--dim);font-size:14px}
.anni span{font-size:12.5px;font-weight:800;padding:2px 12px;border-radius:99px;background:var(--accent2);color:var(--fg)}
.anni li.done{opacity:.55}.anni li.done span{background:none;border:1.5px solid var(--line)}
.tl{list-style:none;margin:0 auto;padding:0;max-width:720px;position:relative}
.tl::before{content:"";position:absolute;left:11px;top:6px;bottom:6px;width:3px;border-radius:2px;background:linear-gradient(${colA},${colB})}
.tl li{position:relative;padding:0 0 22px 40px}
.tl li::before{content:"";position:absolute;left:3px;top:6px;width:18px;height:18px;border-radius:50%;background:var(--accent);border:4px solid var(--bg)}
.tl time{font-size:13px;font-weight:700;color:var(--accent)}
.tl b{display:block;font-size:18px}
.tl p{margin:2px 0 0;color:var(--dim);font-size:15px}
.qa{width:100%;border-collapse:separate;border-spacing:0 8px;font-size:15px}
.qa th,.qa td{padding:12px 16px;background:var(--card);text-align:center}
.qa th:first-child,.qa td:first-child{border-radius:14px 0 0 14px;text-align:left;color:var(--dim);font-weight:600}
.qa th:last-child,.qa td:last-child{border-radius:0 14px 14px 0}
.qa thead th{background:none;font-size:14px}
.qa thead th:nth-child(2){color:${colA}}.qa thead th:nth-child(3){color:${colB}}
@media(max-width:720px){.pair{grid-template-columns:1fr 1fr}.mid{grid-column:1/-1;grid-row:1}.who.b{box-shadow:6px 6px 0 color-mix(in srgb,var(--pc) 30%,transparent)}.qa th:first-child,.qa td:first-child{width:34%}.anni li{grid-template-columns:4em 1fr auto;gap:8px;padding:10px 12px}}
`
  const body = `<div class="page">
  <header><h1>${esc(c.title)}</h1>${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ''}</header>
  <div class="pair">
    ${person('a', c.nameA, c.infoA, imgA)}
    <div class="mid"><div class="heart" aria-hidden="true"></div>${date ? `<div class="cnt" id="dday">D+--</div><small>${esc(c.dateLabel)}</small><div class="prog" aria-hidden="true"><i id="dprog"></i></div><span class="next" id="dnext"></span>` : ''}</div>
    ${person('b', c.nameB, c.infoB, imgB)}
  </div>
  ${c.story ? `<section><p class="story">${multi(c.story)}</p></section>` : ''}
  ${c.quoteA || c.quoteB ? `<section class="sec"><h2>서로에게 한마디</h2><div class="quotes">${c.quoteA ? `<div class="q"><b>${esc(c.nameA)} → ${esc(c.nameB)}</b><p>${esc(c.quoteA)}</p></div>` : ''}${c.quoteB ? `<div class="q"><b>${esc(c.nameB)} → ${esc(c.nameA)}</b><p>${esc(c.quoteB)}</p></div>` : ''}</div></section>` : ''}
  ${date ? '<section class="sec" id="annisec" hidden><h2>기념일</h2><ol class="anni" id="anni"></ol></section>' : ''}
  ${tl.length ? `<section class="sec" id="timeline"><h2>타임라인</h2><ol class="tl">${tl.map(([d, t, x]) => `<li><time>${esc(d)}</time><b>${esc(t || '')}</b>${x ? `<p>${esc(x)}</p>` : ''}</li>`).join('')}</ol></section>` : ''}
  ${qa.length ? `<section class="sec" id="qa"><h2>취향 문답</h2><table class="qa"><thead><tr><th></th><th>${esc(c.nameA)}</th><th>${esc(c.nameB)}</th></tr></thead><tbody>${qa.map(([q, a, b]) => `<tr><td>${esc(q)}</td><td>${esc(a || '')}</td><td>${esc(b || '')}</td></tr>`).join('')}</tbody></table></section>` : ''}
  ${galleryHtml(c.gallery, `${c.title} 일러스트`)}
  ${noticeHtml(c)}
  ${footerHtml(c, c.title)}
</div>`
  return shell({ c, d: PALETTES[0], title: `${c.title} — 커플 아카이브`, desc: c.subtitle, fontCss, css, body, script: date ? RUNTIME : '', cfg: date ? cfg : '' })
}

export default {
  id: 'couple',
  group: '덕질',
  name: '자캐 커플 아카이브',
  blurb: '두 캐릭터의 색, D+ 카운터, 자동 기념일 목록, 타임라인, 취향 문답, 갤러리를 모아 두는 보관함.',
  tag: '자캐 커플',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: fontsOf(defaults),
}
