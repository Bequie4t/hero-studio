import { useEffect, useState } from 'react'
import { fontCss } from './fonts/index.js'

/** Embedded @font-face CSS for the fonts a template currently uses ('' while loading). */
export function useFontCss(template, cfg) {
  const ids = template.fonts(cfg)
  const key = ids.join(',')
  const [css, setCss] = useState('')
  useEffect(() => {
    let live = true
    fontCss(ids).then((c) => live && setCss(c))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return css
}
