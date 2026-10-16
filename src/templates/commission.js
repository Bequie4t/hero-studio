import { cols, esc, imgSrc, lines, multi, safeUrl } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, noticeHtml, paletteColors, phHtml, shell, styleGroup } from './kobase.js'

// Template: 커미션 안내 — status, price list, process, rules, copy-able request form, work board.
const PALETTES = [
  { id: 'sky', label: '파스텔 하늘', bg: '#eef6ff', card: '#ffffff', fg: '#1c2b3f', accent: '#4a90e2', accent2: '#ffd9e8' },
  { id: 'kraft', label: '크래프트 종이', bg: '#f4ead8', card: '#fffaf0', fg: '#3a2c18', accent: '#a8652a', accent2: '#e8cf9b' },
  { id: 'ink', label: '밤 잉크', bg: '#12131a', card: '#1c1e29', fg: '#ecebf5', accent: '#7ee0c3', accent2: '#3a3f66' },
  { id: 'berry', label: '딸기우유', bg: '#fff0f3', card: '#ffffff', fg: '#3a1a24', accent: '#ff5c8a', accent2: '#ffd6e2' },
]

const defaults = {
  name: '별조각 공방',
  bio: '자캐 일러스트와 설정화를 그리는 작가예요. 캐릭터의 분위기를 살리는 그림을 그려 드려요.',
  avatar: '',
  open: true,
  statusText: '11월 3주차까지 신청 받아요',
  slotsTotal: '5',
  slotsLeft: '3',
  samples: [],
  prices: '반신 일러스트 | 30,000원 | 채색 포함, 배경은 단색 | 약 2주\n전신 일러스트 | 50,000원 | 채색 포함, 간단한 배경 | 약 3주\n캐릭터 설정화 | 70,000원 | 전신 + 표정 3종 + 설정 메모 | 약 4주\n커플 일러스트 | 80,000원 | 반신 2인 기준, 배경 포함 | 약 3주',
  options: '캐릭터 추가 | +50%\n복잡한 배경 | +10,000원\n상업적 이용 | 별도 문의\n급행 작업 | +30%',
  steps: '아래 신청 양식을 복사해서 작성해요.\n신청 링크로 양식을 보내 주세요.\n작업 가능 여부와 입금 안내를 드려요.\n러프 확인 후 채색에 들어가요.\n완성본을 전달해 드려요.',
  rules: '캐릭터 설정 자료(레퍼런스)를 꼭 함께 보내 주세요.\n러프 확인 이후에는 큰 수정이 어려워요.\n타인의 저작물 캐릭터(2차 창작)는 받지 않아요.\n완성본은 개인 소장과 SNS 공개까지 가능해요. 재배포와 AI 학습 사용은 금지예요.\n작업 일정은 상황에 따라 조금 달라질 수 있어요.',
  faq: '입금은 언제 하나요? | 작업 가능 여부를 안내드린 뒤에 입금해 주세요.\n수정은 몇 번까지 되나요? | 러프 단계에서 2회까지 무료예요.\n캐릭터가 여러 명이면요? | 캐릭터 추가 옵션이 붙어요.',
  applyLabel: '신청하러 가기',
  applyUrl: 'https://forms.gle/',
  form: '[커미션 신청 양식]\n닉네임:\n연락 방법:\n신청 종류:\n캐릭터 이름/설정 요약:\n레퍼런스 링크:\n원하는 분위기·포즈:\n희망 완성일:',
  board: '하늘님 | 작업중\n민트님 | 대기\n오렌지님 | 완료\n라일락님 | 완료',
  owner: '별조각',
  notice: '신청 전 안내를 끝까지 읽어 주세요. 안내를 읽지 않아 생긴 문제는 도와드리기 어려워요.',
  links: '트위터(X) | https://twitter.com/\n포스타입 | https://www.postype.com/\n픽시브 | https://www.pixiv.net/',
  ...paletteColors(PALETTES[0]),
  displayFont: 'jua',
  bodyFont: 'pretendard',
}

const fields = [
  { group: '작가 정보', open: true, items: [
    { key: 'name', label: '작가·공방 이름', type: 'text' },
    { key: 'bio', label: '소개', type: 'textarea', rows: 3 },
    { key: 'avatar', label: '프로필 이미지', type: 'image', theme: true },
  ] },
  { group: '신청 상태', open: true, items: [
    { key: 'open', label: '지금 커미션을 받고 있어요', type: 'check' },
    { key: 'statusText', label: '상태 설명', type: 'text', hint: '예: 11월 3주차까지 신청 받아요' },
    { key: 'slotsTotal', label: '전체 슬롯', type: 'text', half: true, hint: '숫자만. 비우면 슬롯 표시를 숨겨요.' },
    { key: 'slotsLeft', label: '남은 슬롯', type: 'text', half: true },
    { key: 'samples', label: '샘플 그림', type: 'images', max: 8, hint: '작업 예시를 최대 8장까지 보여 줘요.' },
  ] },
  { group: '가격표', open: true, items: [
    { key: 'prices', label: '커미션 종류', type: 'textarea', rows: 6, hint: '한 줄에 하나: 종류 | 가격 | 설명 | 작업 기간 (최대 8개). 가격에 숫자(예: 30,000원)가 있으면 견적 계산기가 동작해요.' },
    { key: 'options', label: '추가 옵션', type: 'textarea', rows: 4, hint: '한 줄에 하나: 항목 | 추가금 (최대 8개)' },
  ] },
  { group: '진행과 규칙', items: [
    { key: 'steps', label: '진행 과정', type: 'textarea', rows: 5, hint: '한 줄에 하나. 순서대로 번호가 붙어요.' },
    { key: 'rules', label: '주의사항', type: 'textarea', rows: 6, hint: '한 줄에 하나' },
  ] },
  { group: '자주 묻는 질문', items: [
    { key: 'faq', label: '질문과 답', type: 'textarea', rows: 5, hint: '한 줄에 하나: 질문 | 답 (최대 8개)' },
  ] },
  { group: '신청', items: [
    { key: 'applyLabel', label: '신청 버튼 문구', type: 'text', half: true },
    { key: 'applyUrl', label: '신청 링크', type: 'text', half: true },
    { key: 'form', label: '신청 양식', type: 'textarea', rows: 8, hint: '방문자가 버튼 하나로 복사해서 쓸 수 있어요. 비우면 숨겨요.' },
  ] },
  { group: '작업 현황', items: [
    { key: 'board', label: '현황판', type: 'textarea', rows: 5, hint: '한 줄에 하나: 이름 | 상태(대기/작업중/완료) (최대 12개)' },
  ] },
  footerGroup,
  styleGroup(['jua', 'blackhan', 'gowunbatang', 'nanumpen', 'galmuri', 'pretendard']),
]

// Price text -> { n } (won) or { pct }; anything else is a free-form note.
const num = (t) => { const m = String(t || '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(만)?\s*원?/); return m ? Math.round(+m[1] * (m[2] ? 10000 : 1)) : null }
const pct = (t) => { const m = String(t || '').match(/([+-]?\d+(?:\.\d+)?)\s*%/); return m ? +m[1] : null }

const RUNTIME = String.raw`
(function () {
  var types = [].slice.call(document.querySelectorAll('input[name=ty]')), opts = [].slice.call(document.querySelectorAll('input[name=op]'));
  var out = document.getElementById('total'), note = document.getElementById('estnote');
  var b = document.getElementById('copyform'), t = document.getElementById('formtext');
  function pick() { return types.filter(function (x) { return x.checked; })[0]; }
  function won(n) { return n.toLocaleString('ko-KR') + '원'; }
  function summary() {
    var ty = pick(); if (!ty) return '';
    var lines = ['[견적] ' + ty.dataset.name + (ty.dataset.price ? ' ' + won(+ty.dataset.price) : '')];
    opts.forEach(function (o) { if (o.checked) lines.push(' + ' + o.dataset.name); });
    if (out && out.textContent) lines.push('예상 합계: ' + out.textContent);
    return lines.join('\n');
  }
  function calc() {
    var ty = pick(); if (!out) return;
    if (!ty) { out.textContent = ''; note.textContent = '커미션 종류를 먼저 골라 주세요.'; return; }
    var base = +ty.dataset.price, sum = base, extra = [];
    if (!base) { out.textContent = ''; note.textContent = '가격이 정해져 있지 않아 직접 문의가 필요해요.'; return; }
    opts.forEach(function (o) {
      if (!o.checked) return;
      if (o.dataset.pct) sum += base * (+o.dataset.pct / 100);
      else if (o.dataset.add) sum += +o.dataset.add;
      else extra.push(o.dataset.name);
    });
    out.textContent = won(Math.round(sum));
    note.textContent = extra.length ? extra.join(', ') + '은(는) 별도 문의예요.' : '실제 금액은 작가와 상담 후 확정돼요.';
  }
  types.concat(opts).forEach(function (x) { x.addEventListener('change', calc); });
  calc();
  if (b && t) {
    function say(m) { b.textContent = m; setTimeout(function () { b.textContent = '신청 양식 복사'; }, 2000); }
    b.addEventListener('click', function () {
      var text = t.textContent, s = summary();
      if (s) text = text + '\n\n' + s;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { say(s ? '견적과 함께 복사했어요' : '복사했어요'); }, function () { say('직접 선택해서 복사해 주세요'); });
      else say('직접 선택해서 복사해 주세요');
    });
  }
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const avatar = imgSrc(c.avatar)
  const prices = lines(c.prices, 8).map(cols)
  const opts = lines(c.options, 8).map(cols)
  const steps = lines(c.steps, 10), rules = lines(c.rules, 12)
  const board = lines(c.board, 12).map(cols)
  const faq = lines(c.faq, 8).map(cols)
  const est = prices.length > 0 && prices.some(([, p]) => num(p))
  const slotsTotal = Math.max(0, Math.min(12, parseInt(c.slotsTotal, 10) || 0))
  const slotsLeft = Math.max(0, Math.min(slotsTotal, parseInt(c.slotsLeft, 10) || 0))
  const fan = (Array.isArray(c.samples) ? c.samples : []).map(imgSrc).filter(Boolean).slice(0, 3)
  const stCls = (s) => (/완료/.test(s) ? 'done' : /작업|진행/.test(s) ? 'wip' : 'wait')
  const css = `
.top{display:grid;grid-template-columns:1.25fr 1fr;gap:clamp(20px,4vw,56px);align-items:center;padding:clamp(8px,2vw,24px) 0}
.eyebrow{display:inline-block;margin:0 0 10px;padding:4px 14px;border-radius:99px;background:var(--fg);color:var(--bg);font:800 12px/1.4 var(--body);letter-spacing:.22em}
.top h1{margin:0;font:400 clamp(44px,7.5vw,92px)/1.02 var(--display);letter-spacing:-.02em}
.bio{margin:14px 0 0;color:var(--dim);max-width:46ch;font-size:clamp(15px,1.6vw,18px)}
.state{display:flex;align-items:center;gap:16px;margin-top:22px;padding:14px 20px;border-radius:22px;background:var(--card);border:2px solid var(--accent);box-shadow:5px 5px 0 var(--accent)}
.state b{padding:5px 16px;border-radius:99px;background:var(--accent);color:var(--bg);font:800 14px var(--body);letter-spacing:.12em;display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.state b::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--bg);animation:pl 1.8s ease-in-out infinite}
.state>div{display:grid;gap:6px;font-weight:600}
.state.closed{border-color:var(--line);box-shadow:5px 5px 0 var(--line)}.state.closed b{background:var(--dim)}.state.closed b::before{animation:none}
.slots{display:flex;align-items:center;gap:6px;list-style:none;margin:0;padding:0}
.slots li{width:22px;height:22px;border-radius:50%;border:2.5px solid var(--accent);background:var(--card)}
.slots li.used{background:var(--accent)}
.slots em{margin-left:6px;font-style:normal;font-size:13px;color:var(--dim);font-weight:700}
@keyframes pl{50%{transform:scale(1.5);opacity:.5}}
.art{position:relative;aspect-ratio:1;max-width:420px;width:100%;justify-self:center}
.art>img{position:absolute;width:56%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;border:5px solid #fff;box-shadow:0 8px 22px rgba(0,0,0,.2)}
.art .f0{top:0;right:2%;transform:rotate(7deg)}.art .f1{bottom:0;right:0;transform:rotate(-4deg)}.art .f2{bottom:6%;left:0;transform:rotate(-9deg)}
.av{position:absolute;left:4%;top:4%;width:62%;aspect-ratio:1;border-radius:50%;overflow:hidden;background:var(--accent2);border:6px solid var(--card);outline:3px solid var(--accent);box-shadow:0 10px 30px rgba(0,0,0,.18)}
.art:not(:has(>img)) .av{inset:0;left:0;top:0;width:100%;position:absolute}
.av>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.prices{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px}
.price{padding:20px;display:flex;flex-direction:column;gap:6px;cursor:pointer;position:relative;transition:border-color .15s,box-shadow .15s}
.price input{position:absolute;opacity:0;pointer-events:none}
.price:has(input:checked){border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 35%,transparent)}
.price:has(input:focus-visible){outline:3px solid var(--accent);outline-offset:3px}
.price:has(input:checked)::after{content:"선택됨";position:absolute;top:14px;right:16px;font-size:12px;font-weight:800;color:var(--bg);background:var(--accent);padding:1px 10px;border-radius:99px}
.est{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 24px;margin-top:16px;padding:16px 22px;border:2px solid var(--accent)}
.est small{display:block;color:var(--dim);font-size:13px}
.est strong{font:800 clamp(26px,4vw,34px)/1.1 var(--display);color:var(--accent)}
.est p{margin:0;color:var(--dim);font-size:14px}
.opts label{cursor:pointer}.opts input{accent-color:var(--accent)}
.price h3{margin:0;font:400 22px/1.2 var(--display)}
.price strong{font:800 24px/1.1 var(--body);color:var(--accent)}
.price p{margin:0;color:var(--dim);font-size:14.5px}
.price small{margin-top:auto;font-weight:700;font-size:13px}
.opts{list-style:none;margin:16px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:8px}
.opts li{display:flex;justify-content:space-between;gap:12px;padding:10px 16px;border-radius:14px;background:color-mix(in srgb,var(--accent2) 40%,var(--card));font-size:15px}
.opts b{color:var(--accent)}
.steps{margin:0;padding:0;list-style:none;counter-reset:s;display:grid;gap:10px}
.steps li{counter-increment:s;display:flex;gap:14px;align-items:flex-start;padding:12px 18px}
.steps li::before{content:counter(s);flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-weight:800;font-size:14px}

.apply{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.apply button{font:inherit;font-weight:800;padding:12px 24px;border-radius:99px;border:2px solid var(--fg);background:none;color:var(--fg);cursor:pointer}
.apply button:hover{background:var(--fg);color:var(--bg)}
pre{margin:16px 0 0;padding:16px 20px;border-radius:16px;background:var(--card);border:1px solid var(--line);white-space:pre-wrap;font:400 14.5px/1.8 var(--body)}
.board{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:10px}
.board li{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 16px}
.pill{font-size:12.5px;font-weight:800;padding:2px 12px;border-radius:99px}
.pill.wait{background:var(--line);color:var(--fg)}.pill.wip{background:var(--accent2);color:var(--fg)}.pill.done{background:var(--accent);color:var(--bg)}
.sec h2{display:flex;align-items:center;gap:14px;font-size:clamp(26px,3.4vw,38px)}
.sec h2::after{content:"";flex:1;height:3px;border-radius:2px;background:repeating-linear-gradient(90deg,var(--accent) 0 10px,transparent 10px 18px);opacity:.5}
.price{padding-top:26px;overflow:hidden}
.price::before{content:"";position:absolute;left:0;right:0;top:0;height:8px;background:linear-gradient(90deg,var(--accent),var(--accent2))}
.price strong{font-size:28px}
.steps{grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:14px;position:relative}
.steps li{flex-direction:column;gap:10px;padding:18px 16px;position:relative;font-size:14.5px}
.steps li::before{flex:0 0 38px;width:38px;height:38px;font-size:17px;box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 22%,var(--bg))}
.steps li:not(:last-child)::after{content:"";position:absolute;top:36px;left:calc(100% - 4px);width:22px;height:3px;background:var(--accent);opacity:.5}
.rules{list-style:none;padding:20px 24px;margin:0;background:var(--card);border:2px dashed var(--accent);border-radius:20px;display:grid;gap:10px}
.rules li{position:relative;padding-left:30px;margin:0}
.rules li::before{content:"✓";position:absolute;left:0;top:1px;width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-size:13px;font-weight:800}
#apply .apply{padding:clamp(20px,3vw,30px);border-radius:26px;background:linear-gradient(120deg,var(--accent),color-mix(in srgb,var(--accent) 60%,var(--accent2)));box-shadow:6px 6px 0 var(--fg)}
#apply .btn{background:var(--bg);color:var(--fg)}
#apply .btn:hover{background:var(--card);color:var(--fg)}
#apply .apply button{border-color:var(--bg);color:var(--bg)}
#apply .apply button:hover{background:var(--bg);color:var(--fg)}
pre{background:repeating-linear-gradient(transparent 0 31px,color-mix(in srgb,var(--accent) 22%,transparent) 31px 32px),var(--card);line-height:32px;padding:6px 22px 8px;border:2px solid var(--fg);border-radius:6px 20px 20px 20px}
.board li{border-width:2px;border-style:solid;border-color:var(--line)}
.pill.done{transform:rotate(-4deg);border:2px solid var(--bg);outline:2px solid var(--accent)}
@media(max-width:760px){.steps li::after{display:none}.top{grid-template-columns:1fr}.art{max-width:300px;order:-1}.state{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.state b::before{animation:none}}
`
  const body = `<div class="page">
  <header class="top"><div class="txt"><p class="eyebrow">COMMISSION INFO</p><h1>${esc(c.name)}</h1>${c.bio ? `<p class="bio">${multi(c.bio)}</p>` : ''}<div class="state${c.open ? '' : ' closed'}"><b>${c.open ? 'OPEN' : 'CLOSED'}</b><div>${c.statusText ? `<span>${esc(c.statusText)}</span>` : ''}${slotsTotal ? `<ul class="slots" aria-label="슬롯 ${slotsTotal - slotsLeft}/${slotsTotal} 사용 중">${Array.from({ length: slotsTotal }, (_, i) => `<li class="${i < slotsTotal - slotsLeft ? 'used' : ''}"></li>`).join('')}<em>${c.open ? `남은 슬롯 ${slotsLeft}/${slotsTotal}` : '다음 오픈을 기다려 주세요'}</em></ul>` : ''}</div></div></div>
    <div class="art">${fan.length ? fan.map((f, i) => `<img class="f${i}" src="${f}" alt="" loading="lazy" decoding="async">`).join('') : ''}<div class="av">${avatar ? `<img src="${avatar}" alt="${esc(c.name)} 프로필 이미지">` : phHtml(c.name)}</div></div></header>
  ${galleryHtml(c.samples, `${c.name} 샘플`, '샘플')}
  ${prices.length ? `<section class="sec" id="prices"><h2>커미션 종류와 가격</h2><div class="prices">${prices.map(([k, p, d, t]) => `<label class="price card"><input type="radio" name="ty" data-name="${esc(k)}" data-price="${num(p) || ''}"><h3>${esc(k)}</h3><strong>${esc(p || '')}</strong>${d ? `<p>${esc(d)}</p>` : ''}${t ? `<small>작업 기간 ${esc(t)}</small>` : ''}</label>`).join('')}</div>${opts.length ? `<ul class="opts">${opts.map(([k, v]) => `<li><label><input type="checkbox" name="op" data-name="${esc(k)}"${pct(v) !== null ? ` data-pct="${pct(v)}"` : num(v) ? ` data-add="${num(v)}"` : ''}> ${esc(k)}</label><b>${esc(v || '')}</b></li>`).join('')}</ul>` : ''}${est ? '<div class="est card"><div><small>선택한 견적</small><strong id="total" aria-live="polite"></strong></div><p id="estnote"></p></div>' : ''}</section>` : ''}
  ${steps.length ? `<section class="sec" id="steps"><h2>진행 과정</h2><ol class="steps">${steps.map((s) => `<li class="card">${esc(s)}</li>`).join('')}</ol></section>` : ''}
  ${rules.length ? `<section class="sec" id="rules"><h2>꼭 읽어 주세요</h2><ul class="rules">${rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section>` : ''}
  <section class="sec" id="apply"><h2>신청하기</h2><div class="apply"><a class="btn" href="${esc(safeUrl(c.applyUrl))}" target="_blank" rel="noopener noreferrer">${esc(c.applyLabel)}</a>${c.form ? '<button type="button" id="copyform">신청 양식 복사</button>' : ''}</div>${c.form ? `<pre id="formtext">${esc(c.form)}</pre>` : ''}</section>
  ${faq.length ? `<section class="sec" id="faq"><h2>자주 묻는 질문</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a || '')}</p></details>`).join('')}</section>` : ''}
  ${board.length ? `<section class="sec" id="board"><h2>작업 현황</h2><ul class="board">${board.map(([n, s]) => `<li class="card"><span>${esc(n)}</span><span class="pill ${stCls(s || '')}">${esc(s || '대기')}</span></li>`).join('')}</ul></section>` : ''}
  ${noticeHtml(c)}
  ${footerHtml(c, c.name)}
</div>`
  return shell({ c, d: PALETTES[0], title: `${c.name} — 커미션 안내`, desc: c.bio, fontCss, css, body, script: c.form || est ? RUNTIME : '' })
}

export default {
  id: 'commission',
  group: '덕질',
  name: '커미션 안내',
  blurb: '신청 상태, 가격표, 진행 과정, 주의사항, 복사되는 신청 양식, 작업 현황판까지.',
  tag: '커미션',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: fontsOf(defaults),
}
