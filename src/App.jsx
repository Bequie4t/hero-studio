import { useEffect, useState } from 'react'
import Landing from './Landing.jsx'
import Gallery from './Gallery.jsx'
import Editor from './Editor.jsx'
import { getTemplate } from './templates/index.js'

// Hash routes: "#/" landing, "#/templates" gallery, "#/t/<id>" editor, "#c=<payload>" shared editor state.
function parse() {
  const h = location.hash
  const share = h.match(/^#c=(.+)$/)
  if (share) {
    try {
      const p = JSON.parse(decodeURIComponent(escape(atob(share[1]))))
      if (getTemplate(p.t)) return { page: 'editor', id: p.t, shared: p.c }
    } catch { /* bad link: fall back to the landing page */ }
  }
  const m = h.match(/^#\/t\/([a-z0-9-]+)$/)
  if (m && getTemplate(m[1])) return { page: 'editor', id: m[1] }
  if (h === '#/templates') return { page: 'gallery' }
  return { page: 'landing' }
}

export default function App() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => {
      const next = parse()
      setRoute((prev) => (prev.page === next.page && prev.id === next.id && prev.shared === next.shared ? prev : next))
      if (next.page === 'gallery') scrollTo(0, 0)
    }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  if (route.page === 'editor') return <Editor key={route.id} template={getTemplate(route.id)} shared={route.shared} />
  return route.page === 'gallery' ? <Gallery /> : <Landing />
}
