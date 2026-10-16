import { useEffect, useRef, useState } from 'react'
import { MOODS, fxCss } from './templates/fx.js'
import { startCursor, startFall, startStars } from './atmosphere.js'

const KEY = 'hero-studio:mood'
const FALLS = [['none', '없음'], ['snow', '눈'], ['petal', '벚꽃잎'], ['leaf', '낙엽'], ['firefly', '반딧불']]
const CURSORS = [['none', '없음'], ['star', '별'], ['heart', '하트'], ['paw', '고양이 발자국']]
const VARS = ['--bg', '--panel', '--fg', '--muted', '--line', '--accent']

const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }

// Live mood picker for the landing page: recolours the page and turns on the same effects the templates offer.
export default function Atmosphere() {
  const [s, setS] = useState(() => { const v = load(); return { mood: v.mood || '', fall: v.fall || 'none', cursor: v.cursor || 'none', stars: !!v.stars } })
  const starsRef = useRef(null), fallRef = useRef(null)
  const mood = MOODS.find((m) => m.id === s.mood)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* private mode */ } }, [s])

  useEffect(() => {
    const root = document.documentElement, r = root.style
    if (mood) {
      root.dataset.mood = mood.id
      r.setProperty('--bg', mood.bg); r.setProperty('--panel', mood.card); r.setProperty('--fg', mood.fg)
      r.setProperty('--muted', `color-mix(in srgb, ${mood.fg} 62%, ${mood.bg})`); r.setProperty('--line', `color-mix(in srgb, ${mood.fg} 16%, ${mood.bg})`); r.setProperty('--accent', mood.accent)
      const dark = parseInt(mood.bg.slice(1, 3), 16) * 0.3 + parseInt(mood.bg.slice(3, 5), 16) * 0.59 + parseInt(mood.bg.slice(5, 7), 16) * 0.11 < 110
      r.colorScheme = dark ? 'dark' : 'light'
    } else { VARS.forEach((v) => r.removeProperty(v)); r.colorScheme = ''; delete root.dataset.mood }
    return () => { VARS.forEach((v) => r.removeProperty(v)); r.colorScheme = ''; delete root.dataset.mood }
  }, [mood])

  useEffect(() => (s.stars ? startStars(starsRef.current) : undefined), [s.stars, s.mood])
  useEffect(() => startFall(fallRef.current, s.fall, mood?.accent || '#ff7aa2', mood?.accent2 || '#ffd1e6'), [s.fall, s.mood]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => startCursor(s.cursor), [s.cursor])

  // Picking a mood also switches on the effects that belong to it.
  const pick = (m) => setS(m ? { mood: m.id, fall: m.fxFall || 'none', cursor: m.fxCursor ? m.fxCursorKind || 'star' : 'none', stars: !!m.fxStars } : { mood: '', fall: 'none', cursor: 'none', stars: false })

  return (
    <section className="l-sec l-mood" id="mood" aria-labelledby="mood-title">
      <style>{fxCss({ fxCursor: true })}</style>
      <canvas ref={starsRef} className="atm-cv" aria-hidden="true" />
      <canvas ref={fallRef} className="atm-cv" aria-hidden="true" />
      <h2 id="mood-title">분위기를 먼저 느껴 보세요</h2>
      <p className="l-lead">무드를 누르면 이 페이지에 바로 입혀져요. 마우스를 움직이거나 아래로 스크롤해 보세요. 모든 덕질 템플릿에서 똑같이 쓸 수 있어요.</p>
      <div className="mood-chips" role="group" aria-label="무드">
        <button aria-pressed={!s.mood} onClick={() => pick(null)}><i style={{ background: 'var(--line)' }} />기본</button>
        {MOODS.map((m) => (
          <button key={m.id} aria-pressed={s.mood === m.id} onClick={() => pick(m)}>
            <i style={{ background: `linear-gradient(135deg, ${m.bg} 50%, ${m.accent} 50%)`, borderColor: m.fg }} />{m.label}
          </button>
        ))}
      </div>
      <div className="mood-rows">
        <div role="group" aria-label="떨어지는 입자"><b>입자</b>{FALLS.map(([id, label]) => <button key={id} aria-pressed={s.fall === id} onClick={() => setS((v) => ({ ...v, fall: id }))}>{label}</button>)}</div>
        <div role="group" aria-label="마우스 자국"><b>마우스 자국</b>{CURSORS.map(([id, label]) => <button key={id} aria-pressed={s.cursor === id} onClick={() => setS((v) => ({ ...v, cursor: id }))}>{label}</button>)}</div>
        <div role="group" aria-label="별무리"><b>별무리</b><button aria-pressed={s.stars} onClick={() => setS((v) => ({ ...v, stars: !v.stars }))}>{s.stars ? '켜짐' : '꺼짐'}</button></div>
      </div>
    </section>
  )
}
