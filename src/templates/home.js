import { koOptions } from '../fonts/ko-registry.js'
import { cols, esc, imgSrc, imgs, jsonForScript, lines, multi, safeUrl, ymd } from './util.js'
import { fontsOf, galleryHtml, phHtml, shell } from './kobase.js'

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
  tags: '자캐/글/그림/별',
  oshi: '이서하',
  oshiNote: '내 첫 번째 아이. 새벽 천문대의 별지기예요.',
  oshiImage: '',
  ddayLabel: '자캐 생일까지',
  dday: '2027-01-01',
  guestbook: '',
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
  stickers: true,
}

const fields = [
  { group: '프로필', open: true, items: [
    { key: 'nick', label: '닉네임', type: 'text' },
    { key: 'bio', label: '한 줄 소개', type: 'text' },
    { key: 'avatar', label: '프로필 이미지', type: 'image', theme: true },
    { key: 'status', label: '지금 하는 덕질', type: 'text', hint: '비우면 숨겨요.' },
    { key: 'tags', label: '키워드 태그', type: 'text', hint: '/로 구분 (최대 8개)' },
    { key: 'marquee', label: '흐르는 공지', type: 'text', hint: '비우면 숨겨요.' },
  ] },
  { group: '최애 소개', items: [
    { key: 'oshi', label: '최애 이름', type: 'text', hint: '비우면 숨겨요.' },
    { key: 'oshiNote', label: '최애 한마디', type: 'textarea', rows: 3 },
    { key: 'oshiImage', label: '최애 일러스트', type: 'image' },
  ] },
  { group: '디데이·방명록', items: [
    { key: 'ddayLabel', label: '디데이 이름', type: 'text', hint: '예: 자캐 생일까지, 합작 마감까지' },
    { key: 'dday', label: '디데이 날짜', type: 'date', hint: '비우면 숨겨요. 지나면 D+로 바뀌어요.' },
    { key: 'guestbook', label: '방명록·익명 질문 주소', type: 'text', hint: '예: 페이지를 공유할 수 있는 방명록 서비스 주소. 비우면 숨겨요.' },
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
    { key: 'displayFont', label: '제목 폰트', type: 'select', options: koOptions(['jua', 'blackhan', 'nanumpen', 'galmuri', 'gowunbatang', 'pretendard']) },
    { key: 'bodyFont', label: '본문 폰트', type: 'select', options: koOptions(['pretendard', 'gowundodum', 'gowunbatang', 'galmurimono']) },
    { key: 'dots', label: '배경 물방울 무늬', type: 'check' },
    { key: 'stickers', label: '반짝이 스티커 장식', type: 'check' },
  ] },
]

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cfg.dday || ''), el = document.getElementById('dd');
  if (!m || !el) return;
  var t = new Date(+m[1], +m[2] - 1, +m[3]), n = new Date(), today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  var diff = Math.round((t - today) / 86400000);
  el.textContent = diff === 0 ? 'D-DAY' : diff > 0 ? 'D-' + diff : 'D+' + (-diff);
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const nick = c.nick || '닉네임'
  const avatar = imgSrc(c.avatar), oshiImg = imgSrc(c.oshiImage)
  const links = lines(c.links, 10).map(cols)
  const favs = lines(c.favs, 10).map(cols)
  const rules = lines(c.rules, 8)
  const tags = String(c.tags || '').split('/').map((x) => x.trim()).filter(Boolean).slice(0, 8)
  const dday = ymd(c.dday)
  const guest = c.guestbook ? safeUrl(c.guestbook) : ''
  const paras = String(c.about || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const d = new Date()
  const updated = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  const win = (title, body, cls = '') => `<section class="win ${cls}"><div class="tb"><i></i><i></i><i></i><span>${esc(title)}</span></div><div class="bd">${body}</div></section>`
  const css = `
body{${c.dots ? 'background-image:radial-gradient(circle,color-mix(in srgb,var(--accent) 30%,transparent) 2.5px,transparent 3px);background-size:26px 26px;' : ''}}
.page{max-width:880px;display:grid;gap:clamp(14px,2.4vw,22px);padding-bottom:40px;position:relative}
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
.av .ph b{font-size:clamp(44px,8vw,70px)}
.me h1{margin:0;font:400 clamp(34px,6vw,58px)/1.05 var(--display)}
.me p{margin:6px 0 0;color:var(--dim)}
.tg{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0;padding:0}
.tg li{list-style:none;font-size:13px;font-weight:700;padding:1px 12px;border-radius:99px;border:2px solid var(--fg);background:color-mix(in srgb,var(--accent2) 40%,var(--card))}
.tg li::before{content:"#"}
.now{display:inline-block;margin-top:12px;padding:3px 14px;border-radius:99px;background:var(--accent);color:var(--card);font-weight:800;font-size:13.5px;border:2px solid var(--fg)}
.duo{display:grid;grid-template-columns:2fr 1fr;gap:inherit}
.oshi{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:center}
.oshi .pic{aspect-ratio:1;border-radius:16px;border:3px solid var(--fg);position:relative;overflow:hidden;background:var(--accent2)}
.oshi .pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.oshi .pic .ph b{font-size:52px}
.oshi h2{margin:0;font:400 28px/1.2 var(--display)}
.oshi p{margin:4px 0 0;color:var(--dim);font-size:15px}
.dd{text-align:center}
.dd b{display:block;font:400 clamp(40px,7vw,60px)/1.1 var(--display);color:var(--accent);-webkit-text-stroke:1.5px var(--fg)}
.dd span{font-weight:800;font-size:14px}
.btns{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px;list-style:none;margin:0;padding:0}
.btns a{display:block;text-align:center;padding:10px 12px;border:3px solid var(--fg);border-radius:14px;background:var(--card);font-weight:800;text-decoration:none;box-shadow:4px 4px 0 var(--fg);transition:transform .12s,box-shadow .12s}
.btns li:nth-child(odd) a{background:color-mix(in srgb,var(--accent2) 45%,var(--card))}
.btns .gb a{background:var(--accent);color:var(--card)}
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
.gal figure{margin:0 0 10px;border:3px solid var(--fg);border-radius:14px}
.st{position:absolute;pointer-events:none;color:var(--accent);font-size:28px;line-height:1}
.st1{top:-4px;right:2%;transform:rotate(14deg)}.st2{top:34%;left:-26px;color:var(--accent2);-webkit-text-stroke:1.5px var(--fg)}.st3{bottom:8%;right:-22px;transform:rotate(-12deg)}
footer{padding-top:6px}
@media(max-width:620px){.me{grid-template-columns:1fr;text-align:center;justify-items:center}.tg{justify-content:center}.duo{grid-template-columns:1fr}.oshi{grid-template-columns:90px 1fr}}
@media(max-width:1000px){.st{display:none}}
@media(prefers-reduced-motion:reduce){.mq div{animation:none}.btns a{transition:none}}
`
  const gallerySec = imgs(c.gallery, 8).length ? win('gallery', galleryHtml(c.gallery, `${nick}의 그림`).replace('class="sec"', '').replace(/<h2>.*?<\/h2>/, '')) : ''
  const body = `<div class="page">
  ${c.stickers ? '<span class="st st1" aria-hidden="true">✦</span><span class="st st2" aria-hidden="true">★</span><span class="st st3" aria-hidden="true">✦</span>' : ''}
  ${c.marquee ? `<div class="mq" role="marquee" aria-label="공지"><div><span>${esc(c.marquee)}</span><span aria-hidden="true">${esc(c.marquee)}</span><span aria-hidden="true">${esc(c.marquee)}</span><span aria-hidden="true">${esc(c.marquee)}</span></div></div>` : ''}
  ${win(`${nick}.profile`, `<div class="me"><div class="av">${avatar ? `<img src="${avatar}" alt="${esc(nick)} 프로필 이미지">` : phHtml(nick)}</div><div><h1>${esc(nick)}</h1>${c.bio ? `<p>${esc(c.bio)}</p>` : ''}${tags.length ? `<ul class="tg">${tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}${c.status ? `<span class="now">지금: ${esc(c.status)}</span>` : ''}</div></div>`)}
  ${c.oshi || dday ? `<div class="duo">${c.oshi ? win('oshi.png', `<div class="oshi"><div class="pic">${oshiImg ? `<img src="${oshiImg}" alt="${esc(c.oshi)} 일러스트">` : phHtml(c.oshi)}</div><div><h2>${esc(c.oshi)}</h2>${c.oshiNote ? `<p>${esc(c.oshiNote)}</p>` : ''}</div></div>`) : ''}${dday ? win('d-day', `<div class="dd"><b id="dd">D-?</b><span>${esc(c.ddayLabel)}</span></div>`) : ''}</div>` : ''}
  ${links.length || guest ? win('links.exe', `<ul class="btns">${links.map(([l, u]) => `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}${guest && guest !== '#' ? `<li class="gb"><a href="${esc(guest)}" target="_blank" rel="noopener noreferrer">방명록 남기기</a></li>` : ''}</ul>`) : ''}
  ${favs.length ? win('favorites.txt', `<ul class="favs">${favs.map(([k, n, t]) => `<li><em>${esc(k)}</em><b>${esc(n || '')}</b>${t ? `<span>${esc(t)}</span>` : ''}</li>`).join('')}</ul>`) : ''}
  ${paras.length ? win('about.txt', paras.map((p) => `<p>${multi(p)}</p>`).join('')) : ''}
  ${gallerySec}
  ${rules.length ? win('읽어 주세요', `<ul class="rules">${rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`) : ''}
  <footer>마지막 수정 ${updated} · ${esc(nick)}</footer>
</div>`
  return shell({ c, d: PALETTES[0], title: `${nick}의 덕질 홈`, desc: c.bio, fontCss, css, body, script: dday ? RUNTIME : '', cfg: dday ? jsonForScript({ dday }) : '' })
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
  fonts: fontsOf(defaults),
}
