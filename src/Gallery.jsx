import { GROUPS, TEMPLATES } from './templates/index.js'
import SiteNav from './SiteNav.jsx'
import Thumb from './Thumb.jsx'

const TITLES = { 덕질: '덕질용 템플릿', 일반: '일반 템플릿' }
const NOTES = { 덕질: '자캐 설정집, 커플 아카이브, 캐릭터 도감, 세계관 연표, 커뮤니티, 합작 모집, 커미션 안내, 개인 홈페이지. 예시 글은 마음껏 지우고 바꿔 쓰세요.', 일반: '서비스 소개, 포트폴리오, 상품, 행사 페이지. 예시 글은 영어로 되어 있어요.' }

export default function Gallery() {
  return (
    <div className="gallery">
      <SiteNav current="templates" />
      <section className="g-intro">
        <h1>어떤 집을 지어 볼까요?</h1>
        <p>템플릿을 고르면 바로 편집기가 열려요. 글과 그림, 색을 바꾸고 무료로 공개해 보세요.</p>
      </section>
      {GROUPS.map((g) => (
        <section key={g} className="g-group" aria-label={TITLES[g]}>
          <h2>{TITLES[g]}</h2>
          <p className="g-note">{NOTES[g]}</p>
          <div className="g-grid">
            {TEMPLATES.filter((t) => t.group === g).map((t) => (
              <a key={t.id} className="g-card" href={`#/t/${t.id}`}>
                <Thumb template={t} />
                <div className="g-meta">
                  <div><h3>{t.name}</h3><p>{t.blurb}</p></div>
                  <span className="g-tag">{t.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
      <footer className="g-foot">만든 페이지는 일반 HTML 파일이라 어디에 올려도 돼요.</footer>
    </div>
  )
}
