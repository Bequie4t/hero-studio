import { useEffect, useMemo, useRef, useState } from 'react'
import { useFontCss } from './useFonts.js'

// Live, scaled-down preview of a template's starter page. The page is only mounted once the
// card is near the viewport, so a long list of templates stays light.
export default function Thumb({ template }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.3)
  const [near, setNear] = useState(false)
  const fonts = useFontCss(template, template.defaults)
  const html = useMemo(() => (near && fonts ? template.build(template.defaults, { fontCss: fonts }) : ''), [template, fonts, near])
  useEffect(() => {
    const el = box.current
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1440))
    ro.observe(el)
    setScale(el.clientWidth / 1440)
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setNear(true), { rootMargin: '400px' })
    io.observe(el)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])
  return (
    <div className="thumb" ref={box}>
      {html && (
        <iframe title={`${template.name} preview`} sandbox="allow-scripts" srcDoc={html} tabIndex={-1}
          style={{ transform: `scale(${scale})` }} />
      )}
    </div>
  )
}
