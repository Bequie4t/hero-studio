import { useEffect, useRef } from 'react'
import { drawCat, SIZE } from './cat.js'

// Canvas wrapper: redraws the pixel cat ~30 times a second, blinks now and then, twitches an ear, looks around.
export default function HeroCat({ label = '망토를 두른 픽셀 고양이' }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const off = document.createElement('canvas')
    off.width = off.height = SIZE
    const octx = off.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, last = 0
    const fit = () => {
      const css = cv.clientWidth || 480
      const k = Math.max(2, Math.round((css * Math.min(devicePixelRatio || 1, 2)) / SIZE)) // whole-number pixel size keeps edges crisp
      cv.width = cv.height = SIZE * k
    }
    const frame = (ms) => {
      if (ms - last > 33 || reduce) {
        last = ms
        const t = reduce ? 0.6 : ms / 1000
        const phase = t % 5.2
        const blink = !reduce && (phase > 3.35 && phase < 3.5)
        const twitch = !reduce && (t % 7.3 > 6.9) ? -1 : 0
        const look = reduce ? 0 : Math.sin(t * 0.6) * 1.1
        octx.putImageData(new ImageData(drawCat(t, { blink, twitch, look }), SIZE, SIZE), 0, 0)
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, cv.width, cv.height)
        ctx.drawImage(off, 0, 0, cv.width, cv.height)
      }
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    fit()
    const ro = new ResizeObserver(() => { fit(); if (reduce) frame(0) })
    ro.observe(cv)
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={ref} className="herocat" role="img" aria-label={label} />
}
