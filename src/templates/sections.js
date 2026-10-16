import { esc, list, safeUrl } from './util.js'

// Optional sections that sit under every template's first screen: features, pricing, footer.
// They only read the host page's --bg / --fg and these hooks, set per template:
//   --sx-accent  accent colour    --sx-head  heading font stack    --sx-radius  corner radius
export const sectionDefaults = {
  featuresOn: true,
  featuresTitle: 'What you get',
  features:
    'Fast to start | Pick a template, change the words, and you are done in minutes.\nYours to keep | Download plain files and host them anywhere you like.\nBuilt to adapt | Colours, fonts and sections change with one click.',
  pricingOn: true,
  pricingTitle: 'Simple pricing',
  plans:
    'Free | $0 | To get started | One project;Community help\n*Pro | $9/mo | For regular use | Unlimited projects;Priority help\nTeam | $7/seat | For small crews | Shared settings;Admin controls',
  footerOn: true,
  footerText: '© 2026 Your brand. All rights reserved.',
  footerLinks: 'Privacy, Terms, Contact',
}

export const sectionFields = [
  { group: '기능 소개 섹션', items: [
    { key: 'featuresOn', label: '기능 소개 보이기', type: 'check' },
    { key: 'featuresTitle', label: '제목', type: 'text' },
    { key: 'features', label: '기능', type: 'textarea', rows: 6, hint: '한 줄에 하나: 제목 | 설명 (최대 6개)' },
  ] },
  { group: '가격표 섹션', items: [
    { key: 'pricingOn', label: '가격표 보이기', type: 'check' },
    { key: 'pricingTitle', label: '제목', type: 'text' },
    { key: 'plans', label: '요금제', type: 'textarea', rows: 6, hint: '한 줄에 하나: 이름 | 가격 | 설명 | 항목;항목 (최대 4개). 줄 맨 앞에 *를 붙이면 강조돼요.' },
  ] },
  { group: '푸터', items: [
    { key: 'footerOn', label: '푸터 보이기', type: 'check' },
    { key: 'footerText', label: '푸터 문구', type: 'text' },
    { key: 'footerLinks', label: '푸터 링크', type: 'text', hint: '쉼표(,)로 구분해요.' },
  ] },
]

const parts = (line) => line.split('|').map((s) => s.trim())

export function sections(c) {
  const feats = String(c.features || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 6)
  const plans = String(c.plans || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 4)
  let html = ''

  if (c.featuresOn && feats.length) {
    html += `<section class="sx-sec" id="features"><h2>${esc(c.featuresTitle)}</h2><div class="sx-grid">${feats
      .map((l) => {
        const [t, d] = parts(l)
        return `<article class="sx-card"><h3>${esc(t)}</h3><p>${esc(d || '')}</p></article>`
      })
      .join('')}</div></section>`
  }

  if (c.pricingOn && plans.length) {
    html += `<section class="sx-sec" id="pricing"><h2>${esc(c.pricingTitle)}</h2><div class="sx-grid sx-plans">${plans
      .map((l) => {
        const hi = l.startsWith('*')
        const [n, price, blurb, perks] = parts(hi ? l.slice(1) : l)
        const items = String(perks || '').split(';').map((s) => s.trim()).filter(Boolean)
        return `<article class="sx-card sx-plan${hi ? ' hi' : ''}"><h3>${esc(n)}</h3><p class="sx-price">${esc(price || '')}</p><p>${esc(blurb || '')}</p><ul>${items
          .map((i) => `<li>${esc(i)}</li>`)
          .join('')}</ul><a class="sx-btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta || 'Get started')}</a></article>`
      })
      .join('')}</div></section>`
  }

  if (c.footerOn) {
    html += `<footer class="sx-foot"><span>${esc(c.footerText)}</span><nav aria-label="Footer">${list(c.footerLinks)
      .map((l) => `<a href="#">${esc(l)}</a>`)
      .join('')}</nav></footer>`
  }

  const css = html
    ? `
.sx-sec,.sx-foot{--sx-line:color-mix(in srgb,var(--fg) 16%,var(--bg));--sx-dim:color-mix(in srgb,var(--fg) 62%,var(--bg));font-family:var(--sx-body,inherit)}
.sx-sec{max-width:1200px;margin:0 auto;padding:clamp(48px,8vw,104px) clamp(18px,4vw,48px) 0}
.sx-sec h2{margin:0 0 28px;font:700 clamp(26px,3.6vw,44px)/1.08 var(--sx-head);letter-spacing:-.025em}
.sx-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px}
.sx-card{border:1px solid var(--sx-line);border-radius:var(--sx-radius,0);padding:24px;background:color-mix(in srgb,var(--bg) 94%,var(--fg));min-width:0}
.sx-card h3{margin:0 0 8px;font:700 19px/1.2 var(--sx-head);letter-spacing:-.01em}
.sx-card p{margin:0;color:var(--sx-dim);font-size:15px}
.sx-plan{display:flex;flex-direction:column;gap:12px}
.sx-plan.hi{border-color:var(--sx-accent);box-shadow:0 0 0 1px var(--sx-accent)}
.sx-price{font:700 34px/1 var(--sx-head)!important;color:var(--fg)!important;letter-spacing:-.03em}
.sx-plan ul{margin:4px 0 8px;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;flex:1;font-size:14px}
.sx-plan li::before{content:"";display:inline-block;width:8px;height:8px;margin-right:10px;background:var(--sx-accent);border-radius:calc(var(--sx-radius,0px)/4)}
.sx-btn{display:block;text-align:center;padding:12px 18px;border-radius:var(--sx-radius,0);border:1px solid var(--fg);font-weight:700;font-size:14px;text-decoration:none;color:var(--fg)}
.sx-plan.hi .sx-btn{background:var(--fg);color:var(--bg)}
.sx-btn:hover{border-color:var(--sx-accent)}
.sx-foot{width:min(1200px - 2*clamp(18px,4vw,48px),100% - 2*clamp(18px,4vw,48px));margin:clamp(48px,8vw,104px) auto 0;padding:24px 0 36px;border-top:1px solid var(--sx-line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px 24px;font-size:13px;color:var(--sx-dim)}
.sx-foot nav{display:flex;gap:20px}
.sx-foot a{text-decoration:none}
.sx-foot a:hover{color:var(--fg)}
`
    : ''
  return { css, html }
}
