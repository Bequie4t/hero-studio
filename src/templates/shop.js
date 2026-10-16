import { sectionDefaults, sectionFields, sections } from './sections.js'
import { esc, fontHead, fontsHref, hex, imgSrc, list, multi, pick, safeUrl, slug } from './util.js'

// Template: storefront product hero (photo, price, rating, perks).
const PALETTES = [
  { id: 'clay', label: 'Clay', bg: '#f3ece4', fg: '#2a1d16', accent: '#c4572f' },
  { id: 'moss', label: 'Moss', bg: '#e9eee3', fg: '#1d2a1c', accent: '#4f7a3a' },
  { id: 'ink', label: 'Ink', bg: '#101113', fg: '#f1efe8', accent: '#e8b04a' },
  { id: 'sky', label: 'Sky', bg: '#e6eef6', fg: '#14202e', accent: '#2f6fb7' },
]

const FONTS = [
  { id: 'fraunces', label: 'Fraunces', css: "'Fraunces'", q: 'Fraunces:wght@400;600;800' },
  { id: 'bricolage', label: 'Bricolage Grotesque', css: "'Bricolage Grotesque'", q: 'Bricolage+Grotesque:wght@400;600;800' },
  { id: 'outfit', label: 'Outfit', css: "'Outfit'", q: 'Outfit:wght@400;500;700' },
]

const defaults = {
  ...sectionDefaults,
  featuresTitle: 'Why you will love it',
  features: 'Hand thrown | Every mug is shaped on a wheel, so no two are alike.\nStays warm | Thick walls hold heat for up to two hours.\nBuilt to last | A food-safe glaze that survives the dishwasher.',
  pricingOn: false,
  footerText: '© 2026 Kiln & Co. Made in small batches.',
  brand: 'Kiln & Co.',
  nav: 'Shop, Story, Care, Cart',
  badge: 'New glaze: Moss',
  heading: 'The mug that keeps\nyour coffee warm.',
  subtitle: 'Thrown by hand, glazed twice and fired for ten hours. A mug heavy enough to feel good and light enough to use every day.',
  price: '$38',
  comparePrice: '$46',
  rating: '4.9',
  reviews: '1,284 reviews',
  perks: 'Dishwasher safe, Lead-free glaze, Free shipping over $60',
  cta: 'Add to cart',
  ctaUrl: '#cart',
  link: 'Read the story',
  linkUrl: '#story',
  photo: '',
  photoAlt: '',
  bg: PALETTES[0].bg,
  fg: PALETTES[0].fg,
  accent: PALETTES[0].accent,
  font: 'fraunces',
}

const fields = [
  { group: 'Product', open: true, items: [
    { key: 'brand', label: 'Shop name', type: 'text' },
    { key: 'badge', label: 'Badge', type: 'text', hint: 'Leave empty to hide.' },
    { key: 'heading', label: 'Product headline', type: 'textarea', rows: 2, hint: 'One line per row, up to 3.' },
    { key: 'subtitle', label: 'Description', type: 'textarea', rows: 3 },
    { key: 'photo', label: 'Product photo', type: 'image', hint: 'Resized in your browser and stored inside the file.' },
    { key: 'photoAlt', label: 'Photo description', type: 'text', hint: 'Read aloud by screen readers.' },
    { key: 'price', label: 'Price', type: 'text', half: true },
    { key: 'comparePrice', label: 'Old price', type: 'text', half: true },
    { key: 'rating', label: 'Rating', type: 'text', half: true },
    { key: 'reviews', label: 'Review count', type: 'text', half: true },
    { key: 'perks', label: 'Perks', type: 'text', hint: 'Comma separated.' },
  ] },
  { group: 'Buttons and menu', items: [
    { key: 'nav', label: 'Menu', type: 'text', hint: 'Comma separated.' },
    { key: 'cta', label: 'Button text', type: 'text', half: true },
    { key: 'ctaUrl', label: 'Button link', type: 'text', half: true },
    { key: 'link', label: 'Second link', type: 'text', half: true },
    { key: 'linkUrl', label: 'Second URL', type: 'text', half: true },
  ] },
  { group: 'Style', items: [
    { type: 'palette' },
    { type: 'colors', keys: [['bg', 'Background'], ['fg', 'Text'], ['accent', 'Accent']] },
    { key: 'font', label: 'Font', type: 'select', options: FONTS },
  ] },
  ...sectionFields,
]

// "Save 17%" from two prices such as "$38" and "$46"; empty when they cannot be compared.
function saving(price, was) {
  const n = (s) => parseFloat(String(s).replace(/[^0-9.]/g, ''))
  const p = n(price), w = n(was)
  return p > 0 && w > p ? `Save ${Math.round((1 - p / w) * 100)}%` : ''
}

function build(input, { fontCss } = {}) {
  const c = { ...defaults, ...input }
  const f = pick(FONTS, c.font)
  const bg = hex(c.bg, '#f3ece4'), fg = hex(c.fg, '#2a1d16'), accent = hex(c.accent, '#c4572f')
  const sx = sections(c)
  const brand = c.brand || 'Your shop'
  const heading = String(c.heading || '').split('\n').slice(0, 3)
  const photo = imgSrc(c.photo)
  const save = saving(c.price, c.comparePrice)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(brand)} — ${esc(heading.join(' '))}</title>
<meta name="description" content="${esc(c.subtitle)}">
${fontHead(fontCss, fontsHref(f.q))}
<style>
:root{--bg:${bg};--fg:${fg};--accent:${accent};--font:${f.css},Georgia,serif;--dim:color-mix(in srgb,var(--fg) 64%,var(--bg));--line:color-mix(in srgb,var(--fg) 18%,var(--bg));--sx-accent:var(--accent);--sx-head:var(--font);--sx-body:var(--font);--sx-radius:14px}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:400 17px/1.55 var(--font);overflow-x:hidden}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.first{min-height:100svh;display:flex;flex-direction:column;padding:0 clamp(18px,4vw,48px)}
.top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0}
.brand{font-weight:800;font-size:21px;letter-spacing:-.02em;text-decoration:none}
.top nav{display:flex;gap:clamp(14px,2.6vw,34px)}
.top nav a{text-decoration:none;font-size:15px;font-weight:500}
.top nav a:hover{color:var(--accent)}
.hero{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,80px);align-items:center;padding:clamp(8px,2vw,24px) 0 clamp(32px,5vw,64px)}
.badge{display:inline-block;margin-bottom:20px;padding:6px 14px;border-radius:99px;background:var(--accent);color:var(--bg);font-size:13px;font-weight:700;font-family:system-ui,sans-serif}
h1{margin:0 0 18px;font:800 clamp(38px,6vw,84px)/.98 var(--font);letter-spacing:-.035em;text-wrap:balance}
h1 span{display:block}
.rate{display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px;margin:0 0 18px;font:500 14px system-ui,sans-serif;color:var(--dim)}
.rate b{color:var(--accent);letter-spacing:2px;font-size:16px}
.sub{max-width:44ch;margin:0 0 24px;font-size:clamp(16px,1.6vw,19px);color:var(--dim)}
.price{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 14px;margin-bottom:24px}
.price strong{font:800 clamp(34px,4vw,48px)/1 var(--font);letter-spacing:-.03em}
.price s{color:var(--dim);font-size:20px}
.price em{font:700 13px system-ui,sans-serif;font-style:normal;color:var(--accent);border:1.5px solid var(--accent);border-radius:99px;padding:3px 10px}
.ctas{display:flex;align-items:center;flex-wrap:wrap;gap:14px 24px;margin-bottom:28px}
.btn{display:inline-block;background:var(--fg);color:var(--bg);padding:16px 34px;border-radius:99px;font:700 16px system-ui,sans-serif;text-decoration:none;transition:transform .15s,background .15s}
.btn:hover{transform:translateY(-2px);background:var(--accent)}
.link{font:600 15px system-ui,sans-serif;text-decoration:none;border-bottom:1.5px solid var(--accent);padding-bottom:1px}
.perks{display:flex;flex-wrap:wrap;gap:8px 22px;list-style:none;margin:0;padding:0;font:500 14px system-ui,sans-serif;color:var(--dim)}
.perks li::before{content:"✓";color:var(--accent);margin-right:8px;font-weight:700}
.frame{position:relative;aspect-ratio:4/5;border-radius:28px;overflow:hidden;background:color-mix(in srgb,var(--accent) 22%,var(--bg));min-width:0}
.frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.frame .art::before,.frame .art::after{content:"";position:absolute;border-radius:50%}
.frame .art::before{width:78%;aspect-ratio:1;left:11%;top:13%;background:radial-gradient(circle at 34% 30%,color-mix(in srgb,var(--accent) 55%,#fff),var(--accent) 62%,color-mix(in srgb,var(--accent) 60%,#000))}
.frame .art::after{width:38%;aspect-ratio:1;right:8%;bottom:7%;background:var(--bg);opacity:.9}
@media(max-width:820px){.hero{grid-template-columns:1fr}.top nav{display:none}.frame{max-width:520px}}
@media(prefers-reduced-motion:reduce){.btn{transition:none}}
${sx.css}</style>
</head>
<body>
<div class="first">
<header class="top">
  <a class="brand" href="#">${esc(brand)}</a>
  <nav aria-label="Main">${list(c.nav).map((n) => `<a href="#${esc(slug(n))}">${esc(n)}</a>`).join('')}</nav>
</header>
<main class="hero">
  <div>
    ${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}
    <h1>${heading.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
    ${c.rating ? `<p class="rate"><b aria-hidden="true">★★★★★</b><span>${esc(c.rating)} out of 5</span>${c.reviews ? `<span>· ${esc(c.reviews)}</span>` : ''}</p>` : ''}
    <p class="sub">${multi(c.subtitle)}</p>
    <div class="price"><strong>${esc(c.price)}</strong>${c.comparePrice ? `<s>${esc(c.comparePrice)}</s>` : ''}${save ? `<em>${esc(save)}</em>` : ''}</div>
    <div class="ctas">
      <a class="btn" href="${esc(safeUrl(c.ctaUrl))}">${esc(c.cta)}</a>
      ${c.link ? `<a class="link" href="${esc(safeUrl(c.linkUrl))}">${esc(c.link)}</a>` : ''}
    </div>
    <ul class="perks">${list(c.perks).map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
  </div>
  <div class="frame">${photo ? `<img src="${photo}" alt="${esc(c.photoAlt)}">` : '<div class="art" aria-hidden="true"></div>'}</div>
</main>
</div>
${sx.html}
</body>
</html>
`
}

export default {
  id: 'shop',
  name: 'Storefront',
  blurb: 'A product page hero with your photo, price, rating and perks.',
  tag: 'Shop',
  defaults,
  fields,
  palettes: PALETTES,
  build,
  fonts: (c) => [{ ...defaults, ...c }.font],
}
