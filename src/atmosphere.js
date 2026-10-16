// Live versions of the page atmosphere (stars, falling particles, cursor trail) for the app's own landing page.
// The generated pages carry the same effects as inline scripts (src/templates/fx.js).
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export function startStars(cv, color = () => getComputedStyle(document.body).color) {
  if (!cv) return () => {}
  const x = cv.getContext('2d')
  const still = reduced()
  let W = 0, H = 0, S = [], raf = 0, stopped = false
  const size = () => {
    const r = Math.min(devicePixelRatio || 1, 2)
    W = cv.width = innerWidth * r; H = cv.height = innerHeight * r
    S = Array.from({ length: Math.round((innerWidth * innerHeight) / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.3 + 0.3) * r, p: Math.random() * 6.3, v: Math.random() * 0.4 + 0.15, a: Math.random() * 0.6 + 0.3 }))
  }
  const draw = (t) => {
    if (stopped) return
    x.clearRect(0, 0, W, H); x.fillStyle = color()
    for (const s of S) {
      x.globalAlpha = still ? s.a * 0.7 : s.a * (0.45 + 0.55 * Math.sin((t / 1000) * s.v * 2 + s.p))
      x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.283); x.fill()
      if (!still) { s.y -= s.v * 0.06 * (devicePixelRatio || 1); if (s.y < -4) s.y = H + 4 }
    }
    x.globalAlpha = 1
    if (!still) raf = requestAnimationFrame(draw)
  }
  size(); addEventListener('resize', size)
  still ? draw(0) : (raf = requestAnimationFrame(draw))
  return () => { stopped = true; cancelAnimationFrame(raf); removeEventListener('resize', size); x.clearRect(0, 0, W, H) }
}

const LEAF = ['#d9822b', '#c1581f', '#e6a23c', '#a8431a']

export function startFall(cv, kind, accent, accent2) {
  if (!cv || !kind || kind === 'none' || reduced()) return () => {}
  const x = cv.getContext('2d')
  let W = 0, H = 0, P = [], raf = 0, stopped = false
  const dpr = () => Math.min(devicePixelRatio || 1, 2)
  const mk = (init) => ({
    x: Math.random() * W, y: init ? Math.random() * H : -20,
    s: (kind === 'snow' ? Math.random() * 2.6 + 1.2 : kind === 'firefly' ? Math.random() * 2 + 1.2 : Math.random() * 6 + 5) * dpr(),
    v: Math.random() * 0.7 + 0.4, sw: Math.random() * 2 + 0.5, p: Math.random() * 6.28, rot: Math.random() * 6.28, rv: (Math.random() - 0.5) * 0.04,
    c: kind === 'leaf' ? LEAF[(Math.random() * 4) | 0] : accent,
  })
  const size = () => {
    W = cv.width = innerWidth * dpr(); H = cv.height = innerHeight * dpr()
    P = Array.from({ length: Math.round(innerWidth / (kind === 'firefly' ? 55 : 30)) }, () => mk(true))
  }
  const step = (t) => {
    if (stopped) return
    const d = dpr()
    x.clearRect(0, 0, W, H)
    P.forEach((q, i) => {
      if (kind === 'firefly') {
        q.x += Math.sin(t / 1800 + q.p) * 0.5 * d; q.y += Math.cos(t / 2300 + q.p) * 0.35 * d - 0.05 * d
        x.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 1200 + q.p)); x.fillStyle = accent; x.shadowColor = accent; x.shadowBlur = 14 * d
        x.beginPath(); x.arc(q.x, q.y, q.s, 0, 6.283); x.fill(); x.shadowBlur = 0
        if (q.x < -20) q.x = W + 20; if (q.x > W + 20) q.x = -20; if (q.y < -20) q.y = H + 20; if (q.y > H + 20) q.y = -20
        return
      }
      q.y += q.v * d * (kind === 'snow' ? 1 : 1.25); q.x += Math.sin(t / 900 + q.p) * q.sw * 0.35 * d + (kind === 'snow' ? 0 : 0.35 * d); q.rot += q.rv
      if (kind === 'snow') {
        x.globalAlpha = 0.9; x.fillStyle = '#ffffff'; x.strokeStyle = accent2; x.lineWidth = 0.8 * d
        x.beginPath(); x.arc(q.x, q.y, q.s, 0, 6.283); x.fill(); x.stroke()
      } else {
        x.save(); x.translate(q.x, q.y); x.rotate(q.rot); x.globalAlpha = 0.85; x.fillStyle = q.c
        x.beginPath(); x.ellipse(0, 0, q.s, q.s * 0.55, 0, 0, 6.283); x.fill(); x.restore()
      }
      if (q.y > H + 30 || q.x > W + 30) P[i] = mk(false)
    })
    x.globalAlpha = 1
    raf = requestAnimationFrame(step)
  }
  size(); addEventListener('resize', size); raf = requestAnimationFrame(step)
  return () => { stopped = true; cancelAnimationFrame(raf); removeEventListener('resize', size); x.clearRect(0, 0, W, H) }
}

export function startCursor(kind) {
  if (!kind || kind === 'none' || !matchMedia('(pointer: fine)').matches || reduced()) return () => {}
  let n = 0, last = 0, lx = -999, ly = -999, side = 1
  const live = new Set()
  const spawn = (el, ms) => { document.body.appendChild(el); live.add(el); setTimeout(() => { el.remove(); live.delete(el); n-- }, ms) }
  const move = (e) => {
    const t = Date.now()
    if (kind === 'paw') {
      const dx = e.clientX - lx, dy = e.clientY - ly
      if (Math.hypot(dx, dy) < 46 || n > 16) return
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90
      lx = e.clientX; ly = e.clientY; side = -side; n++
      const s = document.createElement('i'); s.className = 'fxsp paw'
      s.style.left = e.clientX + Math.cos((ang * Math.PI) / 180) * 8 * side + 'px'; s.style.top = e.clientY + Math.sin((ang * Math.PI) / 180) * 8 * side + 'px'
      s.style.transform = `rotate(${ang}deg)`; spawn(s, 1600); return
    }
    if (t - last < 45 || n > 14) return
    last = t; n++
    const s = document.createElement('i'); s.className = 'fxsp' + (kind === 'heart' ? ' heart' : '')
    s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; s.style.setProperty('--dx', Math.random() * 30 - 15 + 'px'); spawn(s, 900)
  }
  addEventListener('pointermove', move, { passive: true })
  return () => { removeEventListener('pointermove', move); live.forEach((el) => el.remove()); live.clear() }
}
