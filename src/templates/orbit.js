import { sectionDefaults, sectionFields, sections } from './sections.js'
import { clamp, esc, fontHead, fontsHref, hex, imgSrc, list, multi, pick, safeUrl, slug, koFont, navId } from './util.js'
import { MOODS, fxDefaults, fxGroupSoft, fxOf, withFx } from './fx.js'

// Template: centred SaaS hero with a slow gradient orb rising from the bottom edge.
const BASE_PALETTES = [
  { id: 'dusk', label: '해질녘', bg: '#0e0b1a', fg: '#f4f1ff', c1: '#7c5cff', c2: '#ff5ca8', c3: '#3dd6c6' },
  { id: 'dawn', label: '새벽', bg: '#fff6ee', fg: '#25140d', c1: '#ff8a4c', c2: '#ffcf5c', c3: '#ff5c7a' },
  { id: 'lagoon', label: '라군', bg: '#06151a', fg: '#e8fbff', c1: '#19c6d9', c2: '#3b82f6', c3: '#a3e635' },
  { id: 'cloud', label: '구름', bg: '#f5f7fb', fg: '#10131a', c1: '#6d8dff', c2: '#b79bff', c3: '#7fe3d3' },
]
const PALETTES = [...BASE_PALETTES, ...MOODS.map((m) => ({ ...m, c1: m.accent, c2: m.accent2, c3: m.fg }))]

const FONTS = [
  koFont('pretendard'), koFont('jua'), koFont('blackhan'), koFont('gowunbatang'),
  { id: 'sora', label: 'Sora', css: "'Sora'", q: 'Sora:wght@400;600;700' },
  { id: 'outfit', label: 'Outfit', css: "'Outfit'", q: 'Outfit:wght@400;500;700' },
  { id: 'bricolage', label: 'Bricolage Grotesque', css: "'Bricolage Grotesque'", q: 'Bricolage+Grotesque:wght@400;600;800' },
]

const defaults = {
  ...sectionDefaults,
  ...fxDefaults,
  features: '버튼 한 번에 한 주 | 캘린더와 할 일로 현실적인 한 주를 짜 줘요.\n하나만 옮기기 | 할 일 하나를 끌어다 놓으면 나머지가 알아서 밀려요.\n조용한 기본값 | 알림은 없어요. 아침마다 요약 한 번뿐이에요.',
  plans: '무료 | 0원 | 캘린더 하나 | 캘린더 1개;주간 계획;커뮤니티 도움\n*프로 | 월 9,000원 | 바쁜 사람용 | 캘린더 3개;자동 일정 조정;우선 도움\n팀 | 인당 월 7,000원 | 작은 팀용 | 공용 계획;관리자 권한',
  footerText: '© 2026 낮잠. 모든 권리 보유.',
  brand: '낮잠',
  featuresTitle: '낮잠이 해 주는 일',
  pricingTitle: '요금',
  nav: '제품, 요금, 고객, 블로그',
  badge: '새 기능: 주간 계획이 왔어요',
  heading: '한 주 계획을\n커피 한 잔 시간에.',
  subtitle: '낮잠은 캘린더와 할 일을 읽고, 정말 지킬 수 있는 한 주를 짜 줘요. 하나만 옮기면 나머지가 알아서 맞춰져요.',
  cta: '낮잠 무료로 써 보기',
  ctaUrl: '#start',
  link: '2분 투어 보기',
  linkUrl: '#tour',
  logos: '치즈네 가게, 고등어 서점, 두부 베이커리, 먹물 공방, 달무리 카페',
  logosLabel: '골목 가게들이 함께 써요',
  shot: '',
  shotAlt: '',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  c1: PALETTES[0].c1,
  c2: PALETTES[0].c2,
  c3: PALETTES[0].c3,
  font: 'pretendard',
  speed: 5,
}

const fields = [
  { group: '내용', open: true, items: [
    { key: 'brand', label: '브랜드 이름', type: 'text' },
    { key: 'badge', label: '배지', type: 'text', hint: '제목 위의 작은 알약 모양 문구예요. 비우면 숨겨요.' },
    { key: 'heading', label: '제목', type: 'textarea', rows: 2, hint: '한 줄에 한 행, 최대 3줄까지.' },
    { key: 'subtitle', label: '소제목', type: 'textarea', rows: 3 },
    { key: 'nav', label: '메뉴', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'cta', label: '버튼 문구', type: 'text', half: true },
    { key: 'ctaUrl', label: '버튼 링크', type: 'text', half: true },
    { key: 'link', label: '보조 링크', type: 'text', half: true },
    { key: 'linkUrl', label: '보조 링크 주소', type: 'text', half: true },
    { key: 'shot', label: '제품 화면 이미지', type: 'image', hint: '버튼 아래에 액자처럼 보여요.' },
    { key: 'shotAlt', label: '화면 이미지 설명', type: 'text', hint: '화면 낭독기가 읽어 주는 설명이에요.' },
    { key: 'logosLabel', label: '로고 줄 문구', type: 'text' },
    { key: 'logos', label: '고객사 이름', type: 'text', hint: '쉼표(,)로 구분해요.' },
  ] },
  { group: '스타일', open: true, items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text']] },
    { type: 'colors', keys: [['c1', 'Orb 1'], ['c2', 'Orb 2'], ['c3', 'Orb 3']] },
    { key: 'font', label: '폰트', type: 'select', options: FONTS },
    { key: 'speed', label: '오브 속도', type: 'range', min: 1, max: 10 },
  ] },
  ...sectionFields,
  fxGroupSoft,
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const f = pick(FONTS, c.font)
  const bg = hex(c.bg, '#0e0b1a'), fg = hex(c.fg, '#f4f1ff')
  const c1 = hex(c.c1, '#7c5cff'), c2 = hex(c.c2, '#ff5ca8'), c3 = hex(c.c3, '#3dd6c6')
  const dur = Math.round(44 - clamp(c.speed, 1, 10) * 3.8)
  const sx = sections(c)
  const shot = imgSrc(c.shot)
  const brand = c.brand || 'Your brand'
  const heading = String(c.heading || '').split('\n').slice(0, 3)
  const page = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(heading.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(f.q))}
<style>
:root{--bg:${bg};--fg:${fg};--c1:${c1};--c2:${c2};--c3:${c3};--font:${f.css},system-ui,sans-serif;--dim:color-mix(in srgb,var(--fg) 66%,var(--bg));--line:color-mix(in srgb,var(--fg) 16%,var(--bg));--sx-accent:var(--c1);--sx-head:var(--font);--sx-body:var(--font);--sx-radius:18px}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 16px/1.6 var(--font);overflow-x:hidden}
.first{position:relative;min-height:100svh;display:flex;flex-direction:column;overflow:hidden}
a{color:inherit}
:focus-visible{outline:2px solid var(--c1);outline-offset:3px}
.top{position:relative;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px clamp(18px,4vw,48px)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;text-decoration:none;letter-spacing:-.02em}
.brand i{width:22px;height:22px;border-radius:50%;background:conic-gradient(var(--c1),var(--c2),var(--c3),var(--c1))}
.top nav{display:flex;gap:clamp(14px,2.4vw,32px)}
.top nav a{font-size:14px;text-decoration:none;color:var(--dim)}
.top nav a:hover{color:var(--fg)}
.pill{padding:9px 18px;border:1px solid var(--line);border-radius:99px;font-size:14px;font-weight:600;text-decoration:none}
.hero{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:clamp(28px,6vw,72px) clamp(18px,4vw,48px) 0}
.badge{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:99px;padding:6px 14px;font-size:13px;color:var(--dim);margin-bottom:26px;background:color-mix(in srgb,var(--bg) 70%,transparent);backdrop-filter:blur(6px)}
.badge::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c3)}
h1{margin:0 0 22px;font:700 clamp(36px,6.4vw,84px)/1.03 var(--font);letter-spacing:-.04em;max-width:15ch;text-wrap:balance}
h1 span{display:block}
.sub{max-width:52ch;margin:0 0 32px;color:var(--dim);font-size:clamp(15px,1.6vw,18px)}
.ctas{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:14px 26px}
.btn{display:inline-block;padding:14px 28px;border-radius:99px;background:var(--fg);color:var(--bg);font-weight:700;text-decoration:none;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 30px color-mix(in srgb,var(--c1) 45%,transparent)}
.shot{margin:clamp(28px,5vw,56px) auto 0;width:min(980px,100%);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.35);background:var(--bg)}
.shot img{display:block;width:100%;height:auto}
.link{text-decoration:none;font-weight:600}
.link:hover{text-decoration:underline;text-underline-offset:5px}
.logos{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:10px;padding:clamp(28px,5vw,60px) 18px clamp(24px,3vw,36px);font-size:12px;color:var(--dim)}
.logos div{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 34px;font-weight:700;font-size:15px;letter-spacing:-.01em;color:color-mix(in srgb,var(--fg) 82%,var(--bg))}
.glow{position:absolute;z-index:1;left:50%;bottom:-38%;width:min(130vw,1100px);aspect-ratio:1;transform:translateX(-50%);pointer-events:none}
.glow::before,.glow::after{content:"";position:absolute;inset:0;border-radius:50%}
.glow::before{background:radial-gradient(circle at 30% 35%,var(--c1),transparent 52%),radial-gradient(circle at 72% 40%,var(--c2),transparent 50%),radial-gradient(circle at 50% 78%,var(--c3),transparent 52%);filter:blur(46px);opacity:.85;animation:spin ${dur}s linear infinite}
.glow::after{inset:12%;border:1px solid color-mix(in srgb,var(--fg) 22%,transparent);box-shadow:0 0 0 70px color-mix(in srgb,var(--fg) 4%,transparent),0 0 0 140px color-mix(in srgb,var(--fg) 3%,transparent)}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:720px){.top nav{display:none}}
@media(prefers-reduced-motion:reduce){.glow::before{animation:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#"><i></i>${esc(brand)}</a>
  <nav aria-label="주요 메뉴">${list(c.nav).map((n) => `<a href="#${esc(navId(n))}">${esc(n)}</a>`).join('')}</nav>
  <a class="pill" href="${esc(safeUrl(c.ctaUrl))}">로그인</a>
</header>
<main class="hero">
  ${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}
  <h1>${heading.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
  <p class="sub">${multi(c.subtitle)}</p>
  <div class="ctas">
    <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
    ${c.link ? `<a class="link" href="${esc(safeUrl(c.linkUrl))}">${esc(c.link)} &rarr;</a>` : ''}
  </div>
  ${shot ? `<figure class="shot"><img src="${shot}" alt="${esc(c.shotAlt)}"></figure>` : ''}
</main>
${list(c.logos).length ? `<div class="logos"><span>${esc(c.logosLabel)}</span><div>${list(c.logos).map((l) => `<span>${esc(l)}</span>`).join('')}</div></div>` : ''}
<div class="glow" aria-hidden="true"></div>
</div>
${sx.html}
</body>
</html>
`
  return withFx(page, c, c.brand)
}

export default {
  id: 'orbit',
  group: '일반',
  name: '소프트 오브',
  blurb: '은은한 그라디언트 오브가 도는 서비스 소개 히어로.',
  tag: '서비스',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.font] },
}
