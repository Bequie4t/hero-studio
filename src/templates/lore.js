import { cols, esc, initial, lines, multi } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, noticeHtml, paletteColors, shell, styleGroup } from './kobase.js'
import { fxDefaults, fxGroup, fxOf } from './fx.js'

// Template: 세계관 연표 — era headers ("# "), timeline events with tags (filterable), factions and a glossary.
const PALETTES = [
  { id: 'starlit', label: '별빛 남색', bg: '#0c1330', card: '#162049', fg: '#e8ecff', accent: '#ffd479', accent2: '#3a4a9a', fxStars: true, fxGrain: true, fxVignette: true, skin: 'line' },
  { id: 'parchment', label: '고서 양피지', bg: '#f1e7d0', card: '#faf3e0', fg: '#34281a', accent: '#8c4a1f', accent2: '#d9b36a' },
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
  ...fxDefaults,
  ...fxOf(PALETTES[0]),
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
  fxGroup,
]

const RUNTIME = String.raw`
(function () {
  var bar = document.getElementById('tags'), q = document.getElementById('q');
  var items = [].slice.call(document.querySelectorAll('.ev')), tag = '';
  function run() {
    var t = ((q && q.value) || '').trim().toLowerCase();
    items.forEach(function (li) {
      li.hidden = !((tag === '' || li.getAttribute('data-tag') === tag) && (!t || li.textContent.toLowerCase().indexOf(t) > -1));
    });
    [].forEach.call(document.querySelectorAll('.era'), function (e) { e.hidden = !e.querySelector('.ev:not([hidden])'); });
    var any = document.querySelector('.ev:not([hidden])');
    document.getElementById('none').hidden = !!any;
  }
  if (bar) bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    tag = b.getAttribute('data-tag');
    bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    run();
  });
  if (q) q.addEventListener('input', run);
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
  const named = eras.filter((e) => e.name)
  const factions = lines(c.factions, 10).map(cols), gloss = lines(c.glossary, 20).map(cols)
  const css = `
header{text-align:center;margin-bottom:clamp(20px,4vw,40px)}
header h1{margin:0;font:700 clamp(34px,6vw,68px)/1.1 var(--display);letter-spacing:-.02em}
header p{margin:10px 0 0;color:var(--dim);font-size:clamp(15px,1.8vw,19px)}
.tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0 0 8px}
.tags button{font:inherit;font-size:14px;font-weight:700;padding:5px 16px;border-radius:99px;border:1.5px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.tags button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.eyebrow{display:inline-block;margin:0 0 10px;padding:4px 16px;border-radius:99px;border:1.5px solid var(--accent);color:var(--accent);font:800 12px/1.4 var(--body);letter-spacing:.3em}
.orn{display:flex;align-items:center;justify-content:center;gap:14px;margin:14px auto 4px;max-width:360px}
.orn i{flex:1;height:2px;background:linear-gradient(90deg,transparent,var(--accent))}.orn i:last-child{transform:scaleX(-1)}
.orn b{width:12px;height:12px;transform:rotate(45deg);background:var(--accent);box-shadow:0 0 0 4px var(--bg),0 0 0 6px var(--accent)}
.subt{margin:10px 0 0}
.meta{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:16px}
.meta span{font-size:13px;font-weight:700;padding:3px 14px;border-radius:99px;background:var(--card);border:1px solid var(--line)}
.tools{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0 0 6px;align-items:center}
.tools input{font:inherit;padding:7px 16px;border-radius:99px;border:1.5px solid var(--line);background:var(--card);color:var(--fg);width:min(100%,240px)}
.jump{position:sticky;top:0;z-index:5;display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:10px 0;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(6px)}
.jump a{font-size:13.5px;font-weight:700;padding:3px 14px;border-radius:99px;color:var(--fg);text-decoration:none;border:1px solid var(--line)}
.jump a:hover{background:var(--accent2)}
.era{scroll-margin-top:60px}
.era h2{position:relative;display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 16px;margin:0 0 20px;padding:16px 22px;border-radius:20px;background:linear-gradient(100deg,var(--accent),color-mix(in srgb,var(--accent) 55%,var(--accent2)));color:var(--bg);overflow:hidden}
.era h2::after{content:"";position:absolute;right:-30px;top:-30px;width:130px;height:130px;border-radius:50%;border:18px solid color-mix(in srgb,var(--bg) 14%,transparent)}
.era h2 .en{font:800 12px var(--body);letter-spacing:.25em;opacity:.8}
.era h2 .tt{font:800 clamp(24px,3.4vw,34px)/1.15 var(--display)}
.era h2 small{margin-left:auto;font:700 13px var(--body);opacity:.9;position:relative;z-index:1}
.tl{list-style:none;margin:0;padding:0;display:grid;gap:14px;position:relative}
.tl::before{content:"";position:absolute;left:calc(clamp(86px,16vw,140px) + 9px);top:8px;bottom:8px;width:2px;background:var(--line)}
.ev{position:relative;display:grid;grid-template-columns:clamp(86px,16vw,140px) 1fr;gap:0 28px;align-items:start;padding:0}
.ev>time{text-align:right;font:700 15px/1.3 var(--display);color:var(--accent);padding-top:16px}
.ev .bd{padding:14px 20px;position:relative}
.ev .bd::before{content:"";position:absolute;left:-26px;top:20px;width:14px;height:14px;border-radius:50%;background:var(--accent);border:3px solid var(--bg)}
.ev h3{margin:0;font:700 20px/1.3 var(--display)}
.ev p{margin:4px 0 0;color:var(--dim);font-size:15px}
.ev em{font-style:normal;font-size:12px;font-weight:700;padding:1px 10px;border-radius:99px;background:var(--accent2);color:var(--fg);margin-left:8px;vertical-align:middle}
.none{text-align:center;color:var(--dim)}
[hidden]{display:none!important}
@media(max-width:560px){.tl::before{display:none}.ev{grid-template-columns:1fr}.ev>time{text-align:left;padding:0 0 4px 4px}.ev .bd::before{display:none}}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px}
dl{margin:0;display:grid;gap:10px}
dl div.card{padding:12px 18px}
.fac{display:flex;gap:14px;align-items:center}
.fac i{flex:0 0 44px;height:44px;border-radius:50%;display:grid;place-items:center;font:800 19px var(--display);font-style:normal;background:var(--accent);color:var(--bg)}
.fac div{padding:0}
dt{font:700 17px var(--display)}
dd{margin:2px 0 0;color:var(--dim);font-size:15px}
`
  const body = `<div class="page">
  <header><p class="eyebrow">CHRONICLE</p><h1>${esc(c.name)}</h1><div class="orn" aria-hidden="true"><i></i><b></b><i></i></div>${c.subtitle ? `<p class="subt">${esc(c.subtitle)}</p>` : ''}${count ? `<div class="meta"><span>${named.length || 1}개 시대</span><span>${count}개 사건</span>${factions.length ? `<span>${factions.length}개 세력</span>` : ''}${gloss.length ? `<span>용어 ${gloss.length}</span>` : ''}</div>` : ''}</header>
  ${count > 3 ? `<div class="tools"><input id="q" type="search" placeholder="연표에서 찾기" aria-label="연표 검색">${tags.length ? `<span class="tags" id="tags" role="group" aria-label="분류별로 보기"><button type="button" data-tag="" aria-pressed="true">전체</button>${tags.map((t) => `<button type="button" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</span>` : ''}</div>` : ''}
  ${named.length > 1 ? `<nav class="jump" aria-label="시대로 이동">${named.map((e) => `<a href="#era${eras.indexOf(e)}">${esc(e.name)}</a>`).join('')}</nav>` : ''}
  ${eras.map((e, n) => `<section class="sec era" id="era${n}">${e.name ? `<h2><span class="en">ERA ${String(n + 1).padStart(2, '0')}</span><span class="tt">${esc(e.name)}</span>${e.items.length ? `<small>${esc(e.items[0].when || '')}${e.items.length > 1 ? ` → ${esc(e.items[e.items.length - 1].when || '')}` : ''}</small>` : ''}</h2>` : ''}<ol class="tl">${e.items.map((i) => `<li class="ev" data-tag="${esc(i.tag)}"><time>${esc(i.when || '')}</time><div class="bd card"><h3>${esc(i.title || '')}${i.tag ? `<em>${esc(i.tag)}</em>` : ''}</h3>${i.desc ? `<p>${multi(i.desc)}</p>` : ''}</div></li>`).join('')}</ol></section>`).join('')}
  <p class="none" id="none" hidden>찾는 항목이 없어요.</p>
  ${factions.length || gloss.length ? `<section class="sec two">${factions.length ? `<div id="factions"><h2>주요 세력</h2><dl>${factions.map(([n, d]) => `<div class="card fac"><i aria-hidden="true">${esc(initial(n))}</i><div><dt>${esc(n)}</dt>${d ? `<dd>${esc(d)}</dd>` : ''}</div></div>`).join('')}</dl></div>` : ''}${gloss.length ? `<div id="glossary"><h2>용어집</h2><dl>${gloss.map(([n, d]) => `<div class="card"><dt>${esc(n)}</dt>${d ? `<dd>${esc(d)}</dd>` : ''}</div>`).join('')}</dl></div>` : ''}</section>` : ''}
  ${galleryHtml(c.gallery, c.name, '지도와 일러스트')}
  ${noticeHtml(c)}
  ${footerHtml(c, c.name)}
</div>`
  return shell({ c, d: PALETTES[0], title: `${c.name} — 세계관 연표`, desc: c.subtitle, fontCss, css, body, script: count > 3 ? RUNTIME : '' })
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
