import { cols, esc, imgSrc, initial, jsonForScript, lines, list, multi, safeUrl } from './util.js'
import { footerGroup, footerHtml, fontsOf, noticeHtml, paletteColors, shell, styleGroup, whenKo } from './kobase.js'

// Template: 합작·이벤트 모집 — recruiting page with a deadline countdown, schedule, roles, rules and a participant list.
const PALETTES = [
  { id: 'soda', label: '여름 소다', bg: '#e9f8ff', card: '#ffffff', fg: '#10303d', accent: '#13a3d6', accent2: '#ffe27a' },
  { id: 'maple', label: '가을 단풍', bg: '#fff1e4', card: '#fffaf3', fg: '#3a1d10', accent: '#d9531e', accent2: '#f3c777' },
  { id: 'winter', label: '겨울 밤', bg: '#0e1429', card: '#18203d', fg: '#e8edff', accent: '#8fb5ff', accent2: '#3b4a85' },
  { id: 'spring', label: '봄 벚꽃', bg: '#fff3f6', card: '#ffffff', fg: '#3c1f2a', accent: '#f0608a', accent2: '#ffd3e0' },
]

const defaults = {
  name: '달무리 마을 가을 합작',
  tagline: '우리 자캐들이 함께 보내는 가을 하루',
  open: true,
  banner: '',
  intro: '달무리 마을 자캐들의 가을 하루를 모아 만드는 합작이에요.\n그림, 글, 굿즈 디자인 등 자유롭게 참여할 수 있어요. 한 분이 여러 캐릭터로 참여해도 괜찮아요.',
  deadline: '2026-12-20T23:59',
  roles: '일러스트/글(단편)/만화/굿즈 디자인/BGM',
  conditions: '오리지널 캐릭터(자캐)로만 참여할 수 있어요.\n주제는 "가을 하루"예요. 분위기는 자유예요.\n마감일까지 완성본을 제출할 수 있는 분만 신청해 주세요.\n타인을 불쾌하게 하는 표현은 제외돼요.',
  steps: '신청 폼에서 닉네임과 참여 분야를 적어요.\n확정 안내를 받으면 디스코드 합작 채널에 입장해요.\n러프나 초안을 공유하고 서로 응원해요.\n마감일까지 완성본을 제출해요.\n공개일에 함께 합작집을 공개해요.',
  schedule: '2026-11-01 | 참가 신청 시작\n2026-11-20 | 참가 확정 안내\n2026-12-10 | 러프·초안 공유\n2026-12-20 | 완성본 마감\n2027-01-05 | 합작집 공개',
  perks: '합작집 공개 페이지에 이름과 작품이 실려요.\n참여자 전원에게 합작 기념 배경화면을 드려요.\n참여 인증 배지를 프로필에 쓸 수 있어요.',
  goal: '8',
  people: '별조각 | 일러스트\n하늘 | 글\n민트 | 만화\n오렌지 | 굿즈 디자인',
  applyLabel: '참가 신청하기',
  applyUrl: 'https://forms.gle/',
  faq: '여러 분야로 참여해도 되나요? | 네, 신청서에 적어 주세요.\n마감을 못 지키면 어떻게 되나요? | 미리 알려 주시면 일정을 조율해 볼게요.\n미성년자도 참여할 수 있나요? | 가능해요. 다만 합작 채널 규칙을 꼭 읽어 주세요.',
  owner: '합작 주최진',
  notice: '제출된 작품의 저작권은 각 작가에게 있어요. 합작집에는 허락받은 작품만 실립니다.',
  links: '디스코드 | https://discord.com/\n트위터(X) | https://twitter.com/',
  ...paletteColors(PALETTES[0]),
  displayFont: 'jua',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '합작 정보', open: true, items: [
    { key: 'name', label: '합작 이름', type: 'text' },
    { key: 'tagline', label: '한 줄 소개', type: 'text' },
    { key: 'open', label: '지금 모집 중이에요', type: 'check' },
    { key: 'banner', label: '대표 이미지', type: 'image', theme: true, hint: '위쪽에 크게 깔려요. 가로로 긴 이미지가 좋아요.' },
    { key: 'intro', label: '소개글', type: 'textarea', rows: 5, hint: '빈 줄로 문단을 나눠요.' },
    { key: 'deadline', label: '마감 일시', type: 'datetime', hint: '카운트다운에 쓰여요. 비우면 숨겨요. 방문자의 시간대 기준이에요.' },
  ] },
  { group: '모집 내용', open: true, items: [
    { key: 'roles', label: '모집 분야', type: 'text', hint: '/로 구분해요.' },
    { key: 'conditions', label: '참여 조건', type: 'textarea', rows: 5, hint: '한 줄에 하나' },
    { key: 'perks', label: '참여 혜택', type: 'textarea', rows: 3, hint: '한 줄에 하나' },
  ] },
  { group: '진행', items: [
    { key: 'steps', label: '참여 방법', type: 'textarea', rows: 5, hint: '한 줄에 하나. 순서대로 번호가 붙어요.' },
    { key: 'schedule', label: '일정', type: 'textarea', rows: 5, hint: '한 줄에 하나: 날짜 | 내용 (최대 10개)' },
  ] },
  { group: '참가자', items: [
    { key: 'goal', label: '목표 인원', type: 'text', half: true, hint: '숫자만. 비우면 진행 막대를 숨겨요.' },
    { key: 'people', label: '참가자 목록', type: 'textarea', rows: 6, hint: '한 줄에 하나: 닉네임 | 분야 (최대 40명). 위에 인원수가 자동으로 표시돼요.' },
  ] },
  { group: '신청과 질문', items: [
    { key: 'applyLabel', label: '신청 버튼 문구', type: 'text', half: true },
    { key: 'applyUrl', label: '신청 링크', type: 'text', half: true },
    { key: 'faq', label: '자주 묻는 질문', type: 'textarea', rows: 4, hint: '한 줄에 하나: 질문 | 답 (최대 8개)' },
  ] },
  footerGroup,
  styleGroup(),
]

const RUNTIME = String.raw`
(function () {
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var box = document.getElementById('cd'), done = document.getElementById('cd-done');
  if (!box || !cfg.deadline) return;
  var target = new Date(cfg.deadline).getTime();
  if (isNaN(target)) return;
  function put(k, v) { var el = box.querySelector('[data-k="' + k + '"] b'); if (el) el.textContent = v; }
  function tick() {
    var left = target - Date.now();
    if (left <= 0) { box.hidden = true; if (done) done.hidden = false; return false; }
    var s = Math.floor(left / 1000);
    put('d', Math.floor(s / 86400)); put('h', Math.floor(s % 86400 / 3600)); put('m', Math.floor(s % 3600 / 60));
    return true;
  }
  if (tick() !== false) { var id = setInterval(function () { if (tick() === false) clearInterval(id); }, 20000); }
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const banner = imgSrc(c.banner)
  const w = whenKo(c.deadline)
  const roles = String(c.roles || '').split('/').map((s) => s.trim()).filter(Boolean)
  const conds = lines(c.conditions, 10), perks = lines(c.perks, 8), steps = lines(c.steps, 10)
  const sched = lines(c.schedule, 10).map(cols), people = lines(c.people, 40).map(cols), faq = lines(c.faq, 8).map(cols)
  const goalN = Math.max(0, Math.min(500, parseInt(c.goal, 10) || 0))
  const paras = String(c.intro || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const css = `
.page{max-width:960px}
.hero{position:relative;overflow:hidden;isolation:isolate;border-radius:32px;padding:clamp(32px,6vw,72px) clamp(20px,5vw,56px);text-align:center;background:var(--card);border:1.5px solid var(--line)}
.hero::before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(60% 90% at 15% 0,color-mix(in srgb,var(--accent) 30%,transparent),transparent 70%),radial-gradient(50% 80% at 90% 20%,color-mix(in srgb,var(--accent2) 55%,transparent),transparent 70%)}
.hero img.bn{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.hero.has-img::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,color-mix(in srgb,var(--card) 30%,transparent),var(--card))}
.badge{display:inline-flex;align-items:center;gap:8px;padding:4px 16px;border-radius:99px;background:var(--accent);color:var(--bg);font-weight:800;font-size:14px}
.badge.closed{background:var(--dim)}
.badge::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--bg)}
.hero h1{margin:16px 0 8px;font:400 clamp(34px,6.4vw,72px)/1.1 var(--display);letter-spacing:-.01em;text-wrap:balance}
.hero p.t{margin:0 auto;color:var(--dim);max-width:40ch;font-size:clamp(15px,1.8vw,19px)}
.cd{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:26px 0 8px}
.cd div{min-width:92px;padding:12px 14px 10px;border-radius:18px;background:var(--bg);border:2px solid var(--fg);text-align:center}
.cd b{display:block;font:800 clamp(30px,4.6vw,48px)/1 var(--body);font-variant-numeric:tabular-nums}
.cd small{font-size:12px;font-weight:700;color:var(--dim)}
.dl{margin:0;font-size:14px;color:var(--dim)}
.done{margin:20px 0 0;font:400 clamp(20px,3vw,30px)/1.2 var(--display);color:var(--accent)}
.cta{margin-top:22px}
.hero{box-shadow:8px 8px 0 color-mix(in srgb,var(--accent) 35%,transparent);border:2px solid var(--fg)}
.badge{letter-spacing:.14em}
.badge::before{animation:pl 1.8s ease-in-out infinite}
@keyframes pl{50%{transform:scale(1.5);opacity:.5}}
main,.page{counter-reset:sc}
.sec{counter-increment:sc}
.sec h2{display:flex;align-items:center;gap:12px;font-size:clamp(24px,3vw,34px)}
.sec h2::before{content:counter(sc,decimal-leading-zero);font:800 13px var(--body);letter-spacing:.1em;padding:3px 10px;border-radius:99px;background:var(--fg);color:var(--bg);transform:translateY(-2px)}
.sec h2::after{content:"";flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--line) 0 8px,transparent 8px 14px)}
.two h2::after{display:none}
.rulelist{list-style:none;padding:0;display:grid;gap:10px}
.rulelist li{position:relative;padding:12px 16px 12px 46px;background:var(--card);border:1px solid var(--line);border-radius:16px;margin:0}
.rulelist li::before{content:"✓";position:absolute;left:14px;top:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--bg);font-size:13px;font-weight:800}
#rules .perks li::before{content:"★";background:var(--accent2);color:var(--fg)}
.steps{counter-reset:s}
.steps li{border-top:5px solid var(--accent);padding:18px 18px 20px}
.steps li::before{font-size:44px;opacity:.9}
ul.sched{position:relative;padding-left:28px}
.sched::before{content:"";position:absolute;left:8px;top:10px;bottom:10px;width:3px;border-radius:2px;background:var(--accent);opacity:.5}
.sched li{position:relative}
.sched li::before{content:"";position:absolute;left:-26px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;background:var(--card);border:4px solid var(--accent)}
.people li.card{flex-direction:row;align-items:center;gap:12px;padding:10px 14px}
.people i{flex:0 0 40px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:800 17px var(--display);font-style:normal;background:var(--accent);color:var(--bg)}
.people li:nth-child(3n+2) i{background:var(--accent2);color:var(--fg)}
.people li:nth-child(3n) i{background:var(--fg);color:var(--bg)}
.people div{display:flex;flex-direction:column;line-height:1.35}
.goal{max-width:none}.goal div{height:16px;border:2px solid var(--fg);background:var(--card)}
.goal i{background:repeating-linear-gradient(45deg,var(--accent) 0 10px,color-mix(in srgb,var(--accent) 75%,#fff) 10px 20px)}
.intro p{margin:0 0 1em;max-width:64ch}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px}
.rulelist{margin:0;padding-left:1.3em}.rulelist li{margin-bottom:8px}.rulelist li::marker{color:var(--accent)}
.steps{margin:0;padding:0;list-style:none;counter-reset:s;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:12px}
.steps li{counter-increment:s;padding:16px 18px}
.steps li::before{content:counter(s);display:block;font:400 34px/1 var(--display);color:var(--accent);margin-bottom:6px}
.sched{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.sched li{display:flex;gap:14px;padding:11px 18px;align-items:baseline}
.sched time{font-weight:800;color:var(--accent);flex:0 0 auto;font-size:14px}
.people{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr));gap:10px}
.people li{padding:10px 16px;display:flex;flex-direction:column;line-height:1.4}
.people b{font-size:16px}.people span{font-size:13px;color:var(--dim)}
.goal{margin:0 0 16px;max-width:520px}.goal div{height:12px;border-radius:99px;background:color-mix(in srgb,var(--fg) 12%,var(--card));overflow:hidden}.goal i{display:block;height:100%;border-radius:99px;background:var(--accent)}.goal p{margin:6px 0 0;font-size:14px;color:var(--dim)}
.g0{width:0%}.g5{width:5%}.g10{width:10%}.g15{width:15%}.g20{width:20%}.g25{width:25%}.g30{width:30%}.g35{width:35%}.g40{width:40%}.g45{width:45%}.g50{width:50%}.g55{width:55%}.g60{width:60%}.g65{width:65%}.g70{width:70%}.g75{width:75%}.g80{width:80%}.g85{width:85%}.g90{width:90%}.g95{width:95%}.g100{width:100%}
.count{display:inline-block;margin-left:10px;font:800 15px var(--body);padding:2px 12px;border-radius:99px;background:var(--accent2);color:var(--fg);vertical-align:middle}
`
  const body = `<div class="page">
  <header class="hero${banner ? ' has-img' : ''}">
    ${banner ? `<img class="bn" src="${banner}" alt="">` : ''}
    <span class="badge${c.open ? '' : ' closed'}">${c.open ? '모집 중' : '모집 마감'}</span>
    <h1>${esc(c.name)}</h1>
    ${c.tagline ? `<p class="t">${esc(c.tagline)}</p>` : ''}
    ${w ? `<div class="cd" id="cd" role="timer" aria-label="마감까지 남은 시간"><div data-k="d"><b>--</b><small>일</small></div><div data-k="h"><b>--</b><small>시간</small></div><div data-k="m"><b>--</b><small>분</small></div></div><p class="dl">마감 ${esc(w.text)}</p><p class="done" id="cd-done" hidden>모집이 끝났어요. 함께해 주셔서 고마워요!</p>` : ''}
    ${c.open ? `<div class="cta"><a class="btn" href="${esc(safeUrl(c.applyUrl))}" target="_blank" rel="noopener noreferrer">${esc(c.applyLabel)}</a></div>` : ''}
  </header>
  ${paras.length ? `<section class="sec intro" id="intro"><h2>합작 소개</h2>${paras.map((p) => `<p>${multi(p)}</p>`).join('')}${roles.length ? `<ul class="chips">${roles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}</section>` : ''}
  ${conds.length || perks.length ? `<section class="sec two" id="rules">${conds.length ? `<div><h2>참여 조건</h2><ul class="rulelist">${conds.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}${perks.length ? `<div><h2>참여 혜택</h2><ul class="rulelist perks">${perks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}</section>` : ''}
  ${steps.length ? `<section class="sec" id="steps"><h2>참여 방법</h2><ol class="steps">${steps.map((s) => `<li class="card">${esc(s)}</li>`).join('')}</ol></section>` : ''}
  ${sched.length ? `<section class="sec" id="schedule"><h2>일정</h2><ul class="sched">${sched.map(([d, t]) => `<li class="card"><time>${esc(d)}</time><span>${esc(t || '')}</span></li>`).join('')}</ul></section>` : ''}
  ${people.length ? `<section class="sec" id="people"><h2>참가자<span class="count">${people.length}명</span></h2>${goalN ? `<div class="goal"><div><i class="g${Math.round(Math.min(100, people.length / goalN * 100) / 5) * 5}"></i></div><p>${people.length} / ${goalN}명${people.length >= goalN ? ' · 목표 달성!' : ` · ${goalN - people.length}자리 남았어요`}</p></div>` : ''}<ul class="people">${people.map(([n, r]) => `<li class="card"><i aria-hidden="true">${esc(initial(n))}</i><div><b>${esc(n)}</b>${r ? `<span>${esc(r)}</span>` : ''}</div></li>`).join('')}</ul></section>` : ''}
  ${faq.length ? `<section class="sec" id="faq"><h2>자주 묻는 질문</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a || '')}</p></details>`).join('')}</section>` : ''}
  ${noticeHtml(c)}
  ${footerHtml(c, c.name)}
</div>`
  return shell({ c, d: PALETTES[0], title: `${c.name} — 참가자 모집`, desc: c.tagline, fontCss, css, body, script: w ? RUNTIME : '', cfg: w ? jsonForScript({ deadline: w.iso }) : '' })
}

export default {
  id: 'collab',
  group: '덕질',
  name: '합작·이벤트 모집',
  blurb: '마감 카운트다운, 모집 분야, 일정, 참가자 명단까지 갖춘 합작·이벤트 모집 페이지.',
  tag: '합작',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: fontsOf(defaults),
}
