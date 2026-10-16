export default function SiteNav({ current }) {
  return (
    <header className="site-nav">
      <a className="brand" href="#/" aria-label="Hero Studio home"><span className="dot" />Hero Studio</a>
      <nav aria-label="Main">
        <a href="#/#how">How it works</a>
        <a href="#/templates" aria-current={current === 'templates' ? 'page' : undefined}>Templates</a>
        <a href="#/#faq">FAQ</a>
      </nav>
      <a className="nav-cta" href="#/templates">Start free</a>
    </header>
  )
}
