import { koOptions, koStack } from '../fonts/ko-registry.js'
import { cols, esc, fontHead, hex, imgSrc, imgs, initial, lines, multi, safeUrl } from './util.js'

// Template: 덕질 홈 — a retro "window" personal homepage (profile, links, favourites, notes).
const PALETTES = [
  { id: 'candy', label: '캔디 팝', bg: '#ffe4f1', card: '#ffffff', fg: '#3a1b2e', accent: '#ff5ca8', accent2: '#7fd6ff' },
  { id: 'y2k', label: '사이버 Y2K', bg: '#0c1030', card: '#161b4a', fg: '#e8f0ff', accent: '#39ffd0', accent2: '#ff4fd8' },
  { id: 'lemon', label: '레몬 소다', bg: '#fff9d6', card: '#ffffff', fg: '#3a2f08', accent: '#ffb300', accent2: '#6fd3a8' },
  { id: 'ink', label: '먹물', bg: '#f1efe9', card: '#ffffff', fg: '#16151a', accent: '#16151a', accent2: '#e24a3b' },
]

const defaults = {
  nick: '별조각',
  bio: '자캐와 이야기 만드는 걸 좋아하는 덕후',
  avatar: '',
  status: '새 자캐 설정 정리 중',
  marquee: '새 글은 트위터에 올라와요 · 자캐 커미션은 11월부터 다시 받아요 · 편하게 말 걸어 주세요',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/\n픽시브 | https://www.pixiv.net/\n디스코드 | https://discord.com/\n블로그 | https://www.tistory.com/',
  favs: '자캐 | 이서하 | 내 첫 번째 아이, 새벽 천문대의 별지기\n소설 | 새벽의 도서관 | 읽을 때마다 다른 문장이 보여요\n게임 | 별빛 정원 | 힐링하고 싶을 때 켜는 게임\n음악 | 밤 산책 플레이리스트 | 작업할 때 무한 반복',
  about: '안녕하세요! 오리지널 캐릭터(자캐)를 만들고 그리는 걸 좋아해요.\n이 페이지는 제가 좋아하는 것들을 모아 둔 작은 집이에요. 편하게 구경하고 가세요.',
  rules: '자캐 이미지 무단 도용, 트레이싱, AI 학습 사용은 금지예요.\n리트윗, 감상, 교류는 언제나 환영이에요.\n답장이 조금 늦을 수 있어요.',
  gallery: [],
  bg: PALETTES[0].bg,
  card: PALETTES[0].card,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  accent2: PALETTES[0].accent2,
  displayFont: 'jua',
  bodyFont: 'pretendard',
  dots: true,
}

const fields = [
  { group: '프로필', open: true, items: [
    { key: 'nick', label: '닉네임', type: 'text' },
    { key: 'bio', label: '한 줄 소개', type: 'text' },
    { key: 'avatar', label: '프로필 이미지', type: 'image', theme: true },
    { key: 'status', label: '지금 하는 덕질', type: 'text', hint: '비우면 숨겨요.' },
    { key: 'marquee', label: '흐르는 공지', type: 'text', hint: '비우면 숨겨요.' },
  ] },
  { group: '링크', open: true, items: [
    { key: 'links', label: '링크 버튼', type: 'textarea', rows: 6, hint: '한 줄에 하나: 이름 | 주소 (최대 10개)' },
  ] },
  { group: '좋아하는 것', open: true, items: [
    { key: 'favs', label: '최애 목록', type: 'textarea', rows: 6, hint: '한 줄에 하나: 분류 | 이름 | 한마디 (최대 10개)' },
  ] },
  { group: '소개와 안내', items: [
    { key: 'about', label: '자기소개', type: 'textarea', rows: 5, hint: '빈 줄로 문단을 나눠요.' },
    { key: 'rules', label: '주의사항', type: 'textarea', rows: 4, hint: '한 줄에 하나' },
  ] },
  { group: '갤러리', items: [
    { key: 'gallery', label: '그림 모음', type: 'images', max: 8, hint: '최대 8장' },
  ] },
  { group: '스타일', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', '배경'], ['card', '창 배경'], ['fg', '글자']] },
    { type: 'colors', keys: [['accent', '포인트'], ['accent2', '보조 포인트']] },
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: koOptions(['jua', 'blackhan', 'nanumpen', 'gowunbatang', 'pretendard']) },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: koOptions(['pretendard', 'gowundodum', 'gowunbatang']) },
    { key: 'dots', label: '배경 물방울 무늬', type: 'check' },
  ] },
]

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const bg = hex(c.bg, '#ffe4f1'), card = hex(c.card, '#ffffff'), fg = hex(c.fg, '#3a1b2e')
  const accent = hex(c.accent, '#ff5ca8'), accent2 = hex(c.accent2, '#7fd6ff')
  const nick = c.nick || '닉네임'
  const avatar = imgSrc(c.avatar)
  const links = lines(c.links, 10).map(cols)
  const favs = lines(c.favs, 10).map(cols)
  const rules = lines(c.rules, 8)
  const gallery = imgs(c.gallery, 8)
  const paras = String(c.about || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const d = new Date()
  const updated = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  const win = (title, body, cls = '') => `<section class="win ${cls}"><div class="tb"><i></i><i></i><i></i><span>${esc(title)}</span></div><div class="bd">${body}</div></section>`
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(nick)}의 덕질 홈</title>
<meta name="description" content="${esc(c.bio)}">
${fontHead(fontCss, '')}
<style>
:root{--bg:${bg};--card:${card};--fg:${fg};--accent:${accent};--accent2:${accent2};--display:${koStack(c.displayFont)};--body:${koStack(c.bodyFont)};--dim:color-mix(in srgb,var(--fg) 62%,var(--card))}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg)${c.dots ? ' radial-gradient(circle,color-mix(in srgb,var(--accent) 30%,transparent) 2.5px,transparent 3px) 0 0/26px 26px' : ''};color:var(--fg);font:400 16px/1.7 var(--body);overflow-x:hidden;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}
:focus-visible{outline:3px solid var(--fg);outline-offset:3px}
.page{max-width:880px;margin:0 auto;padding:clamp(16px,4vw,48px) clamp(14px,3vw,24px) 40px;display:grid;gap:clamp(14px,2.4vw,22px)}
.mq{overflow:hidden;white-space:nowrap;border:3px solid var(--fg);background:var(--accent);color:var(--card);border-radius:14px;box-shadow:5px 5px 0 var(--fg);font-weight:800;font-size:14.5px}
.mq div{display:inline-block;padding:7px 0;animation:mq 28s linear infinite}
.mq span{padding:0 36px}
@keyframes mq{to{transform:translateX(-50%)}}
.win{background:var(--card);border:3px solid var(--fg);border-radius:18px;box-shadow:6px 6px 0 var(--fg);overflow:hidden}
.tb{display:flex;align-items:center;gap:7px;padding:8px 14px;background:var(--accent2);border-bottom:3px solid var(--fg);font-weight:800;font-size:14px}
.tb i{width:12px;height:12px;border-radius:50%;background:var(--card);border:2px solid var(--fg)}
.tb span{margin-left:6px}
.bd{padding:clamp(14px,2.4vw,24px)}
.me{display:grid;grid-template-columns:auto 1fr;gap:clamp(14px,3vw,28px);align-items:center}
.av{width:clamp(96px,18vw,150px);aspect-ratio:1;border-radius:50%;border:3px solid var(--fg);background:var(--accent2);overflow:hidden;position:relative;box-shadow:4px 4px 0 var(--accent)}
.av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.av span{position:absolute;inset:0;display:grid;place-items:center;font:400 clamp(44px,8vw,70px)/1 var(--display);color:var(--fg)}
.me h1{margin:0;font:400 clamp(34px,6vw,58px)/1.05 var(--display)}
.me p{margin:6px 0 0;color:var(--dim)}
.now{display:inline-block;margin-top:12px;padding:3px 14px;border-radius:99px;background:var(--accent);color:var(--card);font-weight:800;font-size:13.5px;border:2px solid var(--fg)}
.btns{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px;list-style:none;margin:0;padding:0}
.btns a{display:block;text-align:center;padding:10px 12px;border:3px solid var(--fg);border-radius:14px;background:var(--card);font-weight:800;text-decoration:none;box-shadow:4px 4px 0 var(--fg);transition:transform .12s,box-shadow .12s}
.btns li:nth-child(odd) a{background:color-mix(in srgb,var(--accent2) 45%,var(--card))}
.btns a:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--fg)}
.favs{display:grid;gap:10px;list-style:none;margin:0;padding:0}
.favs li{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;align-items:baseline;padding:10px 14px;border:2px dashed var(--fg);border-radius:14px}
.favs em{font-style:normal;font-weight:800;font-size:12.5px;padding:1px 10px;border-radius:99px;background:var(--accent);color:var(--card);grid-row:1/3;align-self:center}
.favs b{font-size:17px}
.favs span{grid-column:2;color:var(--dim);font-size:14.5px}
.bd p{margin:0 0 .9em}
.bd p:last-child{margin-bottom:0}
.rules{margin:0;padding-left:1.2em}
.rules li::marker{color:var(--accent)}
.gal{columns:3 180px;column-gap:10px}
.gal figure{margin:0 0 10px;break-inside:avoid;border:3px solid var(--fg);border-radius:14px;overflow:hidden}
.gal img{display:block;width:100%;height:auto}
footer{text-align:center;font-size:13px;color:var(--dim);padding-top:6px}
@media(max-width:560px){.me{grid-template-columns:1fr;text-align:center;justify-items:center}}
@media(prefers-reduced-motion:reduce){.mq div{animation:none}.btns a{transition:none}}
</style>
</head>
<body>
<div class="page">
  ${c.marquee ? `<div class="mq" role="marquee" aria-label="공지"><div><span>${esc(c.marquee)}</span><span aria-hidden="true">${esc(c.marquee)}</span><span aria-hidden="true">${esc(c.marquee)}</span><span aria-hidden="true">${esc(c.marquee)}</span></div></div>` : ''}
  ${win(`${nick}.profile`, `<div class="me"><div class="av">${avatar ? `<img src="${avatar}" alt="${esc(nick)} 프로필 이미지">` : `<span aria-hidden="true">${esc(initial(nick))}</span>`}</div><div><h1>${esc(nick)}</h1>${c.bio ? `<p>${esc(c.bio)}</p>` : ''}${c.status ? `<span class="now">지금: ${esc(c.status)}</span>` : ''}</div></div>`)}
  ${links.length ? win('links.exe', `<ul class="btns">${links.map(([l, u]) => `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>`) : ''}
  ${favs.length ? win('favorites.txt', `<ul class="favs">${favs.map(([k, n, t]) => `<li><em>${esc(k)}</em><b>${esc(n || '')}</b>${t ? `<span>${esc(t)}</span>` : ''}</li>`).join('')}</ul>`) : ''}
  ${paras.length ? win('about.txt', paras.map((p) => `<p>${multi(p)}</p>`).join('')) : ''}
  ${gallery.length ? win('gallery', `<div class="gal">${gallery.map((g, i) => `<figure><img src="${g}" alt="${esc(nick)}의 그림 ${i + 1}"></figure>`).join('')}</div>`) : ''}
  ${rules.length ? win('읽어 주세요', `<ul class="rules">${rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`) : ''}
  <footer>마지막 수정 ${updated} · ${esc(nick)}</footer>
</div>
</body>
</html>
`
}

export default {
  id: 'home',
  group: '덕질',
  name: '덕질 홈',
  blurb: '레트로 윈도우 감성의 개인 홈페이지. 프로필, 링크 모음, 최애 목록, 주의사항까지.',
  tag: '개인 홈',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => { const x = { ...defaults, ...c }; return [x.displayFont, x.bodyFont] },
}
