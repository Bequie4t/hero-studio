import { esc, safeUrl } from './util.js'

// Atmosphere layer shared by the Korean templates: star field, film grain, vignette, scroll reveal,
// cursor sparkles and a background-music button. Everything is opt-in and off for visitors who
// prefer reduced motion.
export const fxDefaults = { skin: 'soft', fxStars: false, fxGrain: false, fxVignette: false, fxReveal: true, fxCursor: false, fxCursorKind: 'star', fxFall: 'none', bgmUrl: '', bgmTitle: '', gateOn: false, gateSub: '', gateTitle: '', gateBtn: '입장하기' }

export const fxOf = (p) => Object.fromEntries(['skin', 'fxStars', 'fxGrain', 'fxVignette', 'fxCursor', 'fxCursorKind', 'fxFall'].filter((k) => k in p).map((k) => [k, p[k]]))

export const fxGroup = {
  group: '분위기 효과',
  items: [
    { key: 'skin', label: '카드 스타일', type: 'choice', options: [{ id: 'soft', label: '포근한 카드' }, { id: 'line', label: '시네마틱 라인' }] },
    { key: 'fxReveal', label: '스크롤하면 부드럽게 나타나기', type: 'check' },
    { key: 'fxStars', label: '반짝이는 별무리 배경', type: 'check' },
    { key: 'fxGrain', label: '필름 입자 질감', type: 'check' },
    { key: 'fxVignette', label: '가장자리 어둡게(비네트)', type: 'check' },
    { key: 'fxFall', label: '떨어지는 입자', type: 'choice', options: [{ id: 'none', label: '없음' }, { id: 'snow', label: '눈' }, { id: 'petal', label: '벚꽃잎' }, { id: 'leaf', label: '낙엽' }, { id: 'firefly', label: '반딧불' }] },
    { key: 'fxCursor', label: '마우스를 따라 자국 남기기', type: 'check' },
    { key: 'fxCursorKind', label: '자국 모양', type: 'choice', options: [{ id: 'star', label: '별' }, { id: 'heart', label: '하트' }, { id: 'paw', label: '고양이 발자국' }] },
    { key: 'bgmUrl', label: '배경음악 주소', type: 'text', hint: 'mp3 같은 음악 파일의 https 주소. 방문자가 버튼을 눌러야 재생돼요. 비우면 숨겨요.' },
    { key: 'bgmTitle', label: '배경음악 제목', type: 'text', half: true },
    { key: 'gateOn', label: '입장 화면(대문) 보여 주기', type: 'check', hint: '저장한 파일에서만 보여요. 편집 화면 미리보기에서는 바로 열려요.' },
    { key: 'gateSub', label: '대문 작은 글씨', type: 'text', hint: '예: welcome to the alley' },
    { key: 'gateTitle', label: '대문 제목', type: 'text' },
    { key: 'gateBtn', label: '입장 버튼 문구', type: 'text', half: true },
  ],
}
export const fxGroupSoft = { ...fxGroup, items: fxGroup.items.filter((i) => i.key !== 'skin') }

// Shared moods: colours plus the atmosphere preset that goes with them.
export const MOODS = [
  { id: 'm-alley', label: '한밤 골목', bg: '#0f0d14', card: '#1a1722', fg: '#efe9f5', accent: '#f2c14e', accent2: '#4a3a6a', skin: 'line', fxStars: true, fxGrain: true, fxVignette: true, fxCursor: true, fxCursorKind: 'paw' },
  { id: 'm-nap', label: '햇살 낮잠', bg: '#fff4dc', card: '#fffaf0', fg: '#4a3a22', accent: '#e69a3a', accent2: '#ffd98a', fxFall: 'leaf', fxCursor: true, fxCursorKind: 'paw' },
  { id: 'm-moon', label: '달빛 산책', bg: '#0d1220', card: '#162036', fg: '#e9eefb', accent: '#bcd0ff', accent2: '#3a4f86', skin: 'line', fxStars: true, fxGrain: true, fxVignette: true, fxFall: 'firefly' },
  { id: 'm-storm', label: '폭풍 관측소', bg: '#0b1114', card: '#121c21', fg: '#dfeaec', accent: '#6fd3e0', accent2: '#24505a', skin: 'line', fxGrain: true, fxVignette: true },
  { id: 'm-spring', label: '봄날의 편지', bg: '#fff6f0', card: '#fffdfa', fg: '#4a3430', accent: '#e58a86', accent2: '#fbd9c8', fxFall: 'petal' },
  { id: 'm-snow', label: '첫눈', bg: '#eef3fb', card: '#ffffff', fg: '#25324a', accent: '#6c8fd8', accent2: '#cfdcf5', fxFall: 'snow' },
  { id: 'm-glass', label: '유리 바다', bg: '#0a2a33', card: '#123c47', fg: '#e6fbff', accent: '#5fe6d0', accent2: '#1f6f7d', fxGrain: true, fxFall: 'firefly' },
  { id: 'm-mini', label: '미니홈피 2006', bg: '#dff1ff', card: '#ffffff', fg: '#1a2a44', accent: '#3a8de0', accent2: '#ffe27a', fxCursor: true, fxCursorKind: 'star' },
]

const HEART = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z'/></svg>")
const PAW = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><ellipse cx='12' cy='16.2' rx='5.6' ry='4.6'/><circle cx='5.2' cy='10.8' r='2.4'/><circle cx='9.4' cy='6.4' r='2.6'/><circle cx='14.6' cy='6.4' r='2.6'/><circle cx='18.8' cy='10.8' r='2.4'/></svg>")
const NOISE = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0"/></filter><rect width="160" height="160" filter="url(#n)"/></svg>')


const BR = 'linear-gradient(var(--accent),var(--accent))'
const brackets = (n) => [`top left`, `top right`, `bottom left`, `bottom right`].map((pos) => `${BR} ${pos}/${n}px 1px no-repeat,${BR} ${pos}/1px ${n}px no-repeat`).join(',')
const LINE = `
.sk-line{font-weight:300}
.sk-line h1,.sk-line h2,.sk-line h3{font-weight:400!important;letter-spacing:-.04em}
.sk-line .card,.sk-line .who,.sk-line .tc,.sk-line .profile,.sk-line .price,.sk-line .q,.sk-line .win,.sk-line .box,.sk-line .notice,.sk-line .state,.sk-line .est,.sk-line .cv,.sk-line .open,.sk-line dialog.pf{border-radius:2px!important;border:1px solid color-mix(in srgb,var(--fg) 16%,transparent)!important;box-shadow:none!important;background-color:color-mix(in srgb,var(--card) 55%,transparent);background-image:${brackets(10)};transition:border-color .5s}
.sk-line dl>div,.sk-line .rel li,.sk-line .anni li,.sk-line .board li,.sk-line .steps li,.sk-line .sched li,.sk-line .opts li,.sk-line .people li,.sk-line .rulelist li,.sk-line pre{border-radius:2px!important;border:1px solid color-mix(in srgb,var(--fg) 14%,transparent)!important;box-shadow:none!important;background-color:color-mix(in srgb,var(--card) 50%,transparent)}
.sk-line .rel li{border-left:3px solid var(--accent)!important}
.sk-line .card:hover,.sk-line .who:hover,.sk-line .open:hover{border-color:color-mix(in srgb,var(--accent) 60%,transparent)!important;transform:none}
.sk-line .profile{transform:none}.sk-line .profile::before{display:none}
.sk-line .sec h2,.sk-line main section>h2{display:flex;align-items:center;gap:14px}
.sk-line .sec h2::before,.sk-line main section>h2::before{content:"\\25C7";background:none;color:var(--accent);padding:0;border-radius:0;transform:none;font:300 14px var(--body);letter-spacing:0;width:auto;height:auto;clip-path:none}
.sk-line .sec h2::after,.sk-line main section>h2::after{height:1px;background:linear-gradient(90deg,color-mix(in srgb,var(--fg) 30%,transparent),transparent)}
.sk-line .eyebrow{background:none!important;border:0!important;padding:0!important;color:color-mix(in srgb,var(--fg) 62%,transparent)!important;font-weight:300!important;letter-spacing:.34em!important}
.sk-line .eyebrow::before{content:"\\25C7  "}
.sk-line .eyebrow span{background:none!important;color:inherit!important;padding:0!important}
.sk-line .btn,.sk-line .links a,.sk-line .apply button,.sk-line .tools .kw,.sk-line .meta span,.sk-line .jump a,.sk-line .mini a,.sk-line .stats{background:none!important;color:var(--fg)!important;border:1px solid color-mix(in srgb,var(--fg) 38%,transparent)!important;border-radius:0!important;box-shadow:none!important;letter-spacing:.08em;font-weight:400}
.sk-line .btn:hover,.sk-line .links a:hover{border-color:var(--accent)!important;color:var(--accent)!important}
.sk-line .chips li,.sk-line .kw li,.sk-line .tg li,.sk-line .fkw li,.sk-line .pill,.sk-line .ev em,.sk-line .no,.sk-line .badge{border-radius:1px!important;background:none!important;border:1px solid color-mix(in srgb,var(--fg) 28%,transparent)!important;color:color-mix(in srgb,var(--fg) 80%,transparent)!important;box-shadow:none!important;font-weight:400}
.sk-line .tools .kw.on,.sk-line .chips .kw.on{border-color:var(--accent)!important;color:var(--accent)!important}
.sk-line .pic,.sk-line .av{border-radius:0!important;outline:0!important;border:1px solid color-mix(in srgb,var(--fg) 24%,transparent)!important;box-shadow:none!important}
.sk-line .av{border-radius:50%!important}
.sk-line .era h2{background:none!important;color:var(--fg)!important;border-top:1px solid color-mix(in srgb,var(--fg) 30%,transparent);border-bottom:1px solid color-mix(in srgb,var(--fg) 14%,transparent);border-radius:0;padding:14px 4px}
.sk-line .era h2::after{display:none}
.sk-line .stat .bar,.sk-line .prog,.sk-line .goal div{border-radius:0!important;border:0!important;height:3px!important;background:color-mix(in srgb,var(--fg) 14%,transparent)!important}
.sk-line .stat .bar::after{display:none}
.sk-line .stat .bar i,.sk-line .prog i,.sk-line .goal i{border-radius:0!important;background:var(--accent)!important}
.sk-line header h1,.sk-line .hero h1{background:none!important;-webkit-text-fill-color:currentColor;color:var(--fg)!important}
.sk-line .wm{-webkit-text-stroke:1px color-mix(in srgb,var(--fg) 14%,transparent)}
.sk-line .cap{background:linear-gradient(transparent,rgba(5,6,10,.78))!important}
.sk-line .heart{filter:saturate(.7)}
`

export function fxCss(c) {
  const lineSkin = c.skin === 'line'
  const on = (k) => c[k] === true
  const out = []
  const fall = ['snow', 'petal', 'leaf', 'firefly'].includes(c.fxFall) ? c.fxFall : ''
  if (on('fxStars') || on('fxGrain') || on('fxVignette') || fall || c.bgmUrl) out.push('.page,.wrap,header,main,footer{position:relative;z-index:2}')
  if (on('fxStars')) out.push('#fxsky{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}')
  if (fall) out.push('#fxfall{position:fixed;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}')
  if (on('fxGrain')) out.push(`.fxgrain{position:fixed;inset:-50%;z-index:40;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,${NOISE}");animation:fxg 1.2s steps(6) infinite}@keyframes fxg{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-5%)}60%{transform:translate(-6%,-2%)}80%{transform:translate(5%,4%)}100%{transform:translate(0,0)}}`)
  if (on('fxVignette')) out.push('.fxvig{position:fixed;inset:0;z-index:39;pointer-events:none;background:radial-gradient(ellipse 120% 100% at 50% 50%,transparent 58%,color-mix(in srgb,var(--bg) 55%,#000) 100%)}')
  if (on('fxReveal')) out.push('html.rvon .rvt{opacity:0;transform:translate3d(0,34px,0) scale(.99);filter:blur(7px);transition:opacity 1.2s cubic-bezier(.16,1,.3,1) calc(var(--d,0)*1ms),transform 1.5s cubic-bezier(.16,1,.3,1) calc(var(--d,0)*1ms),filter 1.2s cubic-bezier(.16,1,.3,1) calc(var(--d,0)*1ms)}html.rvon .rvt.in{opacity:1;transform:none;filter:none}@media(max-width:760px){html.rvon .rvt{filter:none}}')
  if (on('fxCursor')) out.push(`.fxsp{position:fixed;z-index:60;width:12px;height:12px;margin:-6px 0 0 -6px;pointer-events:none;background:var(--accent);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:fxs .9s ease-out forwards}@keyframes fxs{to{opacity:0;transform:translate(var(--dx,0px),22px) rotate(90deg) scale(.2)}}
.fxsp.heart,.fxsp.paw{clip-path:none;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}
.fxsp.heart{--m:url("data:image/svg+xml,${HEART}");width:14px;height:14px;margin:-7px 0 0 -7px}
.fxsp.paw{--m:url("data:image/svg+xml,${PAW}");width:20px;height:20px;margin:-10px 0 0 -10px;opacity:.85;animation:fxp 1.6s ease-out forwards}@keyframes fxp{to{opacity:0}}`)
  if (c.bgmUrl) out.push(`.bgm{position:fixed;left:clamp(16px,3vw,32px);bottom:calc(20px + env(safe-area-inset-bottom));z-index:45}
.bgm button{display:flex;align-items:center;gap:12px;padding:8px 14px 8px 8px;border-radius:99px;background:color-mix(in srgb,var(--card) 82%,transparent);backdrop-filter:blur(8px);border:1px solid var(--line);color:var(--fg);cursor:pointer;font:inherit}
.bgm .rg{position:relative;width:28px;height:28px;border-radius:50%;border:1px dashed color-mix(in srgb,var(--fg) 40%,transparent);flex:none}
.bgm .rg::after{content:"";position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2.5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);transform:rotate(0) translateX(14px);animation:fxo 6s linear infinite;animation-play-state:paused}
.bgm.on .rg{border-style:solid}.bgm.on .rg::after{animation-play-state:running}
@keyframes fxo{to{transform:rotate(360deg) translateX(14px)}}
.bgm .tx{display:flex;flex-direction:column;line-height:1.25;text-align:left}
.bgm .tx b{font-size:12.5px;font-weight:600;letter-spacing:.04em;max-width:36vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bgm .tx small{font-size:10px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase}
.bgm .eq{display:flex;align-items:flex-end;gap:2px;height:12px}
.bgm .eq i{width:2px;height:100%;background:var(--accent);transform-origin:50% 100%;transform:scaleY(.25)}
.bgm.on .eq i{animation:fxe 1.1s ease-in-out infinite alternate}.bgm.on .eq i:nth-child(2){animation-delay:-.4s}.bgm.on .eq i:nth-child(3){animation-delay:-.8s}
@keyframes fxe{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`)

  if (on('gateOn')) out.push(`html.gated{overflow:hidden}
.fxgate{position:fixed;inset:0;z-index:100;display:grid;place-items:center;text-align:center;padding:24px;background:radial-gradient(ellipse 80% 70% at 50% 40%,color-mix(in srgb,var(--accent2) 30%,var(--bg)),var(--bg));color:var(--fg);transition:opacity 1s ease,filter 1s ease,visibility 1s}
.fxgate.out{opacity:0;filter:blur(10px);visibility:hidden;pointer-events:none}
.fxgate .gs{margin:0 0 14px;font:300 12px var(--body);letter-spacing:.4em;text-transform:uppercase;color:color-mix(in srgb,var(--fg) 62%,transparent)}
.fxgate .gt{margin:0;font:400 clamp(40px,9vw,110px)/1.1 var(--display);letter-spacing:-.04em;text-wrap:balance}
.fxgate .gb{margin-top:38px;padding:12px 4px;font:400 15px var(--body);letter-spacing:.2em;color:var(--fg);background:none;border:0;border-bottom:1px solid color-mix(in srgb,var(--fg) 40%,transparent);cursor:pointer;transition:border-color .4s,color .4s}
.fxgate .gb::before{content:"\\25C7  ";color:var(--accent)}
.fxgate .gb:hover,.fxgate .gb:focus-visible{border-color:var(--accent);color:var(--accent)}.fxgate .gb:focus-visible{outline:1px solid var(--accent);outline-offset:8px}`)
  if (lineSkin) out.push(LINE)
  out.push('@media(prefers-reduced-motion:reduce){.fxgrain,.fxsp,.bgm .rg::after,.bgm .eq i{animation:none!important}.fxgate{transition:none}html.rvon .rvt{opacity:1;transform:none;filter:none;transition:none}}')
  return out.join('\n')
}

export function fxHtml(c, title = '') {
  const on = (k) => c[k] === true
  const url = c.bgmUrl ? safeUrl(c.bgmUrl) : ''
  const music = url && url !== '#' && (/^https?:/i.test(url) || url.startsWith('/'))
  return [
    on('fxStars') ? '<canvas id="fxsky" aria-hidden="true"></canvas>' : '',
    ['snow', 'petal', 'leaf', 'firefly'].includes(c.fxFall) ? '<canvas id="fxfall" aria-hidden="true"></canvas>' : '',
    on('gateOn') ? `<div class="fxgate" id="fxgate" role="dialog" aria-label="입장"><div>${c.gateSub ? `<p class="gs">${esc(c.gateSub)}</p>` : ''}<h1 class="gt">${esc(c.gateTitle || title)}</h1><button type="button" class="gb">${esc(c.gateBtn || '입장하기')}</button></div></div>` : '',
    on('fxGrain') ? '<div class="fxgrain" aria-hidden="true"></div>' : '',
    on('fxVignette') ? '<div class="fxvig" aria-hidden="true"></div>' : '',
    music ? `<div class="bgm" id="bgm"><button type="button" aria-label="배경음악 재생 또는 정지"><span class="rg" aria-hidden="true"></span><span class="tx"><b>${esc(c.bgmTitle || 'BGM')}</b><small>sound off</small></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></button><audio src="${esc(url)}" loop preload="none"></audio></div>` : '',
  ].join('')
}

export function fxJs(c) {
  const on = (k) => c[k] === true
  const url = c.bgmUrl ? safeUrl(c.bgmUrl) : ''
  const music = url && url !== '#' && (/^https?:/i.test(url) || url.startsWith('/'))
  const reduce = 'matchMedia("(prefers-reduced-motion: reduce)").matches'
  const parts = []
  if (on('fxStars')) parts.push(`(function(){var cv=document.getElementById('fxsky');if(!cv)return;var x=cv.getContext('2d'),W=0,H=0,S=[],still=${reduce};
function size(){var r=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*r;H=cv.height=innerHeight*r;S=[];for(var i=0;i<Math.round(innerWidth*innerHeight/9000);i++)S.push({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*1.3+.3)*r,p:Math.random()*6.3,v:Math.random()*.4+.15,a:Math.random()*.6+.3})}
function col(){var f=getComputedStyle(document.body).color;return f}
function draw(t){x.clearRect(0,0,W,H);x.fillStyle=col();for(var i=0;i<S.length;i++){var s=S[i];x.globalAlpha=still?s.a*.7:s.a*(.45+.55*Math.sin(t/1000*s.v*2+s.p));x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill();if(!still){s.y-=s.v*.06*(devicePixelRatio||1);if(s.y<-4)s.y=H+4}}x.globalAlpha=1;if(!still)requestAnimationFrame(draw)}
size();addEventListener('resize',function(){size();if(still)draw(0)});if(still)draw(0);else requestAnimationFrame(draw)})();`)
  if (on('fxReveal')) parts.push(`(function(){if(!('IntersectionObserver' in window)||${reduce})return;var h=document.documentElement;
var sel='header>*,section>h2,section>p,section>ul,section>ol,section>dl,.card,.char,.win,.who,.tc,.ev .bd,.price,.q,.notice,.gal figure,.tools,.anni li,.people li';
var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest('dialog')});
if(!els.length)return;h.classList.add('rvon');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(e,i){var sib=e.parentNode?[].indexOf.call(e.parentNode.children,e):0;e.style.setProperty('--d',Math.min(sib,8)*70);e.classList.add('rvt');io.observe(e)});
setTimeout(function(){els.forEach(function(e){e.classList.add('in')})},6000)})();`)
  if (on('fxCursor')) {
    const kind = ['star', 'heart', 'paw'].includes(c.fxCursorKind) ? c.fxCursorKind : 'star'
    parts.push(`(function(){if(!matchMedia('(pointer: fine)').matches||${reduce})return;var kind='${kind}',n=0,last=0,lx=-999,ly=-999,side=1;
addEventListener('pointermove',function(e){var t=Date.now();if(kind==='paw'){var dx=e.clientX-lx,dy=e.clientY-ly,d=Math.sqrt(dx*dx+dy*dy);if(d<46||n>16)return;var ang=Math.atan2(dy,dx)*180/Math.PI+90;lx=e.clientX;ly=e.clientY;side=-side;n++;var s=document.createElement('i');s.className='fxsp paw';var ox=Math.cos((ang-90+90)*Math.PI/180)*8*side,oy=Math.sin((ang-90+90)*Math.PI/180)*8*side;s.style.left=(e.clientX+ox)+'px';s.style.top=(e.clientY+oy)+'px';s.style.transform='rotate('+ang+'deg)';document.body.appendChild(s);setTimeout(function(){s.remove();n--},1600);return}
if(t-last<45||n>14)return;last=t;n++;var s=document.createElement('i');s.className='fxsp'+(kind==='heart'?' heart':'');s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--dx',(Math.random()*30-15)+'px');document.body.appendChild(s);setTimeout(function(){s.remove();n--},900)},{passive:true})})();`)
  }
  if (['snow', 'petal', 'leaf', 'firefly'].includes(c.fxFall)) {
    parts.push(`(function(){var cv=document.getElementById('fxfall');if(!cv||${reduce})return;var kind='${c.fxFall}',x=cv.getContext('2d'),W=0,H=0,P=[];
var cs=getComputedStyle(document.documentElement),ac=(cs.getPropertyValue('--accent')||'#ffffff').trim(),a2=(cs.getPropertyValue('--accent2')||'#ffffff').trim();
var LEAF=['#d9822b','#c1581f','#e6a23c','#a8431a'];
function mk(init){var r=Math.random();return{x:Math.random()*W,y:init?Math.random()*H:-20,s:kind==='snow'?Math.random()*2.6+1.2:kind==='firefly'?Math.random()*2+1.2:Math.random()*6+5,v:Math.random()*.7+.4,sw:Math.random()*2+.5,p:Math.random()*6.28,rot:Math.random()*6.28,rv:(Math.random()-.5)*.04,c:kind==='leaf'?LEAF[(r*4)|0]:ac}}
function size(){var d=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d;var k=d;var N=Math.round(innerWidth/(kind==='firefly'?55:30));P=[];for(var i=0;i<N;i++){var q=mk(true);q.s*=k;P.push(q)}}
function step(t){x.clearRect(0,0,W,H);var d=Math.min(devicePixelRatio||1,2);for(var i=0;i<P.length;i++){var q=P[i];
if(kind==='firefly'){q.x+=Math.sin(t/1800+q.p)*.5*d;q.y+=Math.cos(t/2300+q.p)*.35*d-.05*d;var a=.35+.65*Math.abs(Math.sin(t/1200+q.p));x.globalAlpha=a;x.fillStyle=ac;x.shadowColor=ac;x.shadowBlur=14*d;x.beginPath();x.arc(q.x,q.y,q.s*d,0,6.283);x.fill();x.shadowBlur=0;if(q.x<-20)q.x=W+20;if(q.x>W+20)q.x=-20;if(q.y<-20)q.y=H+20;if(q.y>H+20)q.y=-20;continue}
q.y+=q.v*d*(kind==='snow'?1:1.25);q.x+=Math.sin(t/900+q.p)*q.sw*.35*d+(kind==='snow'?0:.35*d);q.rot+=q.rv;
if(kind==='snow'){x.globalAlpha=.9;x.fillStyle='#ffffff';x.strokeStyle=a2;x.lineWidth=.8*d;x.beginPath();x.arc(q.x,q.y,q.s*d,0,6.283);x.fill();x.stroke()}
else{x.save();x.translate(q.x,q.y);x.rotate(q.rot);x.globalAlpha=.85;x.fillStyle=q.c;x.beginPath();x.ellipse(0,0,q.s*d,q.s*d*.55,0,0,6.283);x.fill();x.restore()}
if(q.y>H+30||q.x>W+30){var m=mk(false);m.s*=d;P[i]=m}}
x.globalAlpha=1;requestAnimationFrame(step)}
size();addEventListener('resize',size);requestAnimationFrame(step)})();`)
  }
  if (on('gateOn')) {
    parts.push(`(function(){var g=document.getElementById('fxgate');if(!g)return;var h=document.documentElement,seen=false;
if(location.href.indexOf('about:')===0){g.remove();return}
try{seen=!!sessionStorage.getItem('fxg:'+document.title)}catch(e){}
if(seen){g.remove();return}
h.classList.add('gated');var b=g.querySelector('button');b.focus();
b.addEventListener('click',function(){g.classList.add('out');h.classList.remove('gated');try{sessionStorage.setItem('fxg:'+document.title,'1')}catch(e){}setTimeout(function(){g.remove()},1100)})})();`)
  }
  if (music) parts.push(`(function(){var w=document.getElementById('bgm');if(!w)return;var a=w.querySelector('audio'),b=w.querySelector('button'),s=w.querySelector('small');
b.addEventListener('click',function(){if(a.paused){a.play().then(function(){w.classList.add('on');s.textContent='sound on'},function(){s.textContent='cannot play'})}else{a.pause();w.classList.remove('on');s.textContent='sound off'}})})();`)
  return parts.join('\n')
}
