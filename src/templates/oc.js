import { koOptions, koStack } from '../fonts/ko-registry.js'
import { cols, esc, fontHead, hex, imgSrc, imgs, initial, lines, list, multi, safeUrl } from './util.js'

// Template: 자캐 설정집 — a character profile sheet (portrait card, profile table, relations, gallery).
const PALETTES = [
  { id: 'sakura', label: '벚꽃 크림', bg: '#fff5f6', card: '#ffffff', fg: '#3b2a30', accent: '#e8648b', accent2: '#f7c6d3' },
  { id: 'dawn', label: '새벽 라벤더', bg: '#1b1830', card: '#26223f', fg: '#ece8ff', accent: '#a78bfa', accent2: '#4a3f8f' },
  { id: 'mint', label: '민트 소다', bg: '#effaf6', card: '#ffffff', fg: '#1f3a34', accent: '#2fb89a', accent2: '#bfeede' },
  { id: 'gothic', label: '고딕 블랙레드', bg: '#0e0b0c', card: '#1a1315', fg: '#f2e9e9', accent: '#d6354f', accent2: '#5b1823' },
]

const defaults = {
  name: '이서하',
  nameSub: 'Lee Seoha · 李曙河',
  tagline: '새벽빛을 닮은 별지기',
  portrait: '',
  info: '나이 | 24세 (외견)\n키 / 체중 | 178cm / 64kg\n생일 | 11월 3일\n종족 | 별지기 (인간형)\nMBTI | INFJ\n소속 | 새벽 천문대\n역할 | 관측 기사',
  keywords: '별지기, 새벽, 다정함, 길치, 홍차',
  story: '새벽 천문대에서 별의 움직임을 기록하는 관측 기사입니다. 말수가 적고 조용하지만, 한번 마음을 연 상대에게는 끝까지 다정한 사람이에요.\n\n길을 자주 잃어버리는 탓에 천문대 주변 지도는 전부 손으로 다시 그려 두었습니다.',
  likes: '새벽 공기, 홍차, 낡은 지도, 별자리 도감',
  dislikes: '소란스러운 곳, 정리 안 된 책상, 일찍 오는 비',
  relations: '정하윤 | 소꿉친구 | 천문대의 유일한 동료. 서로의 말버릇까지 알고 있어요.\n윤도겸 | 스승 | 관측법을 가르쳐 준 은퇴한 기사.',
  gallery: [],
  owner: '제작자 닉네임',
  notice: '이 캐릭터는 제작자의 오리지널 캐릭터(자캐)입니다. 2차 가공, 무단 도용, AI 학습 사용을 금지합니다. 교류와 커미션 문의는 환영해요.',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/\n디스코드 | https://discord.com/',
  bg: PALETTES[0].bg,
  card: PALETTES[0].card,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  accent2: PALETTES[0].accent2,
  displayFont: 'gowunbatang',
  bodyFont: 'pretendard',
  decor: true,
}

const fields = [
  { group: '캐릭터', open: true, items: [
    { key: 'name', label: '이름', type: 'text' },
    { key: 'nameSub', label: '영문·한자 표기', type: 'text' },
    { key: 'tagline', label: '한 줄 소개', type: 'text' },
    { key: 'portrait', label: '대표 일러스트', type: 'image', theme: true, hint: '브라우저에서 줄여서 파일 안에 넣어요. 서버로 올라가지 않습니다.' },
    { key: 'keywords', label: '키워드', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'story', label: '소개글', type: 'textarea', rows: 6, hint: '빈 줄로 문단을 나눠요.' },
  ] },
  { group: '프로필 표', open: true, items: [
    { key: 'info', label: '프로필 항목', type: 'textarea', rows: 8, hint: '한 줄에 하나: 항목 | 내용 (최대 14개)' },
    { key: 'likes', label: '좋아하는 것', type: 'text', hint: '쉼표로 구분' },
    { key: 'dislikes', label: '싫어하는 것', type: 'text', hint: '쉼표로 구분' },
  ] },
  { group: '관계', items: [
    { key: 'relations', label: '관계도', type: 'textarea', rows: 5, hint: '한 줄에 하나: 이름 | 관계 | 설명 (최대 6개)' },
  ] },
  { group: '갤러리', items: [
    { key: 'gallery', label: '일러스트 모음', type: 'images', max: 8, hint: '최대 8장' },
  ] },
  { group: '안내와 링크', items: [
    { key: 'owner', label: '제작자', type: 'text' },
    { key: 'notice', label: '사용 안내', type: 'textarea', rows: 3 },
    { key: 'links', label: '링크', type: 'textarea', rows: 4, hint: '한 줄에 하나: 이름 | 주소 (최대 8개)' },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', '배경'], ['card', '카드'], ['fg', '글자']] },
    { type: 'colors', keys: [['accent', '포인트'], ['accent2', '보조 포인트']] },
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: koOptions(['gowunbatang', 'jua', 'blackhan', 'nanumpen', 'galmuri', 'pretendard']) },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: koOptions(['pretendard', 'gowundodum', 'gowunbatang', 'galmurimono']) },
    { key: 'decor', label: '별 장식 넣기', type: 'check' },
  ] },
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const bg = hex(c.bg, '#fff5f6'), card = hex(c.card, '#ffffff'), fg = hex(c.fg, '#3b2a30')
  const accent = hex(c.accent, '#e8648b'), accent2 = hex(c.accent2, '#f7c6d3')
  const name = c.name || '이름'
  const portrait = imgSrc(c.portrait)
  const info = lines(c.info, 14).map(cols)
  const rel = lines(c.relations, 6).map(cols)
  const links = lines(c.links, 8).map(cols)
  const gallery = imgs(c.gallery, 8)
  const paras = String(c.story || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const likes = list(c.likes), dislikes = list(c.dislikes)
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — 캐릭터 설정집</title>
<meta name="description" content="${esc(c.tagline)}">
${fontHead(fontCss, '')}
<style>
:root{--bg:${bg};--card:${card};--fg:${fg};--accent:${accent};--accent2:${accent2};--display:${koStack(c.displayFont)};--body:${koStack(c.bodyFont)};--dim:color-mix(in srgb,var(--fg) 62%,var(--bg));--line:color-mix(in srgb,var(--fg) 14%,var(--bg))}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 16px/1.75 var(--body);overflow-x:hidden;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.star{position:fixed;width:26px;height:26px;background:var(--accent);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);opacity:.55;pointer-events:none;z-index:0}
.s1{top:7%;left:4%}.s2{top:22%;right:5%;width:18px;height:18px;background:var(--accent2);opacity:.9}.s3{bottom:12%;left:8%;width:14px;height:14px}
.wrap{position:relative;z-index:1;display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:clamp(24px,4vw,56px);max-width:1120px;margin:0 auto;padding:clamp(24px,5vw,64px) clamp(16px,4vw,32px)}
.profile{position:sticky;top:24px;align-self:start;background:var(--card);border:1.5px solid var(--line);border-radius:28px;padding:18px 18px 24px;box-shadow:8px 8px 0 var(--accent2)}
.pic{aspect-ratio:3/4;border-radius:20px 20px 120px 120px;overflow:hidden;background:var(--accent2);position:relative}
.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pic .ph{position:absolute;inset:0;display:grid;place-items:center;font:700 clamp(80px,12vw,130px)/1 var(--display);color:var(--accent);opacity:.85}
.profile h1{margin:20px 0 2px;font:700 clamp(30px,4vw,40px)/1.15 var(--display);letter-spacing:-.01em}
.sub{margin:0;color:var(--dim);font-size:14px}
.tagline{margin:12px 0 0;font-weight:600;color:var(--accent)}
.kw,.chips{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:16px 0 0;padding:0}
.kw li,.chips li{padding:3px 12px;border-radius:99px;background:color-mix(in srgb,var(--accent) 14%,var(--card));border:1px solid color-mix(in srgb,var(--accent) 35%,var(--card));font-size:13.5px}
.kw li::before{content:"#";opacity:.5;margin-right:2px}
.links{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:18px 0 0;padding:0}
.links a{display:inline-block;padding:7px 14px;border-radius:12px;background:var(--fg);color:var(--bg);font-size:13.5px;font-weight:600;text-decoration:none;transition:transform .15s}
.links a:hover{transform:translateY(-2px)}
main section{margin-bottom:clamp(28px,4vw,48px)}
h2{margin:0 0 14px;font:700 clamp(22px,2.6vw,28px)/1.2 var(--display);display:flex;align-items:center;gap:10px}
h2::before{content:"";width:12px;height:12px;background:var(--accent);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
.story p{margin:0 0 1em}
dl{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:10px}
dl div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:10px 16px}
dt{font-size:12.5px;color:var(--dim);font-weight:600}
dd{margin:0;font-weight:600}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px}
.box{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:16px 20px}
.box h3{margin:0 0 6px;font:700 17px var(--display)}
.box p{margin:0;color:var(--dim);font-size:15px}
.rel{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.rel li{background:var(--card);border:1px solid var(--line);border-left:6px solid var(--accent);border-radius:16px;padding:12px 18px}
.rel b{font-size:17px}
.rel span{margin-left:8px;font-size:13px;color:var(--accent);font-weight:700}
.rel p{margin:4px 0 0;color:var(--dim);font-size:15px}
.gal{columns:3 180px;column-gap:12px}
.gal figure{margin:0 0 12px;break-inside:avoid;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--card)}
.gal img{display:block;width:100%;height:auto}
.notice{background:color-mix(in srgb,var(--accent) 10%,var(--card));border:1.5px dashed var(--accent);border-radius:18px;padding:14px 20px;font-size:14.5px}
footer{position:relative;z-index:1;text-align:center;padding:8px 16px 40px;color:var(--dim);font-size:13px}
@media(max-width:820px){.wrap{grid-template-columns:1fr}.profile{position:static;max-width:420px;margin-inline:auto;width:100%}}
@media(prefers-reduced-motion:reduce){.links a{transition:none}}
</style>
</head>
<body>
${c.decor ? '<i class="star s1" aria-hidden="true"></i><i class="star s2" aria-hidden="true"></i><i class="star s3" aria-hidden="true"></i>' : ''}
<div class="wrap">
  <aside class="profile">
    <div class="pic">${portrait ? `<img src="${portrait}" alt="${esc(name)} 일러스트">` : `<div class="ph" aria-hidden="true">${esc(initial(name))}</div>`}</div>
    <h1>${esc(name)}</h1>
    ${c.nameSub ? `<p class="sub">${esc(c.nameSub)}</p>` : ''}
    ${c.tagline ? `<p class="tagline">${esc(c.tagline)}</p>` : ''}
    ${list(c.keywords).length ? `<ul class="kw">${list(c.keywords).map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
    ${links.length ? `<ul class="links">${links.map(([l, u]) => `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>` : ''}
  </aside>
  <main>
    ${paras.length ? `<section class="story" id="story"><h2>소개</h2>${paras.map((p) => `<p>${multi(p)}</p>`).join('')}</section>` : ''}
    ${info.length ? `<section id="profile"><h2>프로필</h2><dl>${info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v || '')}</dd></div>`).join('')}</dl></section>` : ''}
    ${likes.length || dislikes.length ? `<section id="taste"><h2>취향</h2><div class="two">${likes.length ? `<div class="box"><h3>좋아하는 것</h3><ul class="chips">${likes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}${dislikes.length ? `<div class="box"><h3>싫어하는 것</h3><ul class="chips">${dislikes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}</div></section>` : ''}
    ${rel.length ? `<section id="relations"><h2>관계</h2><ul class="rel">${rel.map(([n, r, d]) => `<li><b>${esc(n)}</b>${r ? `<span>${esc(r)}</span>` : ''}${d ? `<p>${esc(d)}</p>` : ''}</li>`).join('')}</ul></section>` : ''}
    ${gallery.length ? `<section id="gallery"><h2>갤러리</h2><div class="gal">${gallery.map((g, i) => `<figure><img src="${g}" alt="${esc(name)} 일러스트 ${i + 1}"></figure>`).join('')}</div></section>` : ''}
    ${c.notice ? `<section id="notice"><div class="notice">${multi(c.notice)}</div></section>` : ''}
  </main>
</div>
<footer>${c.owner ? `© ${esc(c.owner)} · ` : ''}${esc(name)}</footer>
</body>
</html>
`
}

export default {
  id: 'oc',
  group: '덕질',
  name: '자캐 설정집',
  blurb: '프로필 카드, 설정 표, 관계도, 일러스트 갤러리를 한 페이지에.',
  tag: '자캐',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.displayFont, x.bodyFont] },
}
