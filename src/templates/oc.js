import { cols, esc, hex, imgSrc, lines, list, multi, safeUrl } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, linksHtml, noticeHtml, paletteColors, phHtml, shell, styleGroup } from './kobase.js'
import { MOODS, fxDefaults, fxGroup, fxGroupSoft, fxOf } from './fx.js'

// Template: 자캐 설정집 — a character reference sheet: portrait card, colour swatches (click to copy),
// profile table, stat bars, quote, relations and a gallery.
const BASE_PALETTES = [
  { id: 'sakura', label: '벚꽃 크림', bg: '#fff5f6', card: '#ffffff', fg: '#3b2a30', accent: '#e8648b', accent2: '#f7c6d3' },
  { id: 'dawn', label: '새벽 라벤더', bg: '#1b1830', card: '#26223f', fg: '#ece8ff', accent: '#a78bfa', accent2: '#4a3f8f', fxStars: true, fxGrain: true, fxVignette: true, skin: 'line' },
  { id: 'mint', label: '민트 소다', bg: '#effaf6', card: '#ffffff', fg: '#1f3a34', accent: '#2fb89a', accent2: '#bfeede' },
  { id: 'gothic', label: '고딕 블랙레드', bg: '#0e0b0c', card: '#1a1315', fg: '#f2e9e9', accent: '#d6354f', accent2: '#5b1823', fxStars: true, fxGrain: true, fxVignette: true, skin: 'line' },
  { id: 'film', label: '달빛 필름', bg: '#0c0d10', card: '#16181d', fg: '#eceae4', accent: '#d8c7a0', accent2: '#3a3a40', fxGrain: true, fxVignette: true, fxStars: true, skin: 'line' },
]
const PALETTES = [...BASE_PALETTES, ...MOODS]

const defaults = {
  name: '치즈',
  nameSub: 'Cheese · 치즈냥 (치즈태비 수컷)',
  tagline: '골목에서 제일 느긋한 햇볕 수집가',
  quote: '햇볕이 드는 곳이 내가 있는 곳이야. 그러니까 비켜 줄래?',
  portrait: '',
  keywords: '치즈태비, 낮잠, 햇볕, 간식, 애교',
  story: '달무리 골목의 담벼락 위가 제일 좋은 자리라고 믿는 치즈태비예요. 느긋하고 겁이 없어서 처음 보는 사람 무릎에도 거리낌 없이 올라가요.\n\n간식 봉지 소리가 들리면 어디에 있든 5초 안에 나타나요. 다만 사냥 실력은… 비밀로 해 주세요.',
  info: '나이 | 3살 (사람 나이로 28세)\n몸길이 / 체중 | 46cm / 4.6kg\n생일 | 3월 3일\n종 | 고양이 (치즈태비)\n성격 | 느긋함 · 넉살 좋음\n소속 | 달무리 골목\n역할 | 담벼락 순찰대장 (자칭)',
  swatches: '털색 | #f2a65a\n눈동자 | #7bc96f\n코·발바닥 | #f4a3a3\n목줄 | #5b7db1',
  stats: '낮잠 | 10\n애교 | 9\n간식 레이더 | 8\n점프 | 4\n사냥 | 1',
  likes: '햇볕, 참치캔, 택배 상자, 창가 자리',
  dislikes: '목욕, 청소기, 닫힌 문, 비 오는 날',
  relations: '고등어 | 소꿉친구 | 같은 골목에서 자란 순찰 동료. 서로의 낮잠 자리를 잘 알아요.\n먹물 | 골목 어르신 | 사냥하는 법을 가르쳐 줬지만 치즈는 하나도 기억하지 못했어요.',
  gallery: [],
  owner: '제작자 닉네임',
  notice: '이 캐릭터는 제작자의 오리지널 캐릭터(자캐)입니다. 2차 가공, 무단 도용, AI 학습 사용을 금지합니다. 교류와 커미션 문의는 환영해요.',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/\n디스코드 | https://discord.com/',
  ...paletteColors(PALETTES[0]),
  ...fxDefaults,
  ...fxOf(PALETTES[0]),
  displayFont: 'gowunbatang',
  bodyFont: 'pretendard',
  decor: true,
}

const fields = [
  { group: '캐릭터', open: true, items: [
    { key: 'name', label: '이름', type: 'text' },
    { key: 'nameSub', label: '영문·한자 표기', type: 'text' },
    { key: 'tagline', label: '한 줄 소개', type: 'text' },
    { key: 'quote', label: '대표 대사', type: 'text', hint: '큰 글씨로 보여요. 비우면 숨겨요.' },
    { key: 'portrait', label: '대표 일러스트', type: 'image', theme: true, hint: '브라우저에서 줄여서 파일 안에 넣어요. 서버로 올라가지 않습니다.' },
    { key: 'keywords', label: '키워드', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'story', label: '소개글', type: 'textarea', rows: 6, hint: '빈 줄로 문단을 나눠요.' },
  ] },
  { group: '프로필 표', open: true, items: [
    { key: 'info', label: '프로필 항목', type: 'textarea', rows: 8, hint: '한 줄에 하나: 항목 | 내용 (최대 14개)' },
    { key: 'swatches', label: '컬러 팔레트', type: 'textarea', rows: 4, hint: '한 줄에 하나: 이름 | #색상코드 (최대 8개). 방문자가 누르면 코드가 복사돼요.' },
    { key: 'stats', label: '능력치', type: 'textarea', rows: 5, hint: '한 줄에 하나: 항목 | 0~10 (최대 8개)' },
    { key: 'likes', label: '좋아하는 것', type: 'text', hint: '쉼표로 구분' },
    { key: 'dislikes', label: '싫어하는 것', type: 'text', hint: '쉼표로 구분' },
  ] },
  { group: '관계', items: [
    { key: 'relations', label: '관계도', type: 'textarea', rows: 5, hint: '한 줄에 하나: 이름 | 관계 | 설명 (최대 6개)' },
  ] },
  { group: '갤러리', items: [
    { key: 'gallery', label: '일러스트 모음', type: 'images', max: 8, hint: '최대 8장. 방문자가 누르면 크게 볼 수 있어요.' },
  ] },
  footerGroup,
  (() => { const g = styleGroup(); g.items.push({ key: 'decor', label: '별 장식 넣기', type: 'check' }); return g })(),
  fxGroup,
]

const RUNTIME = String.raw`
(function () {
  document.querySelectorAll('.swatches button').forEach(function (b) {
    b.addEventListener('click', function () {
      var h = b.getAttribute('data-hex');
      function done() { b.classList.add('ok'); setTimeout(function () { b.classList.remove('ok'); }, 1400); }
      if (navigator.clipboard) navigator.clipboard.writeText(h).then(done, done); else done();
    });
  });
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const name = c.name || '이름'
  const portrait = imgSrc(c.portrait)
  const info = lines(c.info, 14).map(cols)
  const sw = lines(c.swatches, 8).map(cols).map(([n, h]) => [n, /^#[0-9a-f]{6}$/i.test(h || '') ? h : null]).filter(([, h]) => h)
  const stats = lines(c.stats, 8).map(cols).map(([n, v]) => [n, Math.max(0, Math.min(10, Math.round(Number(v) || 0)))])
  const rel = lines(c.relations, 6).map(cols)
  const paras = String(c.story || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const likes = list(c.likes), dislikes = list(c.dislikes)
  const hasGal = (Array.isArray(c.gallery) ? c.gallery : []).some((g) => imgSrc(g))
  const nav = [
    paras.length && ['소개', 'story'], info.length && ['프로필', 'profile'], stats.length && ['능력치', 'stats'],
    (likes.length || dislikes.length) && ['취향', 'taste'], rel.length && ['관계', 'relations'], hasGal && ['갤러리', 'gallery'],
  ].filter(Boolean)
  const css = `
${sw.map(([, h], i) => `.sw${i}{background:${h}}`).join('')}
${[...Array(11).keys()].map((n) => `.w${n}{width:${n * 10}%}`).join('')}
.star{animation:tw 4s ease-in-out infinite;position:fixed;width:26px;height:26px;background:var(--accent);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);opacity:.5;pointer-events:none;z-index:0}
.s1{top:7%;left:4%}.s2{top:22%;right:5%;width:18px;height:18px;background:var(--accent2);opacity:.9}.s3{bottom:12%;left:8%;width:14px;height:14px}
.wrap{position:relative;z-index:1;display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:clamp(24px,4vw,56px);max-width:1120px;margin:0 auto;padding:clamp(24px,5vw,64px) clamp(16px,4vw,32px)}
.profile{position:sticky;top:24px;align-self:start;background:var(--card);border:1.5px solid var(--line);border-radius:28px;padding:18px 18px 22px;box-shadow:8px 8px 0 var(--accent2);transform:rotate(-1.2deg)}
.profile::before{content:"";position:absolute;top:-14px;left:50%;width:110px;height:28px;margin-left:-55px;transform:rotate(3deg);background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--accent2) 80%,#fff) 0 8px,color-mix(in srgb,var(--accent2) 55%,#fff) 8px 16px);opacity:.92;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.pic{aspect-ratio:3/4;border-radius:20px 20px 120px 120px;overflow:hidden;position:relative}
.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero{position:relative;margin:0 0 clamp(24px,3.5vw,40px);padding-top:6px}
.wm{position:absolute;left:-6px;top:-18px;right:0;font:800 clamp(80px,13vw,190px)/.9 var(--display);letter-spacing:-.03em;color:transparent;-webkit-text-stroke:1.5px color-mix(in srgb,var(--accent) 28%,transparent);white-space:nowrap;overflow:hidden;pointer-events:none;user-select:none;text-transform:uppercase}
.eyebrow{position:relative;display:flex;gap:10px;margin:0 0 8px;font:700 12px/1 var(--body);letter-spacing:.18em}
.eyebrow span{padding:5px 12px;border-radius:99px;background:var(--fg);color:var(--bg)}
.eyebrow span+span{background:var(--accent);color:var(--card)}
.hero h1{position:relative;margin:clamp(34px,5vw,64px) 0 0;font:800 clamp(52px,8.5vw,112px)/1 var(--display);letter-spacing:-.03em;background:linear-gradient(transparent 68%,color-mix(in srgb,var(--accent2) 85%,transparent) 68% 94%,transparent 94%);display:inline-block}
.sub{position:relative;margin:10px 0 0;color:var(--dim);font-size:15px;letter-spacing:.06em}
.tagline{position:relative;margin:10px 0 0;font:700 clamp(18px,2vw,23px)/1.4 var(--display);color:var(--accent)}
.kw{position:relative;display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:16px 0 0;padding:0}
.kw li{padding:3px 14px;border-radius:99px;background:color-mix(in srgb,var(--accent) 14%,var(--card));border:1px solid color-mix(in srgb,var(--accent) 35%,var(--card));font-size:14px;font-weight:600}
.kw li::before{content:"#";opacity:.5;margin-right:2px}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(66px,1fr));gap:10px;list-style:none;margin:20px 0 0;padding:0}
.swatches button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;align-items:stretch;gap:0;font-size:11.5px;position:relative;background:#fff;color:#2b2b30;padding:5px 5px 6px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.14);transition:transform .15s}
.swatches button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.swatches i{display:block;height:44px;border-radius:3px}
.swatches span{margin-top:5px;font-weight:700;text-align:center}
.swatches small{font-size:9.5px;opacity:.55;text-align:center;letter-spacing:.04em}
.swatches button:hover{transform:translateY(-3px) rotate(-1.5deg)}
.swatches button.ok::after{content:"복사됨";position:absolute;top:-26px;left:50%;transform:translateX(-50%);padding:1px 10px;border-radius:99px;background:var(--fg);color:var(--bg);font-weight:700;font-size:11px;white-space:nowrap}
.links{justify-content:flex-start;margin-top:18px}
main{counter-reset:sc}
main section{margin:0 0 clamp(32px,4.5vw,56px);counter-increment:sc}
.mini{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:clamp(20px,3vw,32px)}
.mini a{padding:4px 14px;border-radius:99px;border:1.5px solid var(--line);background:var(--card);font-size:13.5px;font-weight:700;text-decoration:none}
.mini a:hover{border-color:var(--accent);color:var(--accent)}
.quote{position:relative;margin:0 0 clamp(32px,4.5vw,56px);padding:8px 0 8px 32px;border-left:5px solid var(--accent);font:700 clamp(21px,2.6vw,30px)/1.5 var(--display)}
.quote cite{display:block;margin-top:8px;font:400 14px var(--body);color:var(--dim)}
h2{margin:0 0 16px;font:800 clamp(24px,2.8vw,32px)/1.2 var(--display);display:flex;align-items:baseline;gap:12px}
h2::before{content:counter(sc,decimal-leading-zero);font:800 14px var(--body);letter-spacing:.1em;color:var(--card);background:var(--accent);padding:3px 9px;border-radius:99px;transform:translateY(-3px)}
h2::after{content:"";flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--line) 0 8px,transparent 8px 14px);align-self:center}
.story p{margin:0 0 1em}
dl{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:10px}
dl div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:10px 16px}
dt{font-size:12.5px;color:var(--dim);font-weight:600}
dd{margin:0;font-weight:600}
.stat{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.stat li{display:grid;grid-template-columns:5.5em 1fr 2em;gap:12px;align-items:center;font-size:15px}
.stat .bar{height:14px;border-radius:99px;background:color-mix(in srgb,var(--accent2) 55%,var(--card));overflow:hidden;border:1.5px solid var(--line)}
.stat .bar{position:relative}
.stat .bar::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 2px),var(--card) calc(10% - 2px) 10%)}
.stat .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent2),var(--accent));border-radius:99px}
.stat b{text-align:right;color:var(--accent)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px}
.box{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:16px 20px}
.box h3{margin:0 0 8px;font:700 17px var(--display)}
.rel{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.rel li{background:var(--card);border:1px solid var(--line);border-left:6px solid var(--accent);border-radius:16px;padding:12px 18px}
.rel b{font-size:17px}
.rel span{margin-left:8px;font-size:13px;color:var(--accent);font-weight:700}
.rel p{margin:4px 0 0;color:var(--dim);font-size:15px}
.sec{margin-top:0}
@keyframes tw{50%{transform:scale(1.35) rotate(20deg);opacity:.9}}
@media(prefers-reduced-motion:reduce){.star{animation:none}.swatches button{transition:none}}
@media(max-width:820px){.profile{transform:none}.hero h1{margin-top:28px}.wrap{grid-template-columns:1fr}.profile{position:static;max-width:420px;margin-inline:auto;width:100%}.stat li{grid-template-columns:4.5em 1fr 1.6em}}
`
  const body = `${c.decor ? '<i class="star s1" aria-hidden="true"></i><i class="star s2" aria-hidden="true"></i><i class="star s3" aria-hidden="true"></i>' : ''}
<div class="wrap">
  <aside class="profile">
    <div class="pic">${portrait ? `<img src="${portrait}" alt="${esc(name)} 일러스트">` : phHtml(name)}</div>
    ${sw.length ? `<ul class="swatches" aria-label="컬러 팔레트">${sw.map(([n, h], i) => `<li><button type="button" data-hex="${h}" aria-label="${esc(n)} ${h} 복사"><i class="sw${i}"></i><span>${esc(n)}</span><small>${h.toUpperCase()}</small></button></li>`).join('')}</ul>` : ''}
    ${linksHtml(c.links)}
  </aside>
  <main>
    <header class="hero">
      <div class="wm" aria-hidden="true">${esc(c.nameSub || name)}</div>
      <p class="eyebrow"><span>CHARACTER SHEET</span><span>No.01</span></p>
      <h1>${esc(name)}</h1>
      ${c.nameSub ? `<p class="sub">${esc(c.nameSub)}</p>` : ''}
      ${c.tagline ? `<p class="tagline">${esc(c.tagline)}</p>` : ''}
      ${list(c.keywords).length ? `<ul class="kw">${list(c.keywords).map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
    </header>
    ${nav.length > 2 ? `<nav class="mini" aria-label="바로가기">${nav.map(([l, id]) => `<a href="#${id}">${esc(l)}</a>`).join('')}</nav>` : ''}
    ${c.quote ? `<blockquote class="quote">${esc(c.quote)}<cite>— ${esc(name)}</cite></blockquote>` : ''}
    ${paras.length ? `<section class="story" id="story"><h2>소개</h2>${paras.map((p) => `<p>${multi(p)}</p>`).join('')}</section>` : ''}
    ${info.length ? `<section id="profile"><h2>프로필</h2><dl>${info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v || '')}</dd></div>`).join('')}</dl></section>` : ''}
    ${stats.length ? `<section id="stats"><h2>능력치</h2><ul class="stat">${stats.map(([n, v]) => `<li><span>${esc(n)}</span><div class="bar" role="img" aria-label="${esc(n)} ${v}/10"><i class="w${v}"></i></div><b>${v}</b></li>`).join('')}</ul></section>` : ''}
    ${likes.length || dislikes.length ? `<section id="taste"><h2>취향</h2><div class="two">${likes.length ? `<div class="box"><h3>좋아하는 것</h3><ul class="chips">${likes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}${dislikes.length ? `<div class="box"><h3>싫어하는 것</h3><ul class="chips">${dislikes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}</div></section>` : ''}
    ${rel.length ? `<section id="relations"><h2>관계</h2><ul class="rel">${rel.map(([n, r, d]) => `<li><b>${esc(n)}</b>${r ? `<span>${esc(r)}</span>` : ''}${d ? `<p>${esc(d)}</p>` : ''}</li>`).join('')}</ul></section>` : ''}
    ${galleryHtml(c.gallery, `${name} 일러스트`).replace('class="sec"', '')}
    ${c.notice ? `<section><div class="notice">${multi(c.notice)}</div></section>` : ''}
  </main>
</div>
${footerHtml(c, name)}`
  return shell({ c, d: PALETTES[0], title: `${name} — 캐릭터 설정집`, desc: c.tagline || c.quote, fontCss, css, body, script: sw.length ? RUNTIME : '' })
}

export default {
  id: 'oc',
  group: '덕질',
  name: '자캐 설정집',
  blurb: '프로필 카드, 클릭하면 복사되는 컬러 팔레트, 능력치, 관계도, 갤러리를 한 페이지에.',
  tag: '자캐',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: fontsOf(defaults),
}
