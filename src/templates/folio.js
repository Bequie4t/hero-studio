import { sectionDefaults, sectionFields, sections } from './sections.js'
import { esc, fontHead, fontsHref, hex, imgSrc, list, multi, pick, safeUrl, slug, koFont, navId } from './util.js'
import { MOODS, fxDefaults, fxGroupSoft, fxOf, withFx } from './fx.js'

// Template: editorial portfolio hero (oversized name, availability pill, project index).
const BASE_PALETTES = [
  { id: 'cream', label: '크림', bg: '#efe9df', fg: '#1b1a17', accent: '#d9461f' },
  { id: 'ink', label: '먹', bg: '#111111', fg: '#f1efe9', accent: '#c8ff3d' },
  { id: 'sky', label: '하늘', bg: '#dfeaf5', fg: '#0f1b2d', accent: '#3b6cf6' },
  { id: 'blush', label: '블러시', bg: '#f6e3e0', fg: '#2a1214', accent: '#c2314d' },
]
const PALETTES = [...BASE_PALETTES, ...MOODS.map((m) => (m))]

const FONTS = [
  koFont('pretendard'), koFont('gowunbatang'), koFont('jua'), koFont('blackhan'),
  { id: 'bricolage', label: 'Bricolage Grotesque', css: "'Bricolage Grotesque'", q: 'Bricolage+Grotesque:wght@400;600;800' },
  { id: 'fraunces', label: 'Fraunces', css: "'Fraunces'", q: 'Fraunces:wght@400;600;800' },
  { id: 'syne', label: 'Syne', css: "'Syne'", q: 'Syne:wght@500;700;800' },
]

const defaults = {
  ...sectionDefaults,
  ...fxDefaults,
  features: '브랜드 아이덴티티 | 이름, 심벌, 그리고 일관성을 지켜 주는 규칙까지.\n웹사이트 | 개발자 없이도 고칠 수 있는 빠르고 접근성 좋은 사이트.\n모션 | 제품의 순간을 위한 짧은 루프와 런칭 영상.',
  plans: '스프린트 | 240만 원 | 집중해서 한 주 | 브리프와 무드보드;시안 2종;수정 1회\n*스튜디오 | 680만 원 | 정체성 전체 | 로고 시스템;가이드라인;런칭 소재\n리테이너 | 월 320만 원 | 꾸준한 디자인 | 주간 작업 시간;우선 대기열',
  pricingTitle: '함께 일하는 방법',
  footerText: '© 2026 꼬리별. 손으로 만들었어요.',
  brand: '꼬리별',
  featuresTitle: '하는 일',
  nav: '작업, 소개, 노트, 연락',
  status: '11월 프로젝트 예약 받는 중',
  heading: '작고 당당한\n고양이 브랜드를\n그려요.',
  subtitle: '고양이 가게와 작은 스튜디오가 가장 멋진 모습으로 보이도록 도와요. 서울에서 일하고, 어디든 작업해요.',
  photo: '',
  photoAlt: '',
  cta: '인사하기',
  ctaUrl: 'mailto:hello@example.com',
  projectsTitle: '골라 담은 작업',
  projects: '치즈 커피 | 브랜드 아이덴티티 | 2026\n고등어 서점 | 웹사이트 | 2025\n두부 베이커리 | 모션 | 2025\n먹물 공방 | 패키지 | 2024',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  font: 'pretendard',
}

const fields = [
  { group: '내용', open: true, items: [
    { key: 'brand', label: '이름', type: 'text' },
    { key: 'status', label: '작업 가능 안내', type: 'text', hint: '위쪽 작은 알약 모양 문구예요. 비우면 숨겨요.' },
    { key: 'heading', label: '제목', type: 'textarea', rows: 3, hint: '한 줄에 한 행, 최대 3줄까지.' },
    { key: 'subtitle', label: '소개', type: 'textarea', rows: 3 },
    { key: 'photo', label: '인물 사진', type: 'image', hint: '이름 옆에 아치 모양으로 보여요.' },
    { key: 'photoAlt', label: '사진 설명', type: 'text', hint: '화면 낭독기가 읽어 주는 설명이에요.' },
    { key: 'nav', label: '메뉴', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'cta', label: '버튼 문구', type: 'text', half: true },
    { key: 'ctaUrl', label: '버튼 링크', type: 'text', half: true },
  ] },
  { group: '프로젝트', open: true, items: [
    { key: 'projectsTitle', label: '제목', type: 'text' },
    { key: 'projects', label: '프로젝트', type: 'textarea', rows: 6, hint: '한 줄에 하나: 이름 | 종류 | 연도 (최대 8개)' },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text'], ['accent', 'Accent']] },
    { key: 'font', label: '폰트', type: 'select', options: FONTS },
  ] },
  ...sectionFields,
  fxGroupSoft,
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const f = pick(FONTS, c.font)
  const bg = hex(c.bg, '#efe9df'), fg = hex(c.fg, '#1b1a17'), accent = hex(c.accent, '#d9461f')
  const sx = sections(c)
  const photo = imgSrc(c.photo)
  const brand = c.brand || 'Your name'
  const heading = String(c.heading || '').split('\n').slice(0, 3)
  const projects = String(c.projects || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 8)
  const page = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(heading.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(f.q))}
<style>
:root{--bg:${bg};--fg:${fg};--accent:${accent};--font:${f.css},Georgia,serif;--dim:color-mix(in srgb,var(--fg) 62%,var(--bg));--line:color-mix(in srgb,var(--fg) 22%,var(--bg));--sx-accent:var(--accent);--sx-head:var(--font);--sx-body:var(--font);--sx-radius:4px}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 17px/1.55 var(--font);overflow-x:hidden}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.first{min-height:100svh;display:flex;flex-direction:column;padding:0 clamp(18px,4vw,48px)}
.top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;flex-wrap:wrap}
.brand{font-weight:800;font-size:19px;letter-spacing:-.02em;text-decoration:none}
.top nav{display:flex;gap:clamp(14px,2.4vw,32px)}
.top nav a{text-decoration:none;font-size:15px}
.top nav a:hover{color:var(--accent)}
.status{display:inline-flex;align-items:center;gap:9px;border:1.5px solid var(--fg);border-radius:99px;padding:6px 14px;font-size:13px;font-weight:600}
.status::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--accent);animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.6);opacity:.5}}
.hero{flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(22px,4vw,44px);padding:clamp(16px,3vw,40px) 0}
h1{margin:0;font:800 clamp(46px,11.5vw,184px)/.9 var(--font);letter-spacing:-.05em;text-wrap:balance}
h1 span{display:block}
h1 span:last-child{color:var(--accent)}
.headline{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.portrait{flex:0 0 clamp(120px,17vw,250px);width:clamp(120px,17vw,250px);aspect-ratio:4/5;object-fit:cover;border-radius:999px 999px 14px 14px}
.row{display:flex;justify-content:space-between;align-items:flex-end;gap:24px 48px;flex-wrap:wrap}
.sub{margin:0;max-width:40ch;font-size:clamp(16px,1.7vw,20px)}
.btn{display:inline-flex;align-items:center;gap:10px;background:var(--fg);color:var(--bg);padding:16px 28px;border-radius:99px;font-weight:700;text-decoration:none;transition:gap .2s,background .2s}
.btn::after{content:"\\2192"}
.btn:hover{gap:16px;background:var(--accent)}
.work{border-top:1.5px solid var(--fg);margin-top:clamp(12px,3vw,32px)}
.work h2{margin:14px 0 6px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--dim)}
.work ol{list-style:none;margin:0;padding:0}
.work li{display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:baseline;border-bottom:1px solid var(--line);padding:14px 0;font-size:clamp(18px,2.4vw,30px);font-weight:600;letter-spacing:-.02em;transition:padding-left .2s,color .2s;cursor:default}
.work li:hover{padding-left:12px;color:var(--accent)}
.work li strong{font-weight:inherit}
.work li span{font-size:14px;font-weight:500;color:var(--dim);letter-spacing:0}
@media(max-width:640px){.top nav{display:none}.work li{grid-template-columns:1fr auto}.work li span:nth-child(2){display:none}}
@media(prefers-reduced-motion:reduce){.status::before{animation:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#">${esc(brand)}</a>
  <nav aria-label="주요 메뉴">${list(c.nav).map((n) => `<a href="#${esc(navId(n))}">${esc(n)}</a>`).join('')}</nav>
  ${c.status ? `<span class="status">${esc(c.status)}</span>` : ''}
</header>
<main class="hero">
  <div class="headline"><h1>${heading.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>${photo ? `<img class="portrait" src="${photo}" alt="${esc(c.photoAlt)}">` : ''}</div>
  <div class="row">
    <p class="sub">${multi(c.subtitle)}</p>
    <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
  </div>
  ${projects.length ? `<section class="work" id="work"><h2>${esc(c.projectsTitle)}</h2><ol>${projects
    .map((l) => {
      const [n, t, y] = l.split('|').map((s) => s.trim())
      return `<li><strong>${esc(n)}</strong><span>${esc(t || '')}</span><span>${esc(y || '')}</span></li>`
    })
    .join('')}</ol></section>` : ''}
</main>
</div>
${sx.html}
</body>
</html>
`
  return withFx(page, c, c.brand)
}

export default {
  id: 'folio',
  group: '일반',
  name: '폴리오',
  blurb: '큰 이름과 프로젝트 목록이 있는 포트폴리오.',
  tag: '포트폴리오',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.font] },
}
