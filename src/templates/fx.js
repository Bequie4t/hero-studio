import { esc, safeUrl } from './util.js'

// Atmosphere layer shared by the Korean templates: star field, film grain, vignette, scroll reveal,
// cursor sparkles and a background-music button. Everything is opt-in and off for visitors who
// prefer reduced motion.
export const fxDefaults = { fxStars: false, fxGrain: false, fxVignette: false, fxReveal: true, fxCursor: false, bgmUrl: '', bgmTitle: '' }

export const fxOf = (p) => Object.fromEntries(['fxStars', 'fxGrain', 'fxVignette', 'fxCursor'].filter((k) => k in p).map((k) => [k, p[k]]))

export const fxGroup = {
  group: '분위기 효과',
  items: [
    { key: 'fxReveal', label: '스크롤하면 부드럽게 나타나기', type: 'check' },
    { key: 'fxStars', label: '반짝이는 별무리 배경', type: 'check' },
    { key: 'fxGrain', label: '필름 입자 질감', type: 'check' },
    { key: 'fxVignette', label: '가장자리 어둡게(비네트)', type: 'check' },
    { key: 'fxCursor', label: '마우스를 따라 반짝임', type: 'check' },
    { key: 'bgmUrl', label: '배경음악 주소', type: 'text', hint: 'mp3 같은 음악 파일의 https 주소. 방문자가 버튼을 눌러야 재생돼요. 비우면 숨겨요.' },
    { key: 'bgmTitle', label: '배경음악 제목', type: 'text', half: true },
  ],
}

const NOISE = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0"/></filter><rect width="160" height="160" filter="url(#n)"/></svg>')

export function fxCss(c) {
  const on = (k) => c[k] === true
  const out = []
  if (on('fxStars') || on('fxGrain') || on('fxVignette') || c.bgmUrl) out.push('.page,.wrap,header,main,footer{position:relative;z-index:2}')
  if (on('fxStars')) out.push('#fxsky{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}')
  if (on('fxGrain')) out.push(`.fxgrain{position:fixed;inset:-50%;z-index:40;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,${NOISE}");animation:fxg 1.2s steps(6) infinite}@keyframes fxg{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-5%)}60%{transform:translate(-6%,-2%)}80%{transform:translate(5%,4%)}100%{transform:translate(0,0)}}`)
  if (on('fxVignette')) out.push('.fxvig{position:fixed;inset:0;z-index:39;pointer-events:none;background:radial-gradient(ellipse 120% 100% at 50% 50%,transparent 58%,color-mix(in srgb,var(--bg) 55%,#000) 100%)}')
  if (on('fxReveal')) out.push('html.rvon .rvt{opacity:0;transform:translate3d(0,34px,0) scale(.99);filter:blur(7px);transition:opacity 1.2s cubic-bezier(.16,1,.3,1) calc(var(--d,0)*1ms),transform 1.5s cubic-bezier(.16,1,.3,1) calc(var(--d,0)*1ms),filter 1.2s cubic-bezier(.16,1,.3,1) calc(var(--d,0)*1ms)}html.rvon .rvt.in{opacity:1;transform:none;filter:none}@media(max-width:760px){html.rvon .rvt{filter:none}}')
  if (on('fxCursor')) out.push('.fxsp{position:fixed;z-index:60;width:12px;height:12px;margin:-6px 0 0 -6px;pointer-events:none;background:var(--accent);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:fxs .9s ease-out forwards}@keyframes fxs{to{opacity:0;transform:translate(var(--dx,0px),22px) rotate(90deg) scale(.2)}}')
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
  out.push('@media(prefers-reduced-motion:reduce){.fxgrain,.fxsp,.bgm .rg::after,.bgm .eq i{animation:none!important}html.rvon .rvt{opacity:1;transform:none;filter:none;transition:none}}')
  return out.join('\n')
}

export function fxHtml(c) {
  const on = (k) => c[k] === true
  const url = c.bgmUrl ? safeUrl(c.bgmUrl) : ''
  const music = url && url !== '#' && /^https?:/i.test(url)
  return [
    on('fxStars') ? '<canvas id="fxsky" aria-hidden="true"></canvas>' : '',
    on('fxGrain') ? '<div class="fxgrain" aria-hidden="true"></div>' : '',
    on('fxVignette') ? '<div class="fxvig" aria-hidden="true"></div>' : '',
    music ? `<div class="bgm" id="bgm"><button type="button" aria-label="배경음악 재생 또는 정지"><span class="rg" aria-hidden="true"></span><span class="tx"><b>${esc(c.bgmTitle || 'BGM')}</b><small>sound off</small></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></button><audio src="${esc(url)}" loop preload="none"></audio></div>` : '',
  ].join('')
}

export function fxJs(c) {
  const on = (k) => c[k] === true
  const url = c.bgmUrl ? safeUrl(c.bgmUrl) : ''
  const music = url && url !== '#' && /^https?:/i.test(url)
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
  if (on('fxCursor')) parts.push(`(function(){if(!matchMedia('(pointer: fine)').matches||${reduce})return;var n=0,last=0;addEventListener('pointermove',function(e){var t=Date.now();if(t-last<45||n>14)return;last=t;n++;var s=document.createElement('i');s.className='fxsp';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--dx',(Math.random()*30-15)+'px');document.body.appendChild(s);setTimeout(function(){s.remove();n--},900)},{passive:true})})();`)
  if (music) parts.push(`(function(){var w=document.getElementById('bgm');if(!w)return;var a=w.querySelector('audio'),b=w.querySelector('button'),s=w.querySelector('small');
b.addEventListener('click',function(){if(a.paused){a.play().then(function(){w.classList.add('on');s.textContent='sound on'},function(){s.textContent='cannot play'})}else{a.pause();w.classList.remove('on');s.textContent='sound off'}})})();`)
  return parts.join('\n')
}
