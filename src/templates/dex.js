import { cols, esc, hex, imgSrc, lines, multi } from './util.js'
import { footerGroup, footerHtml, fontsOf, galleryHtml, noticeHtml, paletteColors, phHtml, shell, styleGroup } from './kobase.js'

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
  chars: '# 새벽 천문대\n이서하 | 새벽빛을 닮은 별지기 | 별지기/다정함/길치 | 천문대에서 별의 움직임을 기록하는 관측 기사. 말수가 적지만 한번 마음을 연 사람에게는 끝까지 다정해요. | #e5566d\n정하윤 | 천문대의 정비사 | 정비사/수다쟁이/손재주 | 망원경과 시계를 고치는 솜씨 좋은 정비사. 서하의 길치를 가장 잘 아는 사람이에요. | #4a8df0\n# 마을 광장\n미소 | 광장 모퉁이 빵집 주인 | 빵집/아침형/요리 | 새벽 네 시에 일어나 마을의 첫 빵을 굽는 사람. | #e9a23b\n도겸 | 은퇴한 관측 기사 | 은퇴/스승/낚시 | 서하에게 관측법을 가르쳐 준 노기사. 요즘은 호숫가에서 낚시를 해요. | #2a9d8f',
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
    { key: 'chars', label: '캐릭터 목록', type: 'textarea', rows: 12, hint: '한 줄에 한 명: 이름 | 한 줄 소개 | 키워드(/로 구분) | 자세한 설명 | #대표색(선택). "# 소속 이름"으로 시작하는 줄은 묶음 제목이에요. (최대 40명)' },
    { key: 'portraits', label: '캐릭터 일러스트', type: 'images', max: 12, hint: '위에서부터 순서대로 캐릭터에게 붙어요. 최대 12장.' },
  ] },
  footerGroup,
  styleGroup(),
]

const RUNTIME = String.raw`
(function () {
  var q = document.getElementById('q'), cards = [].slice.call(document.querySelectorAll('.char')), kw = '';
  var dlg = document.getElementById('pf'), box = dlg && dlg.querySelector('.pfb'), cur = null;
  function run() {
    var t = q ? (q.value || '').trim().toLowerCase() : '', shown = 0;
    cards.forEach(function (c) {
      var ok = (!t || c.dataset.q.indexOf(t) > -1) && (!kw || ('/' + c.dataset.k + '/').indexOf('/' + kw + '/') > -1);
      c.hidden = !ok; if (ok) shown++;
    });
    [].forEach.call(document.querySelectorAll('[data-grp]'), function (g) { g.hidden = !g.querySelector('.char:not([hidden])'); });
    var none = document.getElementById('none'); if (none) none.hidden = shown > 0;
    [].forEach.call(document.querySelectorAll('.kw'), function (b) { b.classList.toggle('on', !!kw && b.dataset.kw === kw); });
  }
  function show(c) {
    cur = c;
    var full = c.querySelector('.full').cloneNode(true); full.hidden = false;
    box.replaceChildren(c.querySelector('.pic').cloneNode(true), full);
    dlg.className = 'pf ' + (c.className.match(/\bk\d+\b/) || [''])[0];
    if (!dlg.open) dlg.showModal();
  }
  function step(d) {
    var v = cards.filter(function (c) { return !c.hidden; }), i = v.indexOf(cur);
    if (v.length) show(v[(i + d + v.length) % v.length]);
  }
  if (q) q.addEventListener('input', run);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.kw');
    if (b && !b.closest('#pf')) { kw = kw === b.dataset.kw ? '' : b.dataset.kw; run(); return; }
    var o = e.target.closest && e.target.closest('.open'); if (o && dlg) show(o.closest('.char'));
  });
  if (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('.x')) dlg.close();
      else if (e.target.closest('.prev')) step(-1);
      else if (e.target.closest('.next')) step(1);
    });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  }
})();
`

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const pics = (Array.isArray(c.portraits) ? c.portraits : []).map(imgSrc)
  let n = 0, total = 0
  const groups = []
  for (const line of lines(c.chars, 60)) {
    if (line.startsWith('#')) { groups.push({ name: line.replace(/^#+\s*/, ''), items: [] }); continue }
    if (total >= 40) break
    if (!groups.length) groups.push({ name: '', items: [] })
    const [name, tag, kw, desc, col] = cols(line)
    groups[groups.length - 1].items.push({ name, tag, kw: (kw || '').split('/').map((s) => s.trim()).filter(Boolean), desc, col: /^#[0-9a-f]{6}$/i.test(col || '') ? hex(col, '') : '', img: pics[n++] || '', no: total + 1 })
    total++
  }
  const cols_ = [...new Set(groups.flatMap((g) => g.items.map((p) => p.col)).filter(Boolean))]
  const num = (p) => String(p.no).padStart(2, '0')
  const card = (p) => `<article class="char${p.col ? ' k' + cols_.indexOf(p.col) : ''}" data-q="${esc([p.name, p.tag, ...p.kw].join(' ').toLowerCase())}" data-k="${esc(p.kw.join('/').toLowerCase())}">
<button type="button" class="open" aria-label="${esc(p.name)} 자세히 보기"><span class="pic">${p.img ? `<img src="${p.img}" alt="" loading="lazy" decoding="async">` : phHtml(p.name)}</span><span class="no">No.${num(p)}</span><span class="cap"><b>${esc(p.name)}</b>${p.tag ? `<small>${esc(p.tag)}</small>` : ''}</span></button>
${p.kw.length ? `<ul class="chips">${p.kw.slice(0, 4).map((k) => `<li><button type="button" class="kw" data-kw="${esc(k.toLowerCase())}">${esc(k)}</button></li>`).join('')}</ul>` : ''}
<div class="full" hidden><p class="fno">No.${num(p)}</p><h2>${esc(p.name)}</h2>${p.tag ? `<p class="ftag">${esc(p.tag)}</p>` : ''}${p.kw.length ? `<ul class="fkw">${p.kw.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}${p.desc ? `<div class="fdesc"><p>${multi(p.desc)}</p></div>` : ''}</div></article>`
  const kwCount = {}
  groups.forEach((g) => g.items.forEach((p) => p.kw.forEach((k) => { kwCount[k] = (kwCount[k] || 0) + 1 })))
  const allKw = Object.keys(kwCount).sort((a, b) => kwCount[b] - kwCount[a])
  const named = groups.filter((g) => g.name).length
  const css = `
${cols_.map((k, i) => `.k${i}{--cc:${k}}`).join('')}
body::before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/48px 48px;opacity:.45;mask-image:linear-gradient(#000,transparent 70%)}
.page{position:relative}
header{text-align:center;margin-bottom:clamp(22px,4vw,44px)}
.eyebrow{display:inline-block;margin:0 0 12px;padding:4px 14px;border-radius:99px;background:var(--fg);color:var(--bg);font:700 12px/1.4 var(--body);letter-spacing:.2em}
header h1{margin:0;font:800 clamp(38px,7vw,84px)/1.05 var(--display);letter-spacing:-.025em}
header p{margin:12px 0 0;color:var(--dim);font-size:clamp(15px,1.8vw,19px)}
.stats{display:inline-flex;gap:0;margin-top:18px;border:2px solid var(--fg);border-radius:16px;overflow:hidden;background:var(--card)}
.stats div{padding:6px 20px;text-align:center;border-right:2px solid var(--fg)}
.stats div:last-child{border:0}
.stats b{display:block;font:800 22px/1.1 var(--display);color:var(--accent)}
.stats span{font-size:12px;color:var(--dim);font-weight:700}
.tools{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;margin:0 -8px 8px;padding:12px 8px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(8px)}
.tools input{font:inherit;padding:9px 18px;border-radius:99px;border:2px solid var(--fg);background:var(--card);color:var(--fg);width:min(100%,260px)}
.kw{font:inherit;cursor:pointer;color:inherit}
.tools .kw{font-size:13.5px;font-weight:700;border:1.5px solid var(--line);background:var(--card);border-radius:99px;padding:5px 14px}
.tools .kw.on,.chips .kw.on{background:var(--accent);color:var(--card);border-color:var(--accent)}
.grp h2{display:flex;align-items:center;gap:12px;font-size:clamp(22px,3vw,32px)}
.grp h2::before{content:"";width:16px;height:16px;transform:rotate(45deg);background:var(--accent)}
.grp h2 small{font:700 13px var(--body);color:var(--dim)}
.grp h2::after{content:"";flex:1;height:2px;background:var(--line)}
.dex{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),260px));gap:22px;justify-content:center}
.char{display:flex;flex-direction:column;gap:10px}
.open{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:block;aspect-ratio:3/4;border-radius:22px;overflow:hidden;border:2px solid var(--fg);background:var(--accent2);box-shadow:6px 6px 0 var(--cc,var(--accent));transition:transform .18s,box-shadow .18s}
.open:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--cc,var(--accent))}
.open:focus-visible{outline:3px solid var(--accent);outline-offset:4px}
.pic{position:absolute;inset:0;display:block}
.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.no{position:absolute;top:12px;left:12px;padding:2px 10px;border-radius:99px;background:var(--card);color:var(--fg);font:800 11.5px/1.5 var(--body);letter-spacing:.08em;border:1.5px solid var(--fg)}
.cap{position:absolute;left:0;right:0;bottom:0;padding:38px 16px 14px;background:linear-gradient(transparent,color-mix(in srgb,var(--cc,var(--accent)) 82%,#000));color:#fff;display:flex;flex-direction:column;gap:1px}
.cap b{font:800 24px/1.2 var(--display);text-shadow:0 1px 6px rgba(0,0,0,.35)}
.cap small{font-size:13.5px;font-weight:600;opacity:.95}
.chips{padding:0 4px;gap:6px}
.chips li{padding:0;border:0;background:none}
.chips .kw{font-size:12.5px;font-weight:700;border:1.5px solid color-mix(in srgb,var(--cc,var(--accent)) 55%,var(--bg));background:color-mix(in srgb,var(--cc,var(--accent)) 12%,var(--card));border-radius:99px;padding:1px 10px}
.none{text-align:center;color:var(--dim);margin:30px 0}
dialog.pf{border:2px solid var(--fg);border-radius:28px;padding:0;background:var(--card);color:var(--fg);width:min(94vw,820px);max-height:92vh;overflow:auto;box-shadow:10px 10px 0 var(--cc,var(--accent))}
dialog.pf::backdrop{background:rgba(10,8,18,.72)}
.pfb{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr)}
.pfb .pic{position:relative;min-height:340px;background:var(--accent2);border-right:2px solid var(--fg)}
.pfb .full{padding:30px 30px 26px;align-self:center}
.fno{margin:0;font:800 12px var(--body);letter-spacing:.18em;color:var(--cc,var(--accent))}
.full h2{margin:4px 0 0;font:800 clamp(30px,5vw,44px)/1.1 var(--display)}
.ftag{margin:6px 0 0;font-weight:700;color:var(--cc,var(--accent))}
.fkw{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:14px 0 0;padding:0}
.fkw li{padding:1px 12px;border-radius:99px;font-size:13px;font-weight:700;background:color-mix(in srgb,var(--cc,var(--accent)) 14%,var(--card));border:1.5px solid color-mix(in srgb,var(--cc,var(--accent)) 50%,var(--card))}
.fkw li::before{content:"#";opacity:.5}
.fdesc{margin-top:16px;padding-top:14px;border-top:2px dashed var(--line)}
.fdesc p{margin:0;color:var(--dim);font-size:15.5px}
.pf .x,.pf .prev,.pf .next{position:absolute;z-index:2;width:42px;height:42px;border-radius:50%;border:2px solid var(--fg);background:var(--card);color:var(--fg);font:800 18px var(--body);cursor:pointer}
.pf .x{top:12px;right:12px}.pf .prev{left:12px;bottom:12px}.pf .next{left:62px;bottom:12px}
@media(max-width:640px){.pfb{grid-template-columns:1fr}.pfb .pic{min-height:0;aspect-ratio:4/3;border-right:0;border-bottom:2px solid var(--fg)}.pfb .full{padding:20px}.grp h2 small{display:none}}
@media(prefers-reduced-motion:reduce){.open{transition:none}}
`
  const body = `<div class="page">
  <header><p class="eyebrow">CHARACTER DEX</p><h1>${esc(c.title)}</h1>${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ''}<div class="stats"><div><b>${total}</b><span>등록</span></div>${named ? `<div><b>${named}</b><span>소속</span></div>` : ''}<div><b>${allKw.length}</b><span>키워드</span></div></div></header>
  ${total > 4 ? `<div class="tools"><input id="q" type="search" placeholder="이름·키워드로 찾기" aria-label="캐릭터 검색"><button type="button" class="kw" data-kw="">전체</button>${allKw.slice(0, 8).map((k) => `<button type="button" class="kw" data-kw="${esc(k.toLowerCase())}">${esc(k)}</button>`).join('')}</div>` : ''}
  ${groups.map((g) => `<section class="sec grp" data-grp>${g.name ? `<h2>${esc(g.name)} <small>${g.items.length}명</small></h2>` : ''}<div class="dex">${g.items.map(card).join('')}</div></section>`).join('')}
  <p class="none" id="none" hidden>찾는 캐릭터가 없어요.</p>
  ${noticeHtml(c)}
  ${footerHtml(c, c.title)}
</div>
<dialog id="pf" class="pf" aria-label="캐릭터 상세"><div class="pfb"></div><button type="button" class="x" aria-label="닫기">✕</button><button type="button" class="prev" aria-label="이전 캐릭터">‹</button><button type="button" class="next" aria-label="다음 캐릭터">›</button></dialog>`
  return shell({ c, d: PALETTES[0], title: `${c.title}`, desc: c.subtitle, fontCss, css, body, script: total ? RUNTIME : '' })
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
