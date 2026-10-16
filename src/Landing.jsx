import { useEffect } from 'react'
import { TEMPLATES, getTemplate } from './templates/index.js'
import SiteNav from './SiteNav.jsx'
import Thumb from './Thumb.jsx'

const STEPS = [
  { t: '템플릿 고르기', d: '자캐 설정집, 커플 아카이브, 커뮤니티, 덕질 홈 중에서 시작해요.' },
  { t: '글과 그림 채우기', d: '이름, 설정, 일러스트를 넣으면 오른쪽에서 바로 보여요. 그림 색으로 테마도 만들어 줘요.' },
  { t: '무료로 공개하기', d: '배포용 파일을 받아 무료 호스팅에 올리면 내 주소가 생겨요. 올리는 방법은 단계별로 안내해 드려요.' },
]

const FEATURES = [
  { t: '자캐 덕후를 위한 구성', d: '프로필 표, 관계도, 타임라인, 취향 문답, 갤러리까지 필요한 칸을 미리 만들어 뒀어요.' },
  { t: 'D+ 카운터', d: '커플 기념일부터 며칠째인지 세어 주고, 다음 100일과 주년까지 남은 날도 알려 줘요.' },
  { t: '그림 색으로 테마 만들기', d: '대표 일러스트의 색을 읽어서 페이지 색을 맞춰 줘요. 밝은 버전과 어두운 버전 중에 골라요.' },
  { t: '한글 폰트 내장', d: '감성 명조, 동글동글 제목체, 손글씨까지. 파일 안에 들어 있어서 어디서 열어도 똑같이 보여요.' },
  { t: '그림은 내 브라우저 안에서만', d: '올린 이미지는 서버로 보내지 않아요. 줄여서 파일 안에 넣어 둘 뿐이에요.' },
  { t: '무료 공개 안내', d: '배포용 zip과 Netlify, Cloudflare, GitHub에 올리는 방법을 단계별로 보여 드려요.' },
]

const FAQ = [
  ['정말 무료인가요?', '네. 가입도, 결제도, 워터마크도 없어요. 만들고, 받고, 올리면 끝이에요.'],
  ['자캐 그림을 올려도 괜찮나요?', '편집하는 동안 그림은 내 브라우저 안에서만 쓰여요. 다만 페이지를 공개하면 그림도 누구나 볼 수 있으니, 공개용으로 줄인 이미지를 쓰는 걸 추천해요.'],
  ['어디에 올려야 하나요?', 'Netlify Drop, Cloudflare Pages, GitHub Pages처럼 정적 파일을 올릴 수 있는 곳이면 어디든 돼요. "무료로 공개하기" 버튼에서 단계별로 알려 드려요.'],
  ['나중에 수정하고 싶으면요?', '같은 브라우저에서 다시 열면 작업하던 내용이 그대로 남아 있어요. 고친 뒤 다시 받아서 올리면 돼요. 다른 기기에서는 보이지 않아요.'],
  ['폰이나 태블릿에서도 잘 보이나요?', '네. 모든 템플릿이 화면 크기에 맞춰 바뀌어요. 편집기에서 모바일 미리보기로 확인할 수 있어요.'],
  ['팬 사이트나 2차 창작 페이지도 만들 수 있나요?', '내용은 자유예요. 다만 올리는 호스팅 서비스의 이용 약관과 저작권을 지켜 주세요.'],
]

export default function Landing() {
  useEffect(() => {
    // "#/#how" style links: scroll to the section after the route has rendered.
    const go = () => {
      const m = location.hash.match(/^#\/#([a-z-]+)$/)
      if (m) document.getElementById(m[1])?.scrollIntoView({ behavior: 'smooth' })
    }
    go()
    addEventListener('hashchange', go)
    return () => removeEventListener('hashchange', go)
  }, [])
  const stack = ['oc', 'couple', 'home'].map(getTemplate).filter(Boolean)
  const fan = TEMPLATES.filter((t) => t.group === '덕질')
  const more = TEMPLATES.length - fan.length

  return (
    <div className="landing">
      <SiteNav />
      <section className="l-hero">
        <div className="l-copy">
          <p className="l-eyebrow">무료 · 가입 없음 · 파일 하나로 끝</p>
          <h1>내 자캐를 위한 작은 집, 5분이면 지어요.</h1>
          <p className="l-sub">자캐 설정집, 커플 아카이브, 커뮤니티 사이트, 덕질 홈페이지까지. 템플릿을 고르고 글과 그림만 바꾸면, 무료로 공개할 수 있는 웹페이지가 만들어져요.</p>
          <div className="l-cta">
            <a className="btn-solid" href="#/templates">템플릿 고르기</a>
            <a className="btn-line" href="#/#how">어떻게 쓰나요?</a>
          </div>
        </div>
        <div className="l-stack" aria-hidden="true">
          {stack.map((t, i) => (<div key={t.id} className={`l-card c${i}`}><Thumb template={t} /></div>))}
        </div>
      </section>

      <section className="l-strip" aria-label="특징">
        <span>가입 없이 바로</span><span>한글 폰트 내장</span><span>그림은 내 브라우저에서만</span><span>무료로 공개</span>
      </section>

      <section className="l-sec" id="how">
        <h2>세 단계면 내 페이지가 열려요</h2>
        <ol className="l-steps">
          {STEPS.map((s, i) => (<li key={s.t}><span className="l-n">{i + 1}</span><h3>{s.t}</h3><p>{s.d}</p></li>))}
        </ol>
      </section>

      <section className="l-sec" id="templates">
        <div className="l-head"><h2>덕질용 템플릿 {fan.length}종</h2><a className="link-more" href="#/templates">일반 템플릿 {more}종까지 보기 &rarr;</a></div>
        <div className="g-grid">
          {fan.map((t) => (
            <a key={t.id} className="g-card" href={`#/t/${t.id}`}>
              <Thumb template={t} />
              <div className="g-meta"><div><h3>{t.name}</h3><p>{t.blurb}</p></div><span className="g-tag">{t.tag}</span></div>
            </a>
          ))}
        </div>
      </section>

      <section className="l-sec" id="features">
        <h2>덕질에 필요한 건 다 넣었어요</h2>
        <div className="l-feats">
          {FEATURES.map((f) => (<article key={f.t}><h3>{f.t}</h3><p>{f.d}</p></article>))}
        </div>
      </section>

      <section className="l-sec l-narrow" id="faq">
        <h2>자주 묻는 질문</h2>
        <div className="l-faq">
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
        </div>
      </section>

      <section className="l-final">
        <h2>내 자캐의 집, 지금 지어 볼까요?</h2>
        <a className="btn-solid" href="#/templates">무료로 시작하기</a>
      </section>

      <footer className="l-foot"><span>Hero Studio</span><span>만든 페이지는 모두 내 것이에요. 일반 HTML 파일이라 어디에 올려도 돼요.</span></footer>
    </div>
  )
}
