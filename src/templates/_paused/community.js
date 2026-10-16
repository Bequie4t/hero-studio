// PAUSED: community-specific home. Not registered in ../index.js. It will get its own, dedicated product later.
import { koOptions, koStack } from '../../fonts/ko-registry.js'
import { cols, esc, fontHead, hex, imgSrc, initial, lines, list, multi, safeUrl } from '../util.js'

// Template: 자캐 커뮤니티 — a community hub (world, rules, how to join, members, notices, FAQ).
const PALETTES = [
  { id: 'night', label: '심야 보라', bg: '#12101f', card: '#1c1932', fg: '#eeeaff', accent: '#8b7bff', accent2: '#ff7ac8' },
  { id: 'dawn', label: '새벽 푸른빛', bg: '#0d1620', card: '#15222f', fg: '#e8f1fa', accent: '#58b6ff', accent2: '#7af0d0' },
  { id: 'library', label: '크림 서가', bg: '#f7f1e6', card: '#fffaf0', fg: '#2e2418', accent: '#b4532a', accent2: '#e9c46a' },
  { id: 'cherry', label: '체리 소다', bg: '#fff0f3', card: '#ffffff', fg: '#35121c', accent: '#ff4d79', accent2: '#ffd6e0' },
]

const defaults = {
  name: '달무리 마을',
  slogan: '달이 두 번 뜨는 마을에서, 우리의 이야기를 이어가요.',
  status: '멤버 모집 중',
  banner: '',
  world: '달무리 마을은 밤하늘에 달이 두 개 뜨는 작은 세계를 배경으로 한 자캐 합작 커뮤니티입니다.\n\n각자의 캐릭터를 마을 주민으로 데려와 일상, 사건, 관계를 함께 만들어 가요. 정해진 정답 없이, 서로의 설정을 존중하며 천천히 이야기를 쌓습니다.',
  keywords: '일상물, 판타지, 소규모, 느린 호흡, 자유 관계',
  cta: '디스코드 입장하기',
  ctaUrl: 'https://discord.com/',
  rules: '서로의 캐릭터와 설정을 존중해요.\n불쾌한 표현, 혐오 표현은 금지예요.\n원치 않는 관계 설정을 강요하지 않아요.\n로그와 일러스트는 허락 없이 퍼 가지 않아요.\n연재가 어려울 땐 운영진에게 미리 알려 주세요.',
  steps: '디스코드 서버에 입장해요.\n#가입-안내 채널에서 양식을 확인해요.\n캐릭터 프로필을 작성해서 올려요.\n운영진 확인 후 역할이 부여되면 입주 완료!',
  members: '운영진 하나 | 마을 관리인 | https://twitter.com/\n운영진 두리 | 사건 담당 | https://twitter.com/\n서하 | 별지기 · 천문대 | \n하윤 | 정비사 · 천문대 | \n도겸 | 은퇴한 기사 | \n미소 | 빵집 주인 | ',
  notices: '2026-11-01 | 11월 마을 축제 사건 연재 시작\n2026-11-15 | 가을 합작 일러스트 모집 마감\n2026-12-01 | 신규 주민 모집 재개',
  faq: '꼭 오리지널 캐릭터만 가능한가요? | 네, 자캐(오리지널 캐릭터)만 받고 있어요.\n활동은 얼마나 해야 하나요? | 정해진 분량은 없어요. 무리하지 않는 선에서 편하게 참여해 주세요.\n미성년자도 가입할 수 있나요? | 서버 규칙에 따라 연령 안내가 있으니 가입 전에 꼭 확인해 주세요.',
  owner: '달무리 마을 운영진',
  links: '트위터(X) | https://twitter.com/\n공지 모음 | https://www.postype.com/',
  bg: PALETTES[0].bg,
  card: PALETTES[0].card,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  accent2: PALETTES[0].accent2,
  displayFont: 'jua',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '커뮤니티', open: true, items: [
    { key: 'name', label: '커뮤니티 이름', type: 'text' },
    { key: 'slogan', label: '슬로건', type: 'text' },
    { key: 'status', label: '모집 상태', type: 'text', hint: '예: 멤버 모집 중 / 모집 마감. 비우면 숨겨요.' },
    { key: 'banner', label: '대표 이미지', type: 'image', theme: true, hint: '위쪽에 크게 깔려요. 가로로 긴 이미지가 좋아요.' },
    { key: 'keywords', label: '세계관 키워드', type: 'text', hint: '쉼표(,)로 구분해요.' },
    { key: 'cta', label: '입장 버튼 문구', type: 'text', half: true },
    { key: 'ctaUrl', label: '입장 링크', type: 'text', half: true },
  ] },
  { group: '세계관', open: true, items: [
    { key: 'world', label: '세계관 소개', type: 'textarea', rows: 7, hint: '빈 줄로 문단을 나눠요.' },
  ] },
  { group: '규칙과 가입', open: true, items: [
    { key: 'rules', label: '규칙', type: 'textarea', rows: 6, hint: '한 줄에 하나. 번호가 자동으로 붙어요.' },
    { key: 'steps', label: '가입 방법', type: 'textarea', rows: 5, hint: '한 줄에 하나. 순서대로 번호가 붙어요.' },
  ] },
  { group: '멤버', items: [
    { key: 'members', label: '멤버 목록', type: 'textarea', rows: 7, hint: '한 줄에 하나: 이름 | 역할·한마디 | 링크(선택) (최대 16명)' },
  ] },
  { group: '공지와 질문', items: [
    { key: 'notices', label: '공지·일정', type: 'textarea', rows: 4, hint: '한 줄에 하나: 날짜 | 내용 (최대 8개)' },
    { key: 'faq', label: '자주 묻는 질문', type: 'textarea', rows: 5, hint: '한 줄에 하나: 질문 | 답 (최대 8개)' },
  ] },
  { group: '푸터', items: [
    { key: 'owner', label: '운영 주체', type: 'text' },
    { key: 'links', label: '링크', type: 'textarea', rows: 3, hint: '한 줄에 하나: 이름 | 주소' },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', '배경'], ['card', '카드'], ['fg', '글자']] },
    { type: 'colors', keys: [['accent', '포인트'], ['accent2', '보조 포인트']] },
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: koOptions(['jua', 'blackhan', 'gowunbatang', 'nanumpen', 'galmuri', 'pretendard']) },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: koOptions(['pretendard', 'gowundodum', 'gowunbatang', 'galmurimono']) },
  ] },
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const bg = hex(c.bg, '#12101f'), card = hex(c.card, '#1c1932'), fg = hex(c.fg, '#eeeaff')
  const accent = hex(c.accent, '#8b7bff'), accent2 = hex(c.accent2, '#ff7ac8')
  const name = c.name || '커뮤니티'
  const banner = imgSrc(c.banner)
  const paras = String(c.world || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const rules = lines(c.rules, 14), steps = lines(c.steps, 8)
  const members = lines(c.members, 16).map(cols)
  const notices = lines(c.notices, 8).map(cols)
  const faq = lines(c.faq, 8).map(cols)
  const links = lines(c.links, 8).map(cols)
  const nav = [
    paras.length && ['세계관', 'world'], rules.length && ['규칙', 'rules'], steps.length && ['가입 방법', 'join'],
    members.length && ['멤버', 'members'], notices.length && ['공지', 'notices'], faq.length && ['질문', 'faq'],
  ].filter(Boolean)
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — 자캐 커뮤니티</title>
<meta name="description" content="${esc(c.slogan)}">
${fontHead(fontCss, '')}
<style>
:root{--bg:${bg};--card:${card};--fg:${fg};--accent:${accent};--accent2:${accent2};--display:${koStack(c.displayFont)};--body:${koStack(c.bodyFont)};--dim:color-mix(in srgb,var(--fg) 64%,var(--bg));--line:color-mix(in srgb,var(--fg) 14%,var(--bg))}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 16px/1.75 var(--body);overflow-x:hidden;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.bar{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:20px;padding:12px clamp(16px,4vw,40px);background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.bar b{font:400 22px/1 var(--display);margin-right:auto}
.bar nav{display:flex;gap:clamp(10px,2vw,22px)}
.bar nav a{text-decoration:none;font-size:14.5px;color:var(--dim);font-weight:600}
.bar nav a:hover{color:var(--fg)}
.go{padding:8px 18px;border-radius:99px;background:var(--accent);color:var(--bg);font-weight:700;font-size:14px;text-decoration:none;white-space:nowrap}
.hero{position:relative;overflow:hidden;padding:clamp(48px,9vw,120px) clamp(16px,4vw,40px) clamp(40px,6vw,80px);text-align:center;isolation:isolate}
.hero::before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(60% 80% at 20% 10%,color-mix(in srgb,var(--accent) 38%,transparent),transparent 70%),radial-gradient(50% 70% at 85% 30%,color-mix(in srgb,var(--accent2) 30%,transparent),transparent 70%)}
.hero img.banner{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.hero.has-img::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 40%,transparent),var(--bg))}
.badge{display:inline-flex;align-items:center;gap:8px;padding:5px 16px;border-radius:99px;border:1.5px solid var(--accent);background:color-mix(in srgb,var(--bg) 60%,transparent);font-size:14px;font-weight:700;margin-bottom:20px}
.badge::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--accent2);animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.6);opacity:.5}}
.hero h1{margin:0 auto 14px;font:400 clamp(44px,9vw,110px)/1.02 var(--display);letter-spacing:-.02em;max-width:14ch;text-wrap:balance}
.hero p.slogan{margin:0 auto 26px;max-width:36ch;font-size:clamp(16px,2vw,21px);color:var(--dim)}
.tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;list-style:none;margin:0 0 28px;padding:0}
.tags li{padding:3px 14px;border-radius:99px;background:color-mix(in srgb,var(--card) 80%,transparent);border:1px solid var(--line);font-size:14px}
.big{display:inline-block;padding:15px 34px;border-radius:99px;background:var(--fg);color:var(--bg);font-weight:800;font-size:16px;text-decoration:none;transition:transform .15s,background .15s}
.big:hover{transform:translateY(-2px);background:var(--accent)}
.sec{max-width:980px;margin:0 auto;padding:clamp(40px,6vw,80px) clamp(16px,4vw,40px) 0}
.sec h2{margin:0 0 20px;font:400 clamp(28px,4vw,42px)/1.15 var(--display)}
.world p{margin:0 0 1em;max-width:64ch}
.rules{margin:0;padding:0;list-style:none;counter-reset:r;display:grid;gap:10px}
.rules li{counter-increment:r;display:flex;gap:16px;align-items:flex-start;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 18px}
.rules li::before{content:counter(r);flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-weight:800;font-size:14px}
.steps{margin:0;padding:0;list-style:none;counter-reset:s;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:14px}
.steps li{counter-increment:s;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px 20px}
.steps li::before{content:counter(s);display:block;font:400 38px/1 var(--display);color:var(--accent2);margin-bottom:8px}
.members{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:12px;list-style:none;margin:0;padding:0}
.members li{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:12px 16px}
.members i{flex:0 0 44px;height:44px;border-radius:50%;display:grid;place-items:center;font:400 20px var(--display);font-style:normal;color:var(--bg)}
.members li:nth-child(3n+1) i{background:var(--accent)}.members li:nth-child(3n+2) i{background:var(--accent2)}.members li:nth-child(3n) i{background:color-mix(in srgb,var(--accent) 50%,var(--accent2))}
.members b{display:block;font-size:16px;line-height:1.3}
.members span{font-size:13px;color:var(--dim)}
.members li:has(.mlink){padding:0}
.mlink{display:flex;align-items:center;gap:12px;padding:12px 16px;text-decoration:none;border-radius:18px;width:100%}
.mlink:hover b{text-decoration:underline}
.notices{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.notices li{display:flex;gap:14px;align-items:baseline;padding:12px 18px;background:var(--card);border-radius:14px;border:1px solid var(--line)}
.notices time{flex:0 0 auto;font-size:13px;font-weight:800;color:var(--accent2)}
details{border-bottom:1px solid var(--line);padding:14px 0}
summary{cursor:pointer;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:12px}
summary::after{content:"+";color:var(--accent)}
details[open] summary::after{content:"–"}
details p{margin:8px 0 0;color:var(--dim)}
footer{max-width:980px;margin:clamp(48px,7vw,96px) auto 0;padding:24px clamp(16px,4vw,40px) 40px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px 24px;color:var(--dim);font-size:13.5px}
footer ul{display:flex;gap:16px;list-style:none;margin:0;padding:0}
@media(max-width:760px){.bar nav{display:none}}
@media(prefers-reduced-motion:reduce){.badge::before{animation:none}.big{transition:none}html{scroll-behavior:auto}}
</style>
</head>
<body>
<div class="bar"><b>${esc(name)}</b><nav aria-label="바로가기">${nav.map(([l, id]) => `<a href="#${id}">${esc(l)}</a>`).join('')}</nav><a class="go" href="${esc(safeUrl(c.ctaUrl))}" target="_blank" rel="noopener noreferrer">입장</a></div>
<header class="hero${banner ? ' has-img' : ''}">
  ${banner ? `<img class="banner" src="${banner}" alt="">` : ''}
  ${c.status ? `<span class="badge">${esc(c.status)}</span>` : ''}
  <h1>${esc(name)}</h1>
  ${c.slogan ? `<p class="slogan">${esc(c.slogan)}</p>` : ''}
  ${list(c.keywords).length ? `<ul class="tags">${list(c.keywords).map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
  <a class="big" href="${esc(safeUrl(c.ctaUrl))}" target="_blank" rel="noopener noreferrer">${esc(c.cta)}</a>
</header>
${paras.length ? `<section class="sec world" id="world"><h2>세계관</h2>${paras.map((p) => `<p>${multi(p)}</p>`).join('')}</section>` : ''}
${rules.length ? `<section class="sec" id="rules"><h2>마을 규칙</h2><ol class="rules">${rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ol></section>` : ''}
${steps.length ? `<section class="sec" id="join"><h2>가입 방법</h2><ol class="steps">${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></section>` : ''}
${members.length ? `<section class="sec" id="members"><h2>멤버</h2><ul class="members">${members.map(([n, r, u]) => { const inner = `<i aria-hidden="true">${esc(initial(n))}</i><div><b>${esc(n)}</b>${r ? `<span>${esc(r)}</span>` : ''}</div>`; return `<li>${u && safeUrl(u) !== '#' ? `<a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer" class="mlink">${inner}</a>` : inner}</li>` }).join('')}</ul></section>` : ''}
${notices.length ? `<section class="sec" id="notices"><h2>공지와 일정</h2><ul class="notices">${notices.map(([d, t]) => `<li><time>${esc(d)}</time><span>${esc(t || '')}</span></li>`).join('')}</ul></section>` : ''}
${faq.length ? `<section class="sec" id="faq"><h2>자주 묻는 질문</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a || '')}</p></details>`).join('')}</section>` : ''}
<footer><span>${c.owner ? `© ${esc(c.owner)}` : esc(name)}</span>${links.length ? `<ul>${links.map(([l, u]) => `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>` : ''}</footer>
</body>
</html>
`
}

export default {
  id: 'community',
  group: '덕질',
  name: '자캐 커뮤니티',
  blurb: '세계관, 규칙, 가입 방법, 멤버 목록, 공지, 자주 묻는 질문까지 갖춘 커뮤니티 사이트.',
  tag: '커뮤니티',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.displayFont, x.bodyFont] },
}
