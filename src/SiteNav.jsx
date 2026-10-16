export default function SiteNav({ current }) {
  return (
    <header className="site-nav">
      <a className="brand" href="#/" aria-label="herocat studio 홈"><span className="dot" />herocat studio</a>
      <nav aria-label="주요 메뉴">
        <a href="#/#how">사용 방법</a>
        <a href="#/templates" aria-current={current === 'templates' ? 'page' : undefined}>템플릿</a>
        <a href="#/#faq">자주 묻는 질문</a>
      </nav>
      <a className="nav-cta" href="#/templates">무료로 시작하기</a>
    </header>
  )
}
