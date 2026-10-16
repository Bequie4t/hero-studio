import { useEffect, useMemo, useRef, useState } from 'react'

import { makeZip } from './export/zip.js'
import { toReactProject } from './export/react.js'
import { charsOf, fontCss, weightsOf } from './fonts/index.js'
import { paletteFromImage, readImage } from './images.js'
import { useFontCss } from './useFonts.js'

const DEVICES = { desktop: ['데스크톱', '100%'], tablet: ['태블릿', '820px'], mobile: ['모바일', '390px'] }

function Field({ id, label, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  )
}

const HOSTS = [
  { name: 'Netlify Drop', tag: '가장 쉬워요', url: 'https://app.netlify.com/drop', steps: ['아래 "배포용 zip 받기"로 파일을 받아요.', '위 주소를 열고 zip 파일을 화면에 끌어다 놓아요.', '바로 주소가 생겨요. 계정을 만들면 사이트를 계속 유지할 수 있어요.'] },
  { name: 'Cloudflare Pages', tag: '직접 업로드', url: 'https://dash.cloudflare.com/', steps: ['Cloudflare에 로그인하고 Workers & Pages에서 Pages를 만들어요.', '"직접 업로드"를 고르고 받은 zip을 올려요.', '배포가 끝나면 .pages.dev 주소로 열려요.'] },
  { name: 'GitHub Pages', tag: '깃허브를 쓴다면', url: 'https://pages.github.com/', steps: ['GitHub에서 새 저장소를 만들고 zip 안의 index.html을 올려요.', '저장소 Settings → Pages에서 배포할 브랜치를 골라요.', '잠시 뒤 아이디.github.io/저장소이름 주소로 열려요.'] },
]

export default function Editor({ template, shared }) {
  const store = `hero-studio:v3:${template.id}`
  const [cfg, setCfg] = useState(() => {
    if (shared) return { ...template.defaults, ...shared }
    try {
      const s = localStorage.getItem(store)
      if (s) return { ...template.defaults, ...JSON.parse(s) }
    } catch { /* storage unavailable */ }
    return template.defaults
  })
  const [device, setDevice] = useState('desktop')
  const [toast, setToast] = useState('')
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(0)
  const fonts = useFontCss(template, cfg)
  const [html, setHtml] = useState('')
  const timer = useRef()
  const dlg = useRef()

  useEffect(() => {
    if (!fonts) return undefined // wait for the embedded fonts so the preview never calls a font host
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setHtml(template.build(cfg, { fontCss: fonts }))
      try { localStorage.setItem(store, JSON.stringify(cfg)) } catch { /* ignore */ }
    }, 200)
    return () => clearTimeout(timer.current)
  }, [cfg, template, store, fonts])

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setCfg((c) => ({ ...c, [k]: v }))
  }
  const put = (k, v) => setCfg((c) => ({ ...c, [k]: v }))
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2600) }
  const base = useMemo(() => (cfg.brand || cfg.name || cfg.title || cfg.nick || cfg.nameA || 'site').toString().toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '') || 'site', [cfg])

  const page = async () => {
    const probe = template.build(cfg)
    return template.build(cfg, { fontCss: await fontCss(template.fonts(cfg), charsOf(probe), weightsOf(probe)) })
  }
  const save = (blob, name) => {
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: name })
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    say(`${name} 파일을 저장했어요`)
  }
  const downloadHtml = async () => save(new Blob([await page()], { type: 'text/html' }), `${base}.html`)
  const downloadDeploy = async () => save(makeZip({ 'index.html': await page() }), `${base}-배포용.zip`)
  const downloadReact = async () => {
    try { save(makeZip(toReactProject(await page(), { name: base })), `${base}-react.zip`) } catch (e) { say('React 내보내기에 실패했어요: ' + e.message) }
  }
  const copy = async (text, ok) => {
    try { await navigator.clipboard.writeText(text); say(ok) } catch { say('브라우저가 복사를 막았어요') }
  }
  const imageKeys = template.fields.flatMap((g) => g.items).filter((it) => it.type === 'image' || it.type === 'images').map((it) => it.key)
  const share = () => {
    const slim = Object.fromEntries(Object.entries(cfg).filter(([k]) => !imageKeys.includes(k)))
    const enc = btoa(unescape(encodeURIComponent(JSON.stringify({ t: template.id, c: slim }))))
    history.replaceState(null, '', `#c=${enc}`)
    const hasImg = imageKeys.some((k) => (Array.isArray(cfg[k]) ? cfg[k].length : cfg[k]))
    copy(`${location.origin}${location.pathname}#c=${enc}`, hasImg ? '링크를 복사했어요 (이미지는 링크에 담기지 않아요)' : '링크를 복사했어요')
  }

  const openDeploy = async () => {
    setOpen(true)
    dlg.current?.showModal()
    try { setSize(Math.round(new Blob([await page()]).size / 1024)) } catch { setSize(0) }
  }
  const closeDeploy = () => { dlg.current?.close(); setOpen(false) }

  const onImage = (key) => async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try { put(key, await readImage(file)) } catch (err) { say(err.message) }
  }
  const onImages = (key, max) => async (e) => {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    const cur = Array.isArray(cfg[key]) ? cfg[key] : []
    const room = Math.max(0, max - cur.length)
    if (!room) return say(`이미지는 최대 ${max}장까지 넣을 수 있어요`)
    try {
      const add = []
      for (const f of files.slice(0, room)) add.push(await readImage(f, { max: 1400 }))
      put(key, [...cur, ...add])
      if (files.length > room) say(`최대 ${max}장까지만 넣었어요`)
    } catch (err) { say(err.message) }
  }
  const themeFrom = async (key, mode) => {
    try {
      const p = await paletteFromImage(cfg[key], mode)
      setCfg((c) => ({ ...c, ...Object.fromEntries(Object.entries(p).filter(([k]) => k in template.defaults)) }))
      say(mode === 'dark' ? '일러스트 색으로 어두운 테마를 만들었어요' : '일러스트 색으로 밝은 테마를 만들었어요')
    } catch (err) { say(err.message) }
  }
  const pickPalette = (p) => setCfg((c) => {
    const { id, label, ...vals } = p
    const fxOff = Object.fromEntries(['fxStars', 'fxGrain', 'fxVignette', 'fxCursor'].filter((k) => k in c).map((k) => [k, false]))
    if ('skin' in c) fxOff.skin = 'soft'
    return { ...c, ...fxOff, ...vals }
  })

  const renderItem = (it, i) => {
    const id = `${template.id}-${it.key || it.type}-${i}`
    switch (it.type) {
      case 'text':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><input id={id} value={cfg[it.key] ?? ''} onChange={set(it.key)} /></Field>
      case 'textarea':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><textarea id={id} rows={it.rows || 3} value={cfg[it.key] ?? ''} onChange={set(it.key)} /></Field>
      case 'range':
        return <Field key={id} id={id} label={`${it.label}: ${cfg[it.key]}`}><input id={id} type="range" min={it.min} max={it.max} value={cfg[it.key]} onChange={set(it.key)} /></Field>
      case 'check':
        return <label key={id} className="check"><input type="checkbox" checked={!!cfg[it.key]} onChange={set(it.key)} /> {it.label}</label>
      case 'datetime':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><input id={id} type="datetime-local" value={cfg[it.key] ?? ''} onChange={set(it.key)} /></Field>
      case 'date':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><input id={id} type="date" value={cfg[it.key] ?? ''} onChange={set(it.key)} /></Field>
      case 'image':
        return (
          <Field key={id} id={id} label={it.label} hint={it.hint}>
            <div className="imgfield">
              {cfg[it.key] ? <img src={cfg[it.key]} alt="" /> : <span className="ph">이미지 없음</span>}
              <input id={id} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onImage(it.key)} />
              {cfg[it.key] && (
                <div className="row-btns">
                  <button type="button" className="ghost" onClick={() => put(it.key, '')}>이미지 지우기</button>
                  {it.theme && <>
                    <button type="button" className="ghost" onClick={() => themeFrom(it.key, 'light')}>이 그림 색으로 밝은 테마</button>
                    <button type="button" className="ghost" onClick={() => themeFrom(it.key, 'dark')}>어두운 테마</button>
                  </>}
                </div>
              )}
            </div>
          </Field>
        )
      case 'images': {
        const list = Array.isArray(cfg[it.key]) ? cfg[it.key] : []
        return (
          <Field key={id} id={id} label={`${it.label} (${list.length}/${it.max})`} hint={it.hint}>
            <div className="imgfield">
              {list.length > 0 && (
                <ul className="thumbs">
                  {list.map((src, n) => (
                    <li key={n}><img src={src} alt="" /><button type="button" aria-label={`${n + 1}번 이미지 지우기`} onClick={() => put(it.key, list.filter((_, j) => j !== n))}>×</button></li>
                  ))}
                </ul>
              )}
              <input id={id} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" onChange={onImages(it.key, it.max)} />
            </div>
          </Field>
        )
      }
      case 'select':
        return (
          <Field key={id} id={id} label={it.label}>
            <select id={id} value={cfg[it.key]} onChange={set(it.key)}>{it.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
          </Field>
        )
      case 'choice':
        return (
          <div key={id} className="choices" role="group" aria-label={it.label}>
            {it.options.map((o) => <button key={o.id} aria-pressed={cfg[it.key] === o.id} onClick={() => put(it.key, o.id)}>{o.label}</button>)}
          </div>
        )
      case 'palette':
        return (
          <div key={id} className="choices" role="group" aria-label="색상 팔레트">
            {template.palettes.map((p) => (
              <button key={p.id} className="sw" onClick={() => pickPalette(p)} aria-pressed={cfg.bg === p.bg && cfg.fg === p.fg}>
                <i style={{ background: p.bg, borderColor: p.fg }}><b style={{ background: p.accent || p.c1 }} /></i>{p.label}
              </button>
            ))}
          </div>
        )
      case 'colors':
        return (
          <div key={id} className="three">
            {it.keys.map(([k, label]) => (
              <Field key={k} id={`${id}-${k}`} label={label}><input id={`${id}-${k}`} type="color" value={cfg[k]} onChange={set(k)} /></Field>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  // Consecutive half-width fields share a two-column row.
  const renderItems = (items) => {
    const out = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].half) {
        const run = []
        while (i < items.length && items[i].half) run.push(renderItem(items[i], i++))
        i--
        out.push(<div className="two" key={`two-${i}`}>{run}</div>)
      } else out.push(renderItem(items[i], i))
    }
    return out
  }

  return (
    <div className="app">
      <header className="bar">
        <a className="back" href="#/templates" aria-label="템플릿 목록으로 돌아가기">&larr; 템플릿</a>
        <div className="title"><span className="dot" />{template.name}</div>
        <div className="seg" role="group" aria-label="미리보기 크기">
          {Object.entries(DEVICES).map(([d, [label]]) => <button key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>{label}</button>)}
        </div>
        <div className="actions">
          <button className="ghost" onClick={share}>링크 복사</button>
          <button className="ghost" onClick={async () => copy(await page(), 'HTML 코드를 복사했어요')}>HTML 복사</button>
          <button className="ghost" onClick={downloadReact}>React 프로젝트(zip)</button>
          <button className="ghost" onClick={downloadHtml}>HTML 받기</button>
          <button className="solid" onClick={openDeploy}>무료로 공개하기</button>
        </div>
      </header>

      <aside className="panel" aria-label="편집 패널">
        {template.fields.map((g) => (
          <details className="group" key={g.group} open={g.open}>
            <summary>{g.group}</summary>
            <div className="group-body">{renderItems(g.items)}</div>
          </details>
        ))}
        <button className="ghost reset" onClick={() => setCfg(template.defaults)}>처음 상태로 되돌리기</button>
      </aside>

      <main className="preview">
        <div className="frame" style={{ width: DEVICES[device][1] }}>
          {html && <iframe title="실시간 미리보기" sandbox="allow-scripts" srcDoc={html} />}
        </div>
      </main>

      <dialog ref={dlg} className="deploy" onClose={() => setOpen(false)} onClick={(e) => e.target === dlg.current && closeDeploy()}>
        {open && (
          <div className="deploy-in">
            <div className="deploy-head">
              <h2>무료로 공개하기</h2>
              <button className="ghost" onClick={closeDeploy} aria-label="닫기">닫기</button>
            </div>
            <p className="deploy-lead">만든 페이지는 파일 하나예요. 아래 무료 호스팅 중 편한 곳에 올리면 누구나 주소로 볼 수 있어요.{size ? ` 현재 파일 크기는 약 ${size.toLocaleString()}KB예요.` : ''}</p>
            <div className="deploy-dl">
              <button className="solid" onClick={downloadDeploy}>배포용 zip 받기 (index.html)</button>
              <button className="ghost" onClick={downloadHtml}>HTML만 받기</button>
            </div>
            <div className="hosts">
              {HOSTS.map((h) => (
                <section key={h.name}>
                  <h3>{h.name} <em>{h.tag}</em></h3>
                  <ol>{h.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                  <a href={h.url} target="_blank" rel="noopener noreferrer">{h.name} 열기 &rarr;</a>
                </section>
              ))}
            </div>
            <p className="deploy-note">무료 한도와 정책은 서비스마다 달라요. 올리기 전에 각 사이트의 안내를 한 번 확인해 주세요. 이미지를 많이 넣으면 파일이 커질 수 있어요.</p>
          </div>
        )}
      </dialog>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
