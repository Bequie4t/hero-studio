import { useEffect, useMemo, useRef, useState } from 'react'

import { makeZip } from './export/zip.js'
import { fontCss } from './fonts/index.js'
import { readImage } from './images.js'
import { useFontCss } from './useFonts.js'
import { toReactProject } from './export/react.js'

const DEVICES = { desktop: '100%', tablet: '820px', mobile: '390px' }

function Field({ id, label, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  )
}

export default function Editor({ template, shared }) {
  const store = `hero-studio:v2:${template.id}`
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
  const fonts = useFontCss(template, cfg)
  const [html, setHtml] = useState('')
  const timer = useRef()

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
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2200) }
  const fileName = useMemo(() => (cfg.brand || 'site').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html', [cfg.brand])

  const page = async () => template.build(cfg, { fontCss: await fontCss(template.fonts(cfg)) })
  const download = async () => {
    const url = URL.createObjectURL(new Blob([await page()], { type: 'text/html' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: fileName })
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    say(`Saved ${fileName}`)
  }
  const downloadReact = async () => {
    try {
      const base = fileName.replace(/\.html$/, '')
      const files = toReactProject(await page(), { name: base })
      const url = URL.createObjectURL(makeZip(files))
      const a = Object.assign(document.createElement('a'), { href: url, download: `${base}-react.zip` })
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      say(`Saved ${base}-react.zip`)
    } catch (e) { say('React export failed: ' + e.message) }
  }
  const copy = async (text, ok) => {
    try { await navigator.clipboard.writeText(text); say(ok) } catch { say('Copy was blocked by the browser') }
  }
  const imageKeys = template.fields.flatMap((g) => g.items).filter((it) => it.type === 'image').map((it) => it.key)
  const share = () => {
    const slim = Object.fromEntries(Object.entries(cfg).filter(([k]) => !imageKeys.includes(k)))
    const enc = btoa(unescape(encodeURIComponent(JSON.stringify({ t: template.id, c: slim }))))
    history.replaceState(null, '', `#c=${enc}`)
    copy(`${location.origin}${location.pathname}#c=${enc}`, imageKeys.some((k) => cfg[k]) ? 'Share link copied (images are not included)' : 'Share link copied')
  }
  const onImage = (key) => async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try { put(key, await readImage(file)) } catch (err) { say(err.message) }
  }
  const pickPalette = (p) => setCfg((c) => {
    const { id, label, ...vals } = p
    return { ...c, ...vals }
  })

  const renderItem = (it, i) => {
    const id = `${template.id}-${it.key || it.type}-${i}`
    switch (it.type) {
      case 'text':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><input id={id} value={cfg[it.key]} onChange={set(it.key)} /></Field>
      case 'textarea':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><textarea id={id} rows={it.rows || 3} value={cfg[it.key]} onChange={set(it.key)} /></Field>
      case 'range':
        return <Field key={id} id={id} label={`${it.label}: ${cfg[it.key]}`}><input id={id} type="range" min={it.min} max={it.max} value={cfg[it.key]} onChange={set(it.key)} /></Field>
      case 'check':
        return <label key={id} className="check"><input type="checkbox" checked={!!cfg[it.key]} onChange={set(it.key)} /> {it.label}</label>
      case 'datetime':
        return <Field key={id} id={id} label={it.label} hint={it.hint}><input id={id} type="datetime-local" value={cfg[it.key]} onChange={set(it.key)} /></Field>
      case 'image':
        return (
          <Field key={id} id={id} label={it.label} hint={it.hint}>
            <div className="imgfield">
              {cfg[it.key] ? <img src={cfg[it.key]} alt="" /> : <span className="ph">No image</span>}
              <input id={id} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onImage(it.key)} />
              {cfg[it.key] && <button type="button" className="ghost" onClick={() => put(it.key, '')}>Remove image</button>}
            </div>
          </Field>
        )
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
          <div key={id} className="choices" role="group" aria-label="Palette">
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
        <a className="back" href="#/templates" aria-label="Back to templates">&larr; Templates</a>
        <div className="title"><span className="dot" />{template.name}</div>
        <div className="seg" role="group" aria-label="Preview size">
          {Object.keys(DEVICES).map((d) => <button key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>{d}</button>)}
        </div>
        <div className="actions">
          <button className="ghost" onClick={share}>Share link</button>
          <button className="ghost" onClick={async () => copy(await page(), 'HTML copied')}>Copy HTML</button>
          <button className="ghost" onClick={downloadReact}>React project .zip</button>
          <button className="solid" onClick={download}>Download .html</button>
        </div>
      </header>

      <aside className="panel" aria-label="Editor">
        {template.fields.map((g) => (
          <details className="group" key={g.group} open={g.open}>
            <summary>{g.group}</summary>
            <div className="group-body">{renderItems(g.items)}</div>
          </details>
        ))}
        <button className="ghost reset" onClick={() => setCfg(template.defaults)}>Reset to the starter</button>
      </aside>

      <main className="preview">
        <div className="frame" style={{ width: DEVICES[device] }}>
          {html && <iframe title="Live preview" sandbox="allow-scripts" srcDoc={html} />}
        </div>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
