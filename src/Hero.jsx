import { useEffect, useState } from 'react'
import HeroCat from './mascot/HeroCat.jsx'
import { TEMPLATES } from './templates/index.js'

const LINES = [
  '오늘은 누구의 집을 지어 볼까냥?',
  '설정집 한 장 완성! 다음은 커플 아카이브냥.',
  'D+582일째, 기념일까지 18일 남았다냥.',
  '그림은 네 브라우저 밖으로 안 나간다냥.',
  '다 만들면 무료로 공개하자냥!',
]

// Typewriter for the speech bubble (shows the first line at once when motion is reduced).
function useTypewriter(lines) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(lines[0]); return undefined }
    let i = 0, n = 0, id = 0
    const step = () => {
      const line = lines[i % lines.length]
      if (n <= line.length) { setText(line.slice(0, n++)); id = setTimeout(step, 55) }
      else { id = setTimeout(() => { i++; n = 0; step() }, 2300) }
    }
    step()
    return () => clearTimeout(id)
  }, [lines])
  return text
}

export default function Hero() {
  const said = useTypewriter(LINES)
  return (
    <section className="hero" aria-labelledby="hero-title">
      <header className="hero-nav">
        <a className="hero-logo" href="#/" aria-label="herocat studio 홈"><i aria-hidden="true" />herocat studio</a>
        <nav aria-label="주요 메뉴">
          <a href="#/#templates">템플릿</a>
          <a href="#/#how">사용 방법</a>
          <a href="#/#faq">자주 묻는 질문</a>
        </nav>
        <a className="hero-go" href="#/templates">시작하기</a>
      </header>

      <div className="hero-body">
        <div className="hero-copy">
          <h1 id="hero-title"><span>HEROCAT</span><span>STUDIO</span></h1>
          <p className="hero-lead">내 자캐를 위한 작은 집,<br />무료로 지어 드려요.</p>
          <p className="hero-sub">자캐 설정집, 커플 아카이브, 캐릭터 도감, 세계관 연표, 커미션 안내, 덕질 홈까지. 템플릿을 고르고 글과 그림만 바꾸면 끝나요.</p>
          <div className="hero-cta">
            <a className="hero-btn" href="#/templates">무료로 시작하기</a>
            <a className="hero-link" href="#/#how">어떻게 쓰나요? <span aria-hidden="true">›</span></a>
          </div>
          <ul className="hero-stats" aria-label="특징">
            <li>템플릿 {TEMPLATES.length}종</li><li>가입 없음</li><li>0원</li>
          </ul>
        </div>

        <div className="hero-stage">
          <p className="bubble" aria-live="off"><span>{said}</span><i aria-hidden="true" /></p>
          <HeroCat />
          <div className="shadow" aria-hidden="true" />
          <i className="px p1" aria-hidden="true" /><i className="px p2" aria-hidden="true" /><i className="px p3" aria-hidden="true" /><i className="px p4" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
