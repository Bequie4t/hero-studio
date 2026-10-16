import { useEffect, useMemo, useState } from 'react'
import { charsOf, fontCss, weightsOf } from './fonts/index.js'

/** Embedded @font-face CSS for the fonts a template currently uses ('' while loading). */
export function useFontCss(template, cfg) {
  const ids = template.fonts(cfg)
  const key = ids.join(',')
  const probe = useMemo(() => template.build(cfg), [template, cfg])
  const chars = useMemo(() => charsOf(probe), [probe])
  const weights = useMemo(() => weightsOf(probe), [probe])
  const wkey = weights.join(',')
  const [css, setCss] = useState('')
  useEffect(() => {
    let live = true
    const t = setTimeout(() => fontCss(ids, chars, weights).then((c) => live && setCss(c)).catch(() => live && setCss(' ')), 150)
    return () => { live = false; clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, chars, wkey])
  return css
}
