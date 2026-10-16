// Shared helpers for every template. All user text goes through these before reaching HTML.
export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const multi = (s) => esc(s).replace(/\n/g, '<br>')
export const safeUrl = (u) => (/^(https?:\/\/|#|\/|mailto:)/i.test(String(u || '').trim()) ? String(u).trim() : '#')
export const hex = (c, fallback) => (/^#[0-9a-f]{6}$/i.test(c) ? c : fallback)
export const list = (s) => String(s ?? '').split(',').map((x) => x.trim()).filter(Boolean)
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Number(n) || lo))
export const pick = (arr, id) => arr.find((x) => x.id === id) || arr[0]
export const jsonForScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c')
export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-')
export const fontsHref = (...qs) => `https://fonts.googleapis.com/css2?${qs.map((q) => 'family=' + q).join('&')}&display=swap`

export const MONO_FONTS = [
  { id: 'jetbrains', label: 'JetBrains Mono', css: "'JetBrains Mono'", q: 'JetBrains+Mono:wght@400;500;700' },
  { id: 'plex', label: 'IBM Plex Mono', css: "'IBM Plex Mono'", q: 'IBM+Plex+Mono:wght@400;500;600' },
  { id: 'space', label: 'Space Mono', css: "'Space Mono'", q: 'Space+Mono:wght@400;700' },
]

// Embedded @font-face rules when available (self-contained pages); otherwise the Google Fonts links.
export const fontHead = (fontCss, href) =>
  fontCss
    ? `<style id="fonts">${fontCss}</style>`
    : !href
    ? ''
    : `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${href}">`

// Only embedded raster images are accepted, so an uploaded field can never carry markup.
export const imgSrc = (u) => (/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(String(u || '')) ? u : '')

// Line-based fields: "one item per line", columns separated by "|".
export const lines = (s, max = 99) => String(s ?? '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, max)
export const cols = (l) => String(l).split('|').map((s) => s.trim())
export const imgs = (arr, max = 8) => (Array.isArray(arr) ? arr : []).map(imgSrc).filter(Boolean).slice(0, max)
export const initial = (s) => ([...String(s || '?').trim()][0] || '?')
export const ymd = (s) => (/^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? String(s) : '')
