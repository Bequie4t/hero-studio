import { cols, esc, initial, imgSrc, lines, multi } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, noticeHtml, paletteColors, shell, styleGroup } from './kobase.js'

// Template: 캐릭터 도감 — many characters in one place, grouped by faction (lines starting with "# ").
const PALETTES = [
  { id: 'cream', label: '도감 크림', bg: '#f6efe3', card: '#fffaf1', fg: '#33281c', accent: '#b4532a', accent2: '#e9c46a' },
  { id: 'deep', label: '심해 청록', bg: '#0b1c22', card: '#12303a', fg: '#e3f4f4', accent: '#4fd1c5', accent2: '#2b6f7a' },
  { id: 'sunset', label: '석양', bg: '#fff1ea', card: '#ffffff', fg: '#3b1f1a', accent: '#ff7a59', accent2: '#ffd1bf' },
  { id: 'obsidian', label: '흑요석', bg: '#101014', card: '#1b1b22', fg: '#eeeaf4', accent: '#c9a3ff', accent2: '#47346b' },
]

const defaults = {
  title: '달무리 마을 주민 도감',
  subtitle: '마을에 사는 사람들을 한곳에 모아 두었어요.',
  chars: '# 새벽 천문대\n이서하 | 새벽빛을 닮은 별지기 | 별지기/다정함/길치 | 천문대에서 별의 움직임을 기록하는 관측 기사. 말수가 적지만 한번 마음을 연 사람에게는 끝까지 다정해요.\n정하윤 | 천문대의 정비사 | 정비사/수다쟁이/손재주 | 망원경과 시계를 고치는 솜씨 좋은 정비사. 서하의 길치를 가장 잘 아는 사람이에요.\n# 마을 광장\n미소 | 광장 모퉁이 빵집 주인 | 빵집/아침형/요리 | 새벽 네 시에 일어나 마을의 첫 빵을 굽는 사람.\n도겸 | 은퇴한 관측 기사 | 은퇴/스승/낚시 | 서하에게 관측법을 가르쳐 준 노기사. 요즘은 호숫가에서 낚시를 해요.',
  portraits: [],
  owner: '제작자 닉네임',
  notice: '이 도감의 캐릭터는 모두 제작자의 오리지널 캐릭터(자캐)입니다. 무단 도용과 AI 학습 사용을 금지합니다.',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/',
  ...paletteColors(PALETTES[0]),
  displayFont: 'gowunbatang',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '도감 정보', open: true, items: [
    { key: 'title', label: '도감 제목', type: 'text' },
    { key: 'subtitle', label: '한 줄 소개', type: 'text' },
  ] },
  { group: '캐릭터', open: true, items: [
    { key: 'chars', label: '캐릭터 목록', type: 'textarea', rows: 12, hint: '한 줄에 한 명: 이름 | 한 줄 소개 | 키워드(/로 구분) | 자세한 설명. "# 소속 이름"으로 시작하는 줄은 묶음 제목이에요. (최대 40명)' },
    { key: 'portraits', label: '캐릭터 일러스트', type: 'images', max: 12, hint: '위에서부터 순서대로 캐릭터에게 붙어요. 최대 12장.' },
  ] },
  footerGroup,
  styleGroup(),
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const pics = (Array.isArray(c.portraits) ? c.portraits : []).map(imgSrc)
  let n = 0, total = 0
  const groups = []
  for (const line of lines(c.chars, 60)) {
    if (line.startsWith('#')) { groups.push({ name: line.replace(/^#+\s*/, ''), items: [] }); continue }
    if (total >= 40) break
    if (!groups.length) groups.push({ name: '', items: [] })
    const [name, tag, kw, desc] = cols(line)
    groups[groups.length - 1].items.push({ name, tag, kw: (kw || '').split('/').map((s) => s.trim()).filter(Boolean), desc, img: pics[n++] || '' })
    total++
  }
  const card = (p) => `<article class="char card"><div class="pic">${p.img ? `<img src="${p.img}" alt="${esc(p.name)} 일러스트">` : `<span aria-hidden="true">${esc(initial(p.name))}</span>`}</div><div class="in"><h3>${esc(p.name)}</h3>${p.tag ? `<p class="tag">${esc(p.tag)}</p>` : ''}${p.kw.length ? `<ul class="chips">${p.kw.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}${p.desc ? `<details><summary>자세히 보기</summary><p>${multi(p.desc)}</p></details>` : ''}</div></article>`
  const css = `
header{text-align:center;margin-bottom:clamp(20px,4vw,40px)}
header h1{margin:0;font:700 clamp(34px,6vw,68px)/1.1 var(--display);letter-spacing:-.02em}
header p{margin:10px 0 0;color:var(--dim);font-size:clamp(15px,1.8vw,19px)}
header small{display:inline-block;margin-top:12px;padding:2px 14px;border-radius:99px;background:var(--accent);color:var(--bg);font-weight:800;font-size:13px}
.grp h2{display:flex;align-items:center;gap:12px}
.grp h2::after{content:"";flex:1;height:2px;background:var(--line)}
.dex{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:16px}
.char{overflow:hidden;display:flex;flex-direction:column}
.pic{aspect-ratio:4/5;background:var(--accent2);position:relative}
.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pic span{position:absolute;inset:0;display:grid;place-items:center;font:700 72px/1 var(--display);color:var(--accent)}
.in{padding:14px 18px 16px;display:flex;flex-direction:column;gap:8px}
.in h3{margin:0;font:700 22px/1.2 var(--display)}
.tag{margin:0;color:var(--accent);font-weight:700;font-size:14px}
.in details{border:0;padding:0}
.in summary{font-size:13.5px;color:var(--dim);justify-content:flex-start;gap:6px}
.in details p{font-size:14.5px}
`
  const body = `<div class="page">
  <header><h1>${esc(c.title)}</h1>${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ''}<small>등록 ${total}명</small></header>
  ${groups.map((g) => `<section class="sec grp">${g.name ? `<h2>${esc(g.name)}</h2>` : ''}<div class="dex">${g.items.map(card).join('')}</div></section>`).join('')}
  ${noticeHtml(c)}
  ${footerHtml(c, c.title)}
</div>`
  return shell({ c, d: PALETTES[0], title: `${c.title}`, desc: c.subtitle, fontCss, css, body })
}

export default {
  id: 'dex',
  group: '덕질',
  name: '캐릭터 도감',
  blurb: '여러 캐릭터를 소속별로 묶어 한눈에 보여 주는 도감. 일러스트와 자세한 설명까지.',
  tag: '도감',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: fontsOf(defaults),
}
