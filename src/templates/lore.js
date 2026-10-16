import { cols, esc, lines, multi } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, noticeHtml, paletteColors, shell, styleGroup } from './kobase.js'

// Template: 세계관 연표 — era headers ("# "), timeline events with tags (filterable), factions and a glossary.
const PALETTES = [
  { id: 'parchment', label: '고서 양피지', bg: '#f1e7d0', card: '#faf3e0', fg: '#34281a', accent: '#8c4a1f', accent2: '#d9b36a' },
  { id: 'starlit', label: '별빛 남색', bg: '#0c1330', card: '#162049', fg: '#e8ecff', accent: '#ffd479', accent2: '#3a4a9a' },
  { id: 'moss', label: '이끼 숲', bg: '#eaf2e4', card: '#f7fbf3', fg: '#1f3220', accent: '#3f7d4a', accent2: '#bfdca8' },
  { id: 'seal', label: '먹과 붉은 인장', bg: '#f3f0ea', card: '#ffffff', fg: '#17171b', accent: '#c0302f', accent2: '#e2d6c3' },
]

const defaults = {
  name: '달무리 세계 연표',
  subtitle: '달이 두 개 뜨는 세계의 역사와 용어를 모아 두었어요.',
  events: '# 개척기\n건국 0년 | 쌍달의 밤 | 하늘에 두 번째 달이 떠오르며 마을의 터가 정해졌다. | 사건\n건국 12년 | 천문대 설립 | 별의 움직임을 기록하는 첫 천문대가 세워졌다. | 기관\n# 안정기\n건국 80년 | 별지기 서약 | 별지기들이 마을을 지키겠다는 서약문을 남겼다. | 인물\n건국 143년 | 큰 가뭄 | 호수가 마르며 이주민이 크게 늘었다. | 사건\n# 현재\n건국 210년 | 새벽 천문대의 재개관 | 낡은 천문대가 정비사 하윤의 손으로 다시 문을 열었다. | 기관',
  factions: '새벽 천문대 | 별의 움직임을 기록하는 관측 기관\n광장 상인회 | 마을 시장과 축제를 운영하는 모임\n호숫가 낚시꾼들 | 은퇴한 기사들이 모인 느슨한 모임',
  glossary: '쌍달 | 마을 하늘에 동시에 뜨는 두 개의 달\n별지기 | 별의 움직임을 기록하고 마을에 전하는 사람\n달무리 | 달 주위에 생기는 빛의 고리. 마을에서는 좋은 징조로 여겨요.',
  gallery: [],
  owner: '세계관 제작자',
  notice: '이 세계관과 설정은 제작자의 오리지널 창작물입니다. 허락 없는 2차 가공과 AI 학습 사용을 금지합니다.',
  links: '설정 위키 | https://www.postype.com/\n트위터(X) | https://twitter.com/',
  ...paletteColors(PALETTES[0]),
  displayFont: 'gowunbatang',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '세계관 정보', open: true, items: [
    { key: 'name', label: '세계관 이름', type: 'text' },
    { key: 'subtitle', label: '한 줄 소개', type: 'text' },
  ] },
  { group: '연표', open: true, items: [
    { key: 'events', label: '연표 항목', type: 'textarea', rows: 12, hint: '한 줄에 하나: 시기 | 제목 | 설명 | 분류. "# 시대 이름"으로 시작하는 줄은 시대 구분이에요. 분류가 같은 항목끼리 골라 볼 수 있어요. (최대 60개)' },
  ] },
  { group: '세력과 용어', items: [
    { key: 'factions', label: '주요 세력', type: 'textarea', rows: 4, hint: '한 줄에 하나: 이름 | 설명 (최대 10개)' },
    { key: 'glossary', label: '용어집', type: 'textarea', rows: 5, hint: '한 줄에 하나: 용어 | 설명 (최대 20개)' },
  ] },
  { group: '지도·일러스트', items: [
    { key: 'gallery', label: '이미지 모음', type: 'images', max: 8, hint: '지도나 설정 일러스트를 최대 8장까지.' },
  ] },
  footerGroup,
  styleGroup(),
]

const RUNTIME = String.raw`
(function () {
  var bar = document.getElementById('tags');
  if (!bar) return;
  var items = document.querySelectorAll('.ev');
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var tag = b.getAttribute('data-tag');
    bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    items.forEach(function (li) { li.hidden = tag !== '' && li.getAttribute('data-tag') !== tag; });
  });
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const eras = []
  let count = 0
  for (const line of lines(c.events, 80)) {
    if (line.startsWith('#')) { eras.push({ name: line.replace(/^#+\s*/, ''), items: [] }); continue }
    if (count >= 60) break
    if (!eras.length) eras.push({ name: '', items: [] })
    const [when, title, desc, tag] = cols(line)
    eras[eras.length - 1].items.push({ when, title, desc, tag: tag || '' })
    count++
  }
  const tags = [...new Set(eras.flatMap((e) => e.items.map((i) => i.tag)).filter(Boolean))]
  const factions = lines(c.factions, 10).map(cols), gloss = lines(c.glossary, 20).map(cols)
  const css = `
header{text-align:center;margin-bottom:clamp(20px,4vw,40px)}
header h1{margin:0;font:700 clamp(34px,6vw,68px)/1.1 var(--display);letter-spacing:-.02em}
header p{margin:10px 0 0;color:var(--dim);font-size:clamp(15px,1.8vw,19px)}
.tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0 0 8px}
.tags button{font:inherit;font-size:14px;font-weight:700;padding:5px 16px;border-radius:99px;border:1.5px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.tags button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.era h2{display:flex;align-items:center;gap:14px;font-size:clamp(22px,3vw,30px)}
.era h2::before{content:"";width:14px;height:14px;transform:rotate(45deg);background:var(--accent)}
.era h2::after{content:"";flex:1;height:2px;background:var(--line)}
.tl{list-style:none;margin:0;padding:0 0 0 22px;border-left:2px solid var(--line);display:grid;gap:14px}
.ev{position:relative;padding:14px 20px}
.ev::before{content:"";position:absolute;left:-30px;top:22px;width:14px;height:14px;border-radius:50%;background:var(--accent);border:3px solid var(--bg)}
.ev time{font-weight:800;color:var(--accent);font-size:14px}
.ev h3{margin:0;font:700 20px/1.3 var(--display)}
.ev p{margin:4px 0 0;color:var(--dim);font-size:15px}
.ev em{font-style:normal;font-size:12px;font-weight:700;padding:1px 10px;border-radius:99px;background:var(--accent2);color:var(--fg);margin-left:8px;vertical-align:middle}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px}
dl{margin:0;display:grid;gap:10px}
dl div{padding:12px 18px}
dt{font:700 17px var(--display)}
dd{margin:2px 0 0;color:var(--dim);font-size:15px}
`
  const body = `<div class="page">
  <header><h1>${esc(c.name)}</h1>${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ''}</header>
  ${tags.length ? `<div class="tags" id="tags" role="group" aria-label="분류별로 보기"><button type="button" data-tag="" aria-pressed="true">전체</button>${tags.map((t) => `<button type="button" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</div>` : ''}
  ${eras.map((e) => `<section class="sec era">${e.name ? `<h2>${esc(e.name)}</h2>` : ''}<ol class="tl">${e.items.map((i) => `<li class="ev card" data-tag="${esc(i.tag)}"><time>${esc(i.when || '')}</time>${i.tag ? `<em>${esc(i.tag)}</em>` : ''}<h3>${esc(i.title || '')}</h3>${i.desc ? `<p>${multi(i.desc)}</p>` : ''}</li>`).join('')}</ol></section>`).join('')}
  ${factions.length || gloss.length ? `<section class="sec two">${factions.length ? `<div id="factions"><h2>주요 세력</h2><dl>${factions.map(([n, d]) => `<div class="card"><dt>${esc(n)}</dt>${d ? `<dd>${esc(d)}</dd>` : ''}</div>`).join('')}</dl></div>` : ''}${gloss.length ? `<div id="glossary"><h2>용어집</h2><dl>${gloss.map(([n, d]) => `<div class="card"><dt>${esc(n)}</dt>${d ? `<dd>${esc(d)}</dd>` : ''}</div>`).join('')}</dl></div>` : ''}</section>` : ''}
  ${galleryHtml(c.gallery, c.name, '지도와 일러스트')}
  ${noticeHtml(c)}
  ${footerHtml(c, c.name)}
</div>`
  return shell({ c, d: PALETTES[0], title: `${c.name} — 세계관 연표`, desc: c.subtitle, fontCss, css, body, script: tags.length ? RUNTIME : '' })
}

export default {
  id: 'lore',
  group: '덕질',
  name: '세계관 연표',
  blurb: '시대별 연표, 분류 필터, 주요 세력, 용어집, 지도 이미지까지 담는 세계관 정리 페이지.',
  tag: '세계관',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: fontsOf(defaults),
}
