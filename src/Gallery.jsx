import { TEMPLATES } from './templates/index.js'
import SiteNav from './SiteNav.jsx'
import Thumb from './Thumb.jsx'

export default function Gallery() {
  return (
    <div className="gallery">
      <SiteNav current="templates" />
      <section className="g-intro">
        <h1>Pick a starting point.</h1>
        <p>Every template opens in a live editor. Change the words, colours and photos, then download the page.</p>
      </section>
      <section className="g-grid" aria-label="Templates">
        {TEMPLATES.map((t) => (
          <a key={t.id} className="g-card" href={`#/t/${t.id}`}>
            <Thumb template={t} />
            <div className="g-meta">
              <div><h2>{t.name}</h2><p>{t.blurb}</p></div>
              <span className="g-tag">{t.tag}</span>
            </div>
          </a>
        ))}
      </section>
      <footer className="g-foot">Pages you download are plain HTML and CSS. Host them anywhere.</footer>
    </div>
  )
}
