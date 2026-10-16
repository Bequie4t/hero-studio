import '@fontsource/bricolage-grotesque/latin-700.css'
import '@fontsource/bricolage-grotesque/latin-800.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import { useEffect } from 'react'
import { TEMPLATES, getTemplate } from './templates/index.js'
import SiteNav from './SiteNav.jsx'
import Thumb from './Thumb.jsx'

const STEPS = [
  { t: 'Pick a template', d: 'Start from a page that already looks finished: a pixel mascot, a terminal, a calm SaaS orb, a portfolio, a shop or an event.' },
  { t: 'Edit with a live preview', d: 'Change the words, colours, fonts and photos. Switch between desktop, tablet and phone while you type.' },
  { t: 'Download and host', d: 'Save one HTML file or a ready React project. Drop it on any free host and it is online.' },
]

const FEATURES = [
  { t: 'One clean file', d: 'The download is a single HTML page with its CSS, script, fonts and images inside. No build step.' },
  { t: 'React project too', d: 'Prefer components? Get a Vite and React project as a zip, ready for npm install.' },
  { t: 'Fonts included', d: 'Open-source fonts are embedded in the file, so the page looks the same offline and loads no outside font service.' },
  { t: 'Made for phones', d: 'Every template reflows to a single column and respects reduced-motion settings.' },
  { t: 'Sections included', d: 'Add feature cards, pricing plans and a footer under the hero with a switch.' },
  { t: 'Nothing to sign up for', d: 'No account and no watermark. Your edits stay in your browser until you download them.' },
]

const FAQ = [
  ['Is it really free?', 'Yes. There is no account, no trial and no watermark. You edit, download and keep the page.'],
  ['Can I use the pages for a real site?', 'Yes. The pages you download are yours. The fonts are open source and included in the file.'],
  ['Where do I host the file?', 'Anywhere that serves static files: GitHub Pages, Netlify, Cloudflare Pages, Vercel, or your own server. Upload the HTML file and you are done.'],
  ['Can I keep editing after I download?', 'Yes. The HTML is plain and readable, and the React export gives you components and CSS you can change in any editor.'],
  ['What happens to my photos?', 'They are resized in your browser and stored inside the downloaded file. They are never uploaded to a server.'],
  ['Why is there no share link for photos?', 'Share links carry your text and colours in the address. Photos are too large for that, so they stay out of the link.'],
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
  const stack = ['pixel', 'orbit', 'folio'].map(getTemplate).filter(Boolean)

  return (
    <div className="landing">
      <SiteNav />
      <section className="l-hero">
        <div className="l-copy">
          <p className="l-eyebrow">Free · no account · one HTML file</p>
          <h1>Build the front door of your website in minutes.</h1>
          <p className="l-sub">Pick a template, change the words, colours and photos with a live preview, then download a clean page or a ready React project. Host it anywhere.</p>
          <div className="l-cta">
            <a className="btn-solid" href="#/templates">Pick a template</a>
            <a className="btn-line" href="#/#how">See how it works</a>
          </div>
        </div>
        <div className="l-stack" aria-hidden="true">
          {stack.map((t, i) => (
            <div key={t.id} className={`l-card c${i}`}><Thumb template={t} /></div>
          ))}
        </div>
      </section>

      <section className="l-strip" aria-label="Highlights">
        <span>Plain HTML</span><span>React export</span><span>Fonts included</span><span>Phone friendly</span>
      </section>

      <section className="l-sec" id="how">
        <h2>From idea to live page in three steps</h2>
        <ol className="l-steps">
          {STEPS.map((s, i) => (
            <li key={s.t}><span className="l-n">{i + 1}</span><h3>{s.t}</h3><p>{s.d}</p></li>
          ))}
        </ol>
      </section>

      <section className="l-sec" id="templates">
        <div className="l-head"><h2>{TEMPLATES.length} starting points</h2><a className="link-more" href="#/templates">See all templates &rarr;</a></div>
        <div className="g-grid">
          {TEMPLATES.map((t) => (
            <a key={t.id} className="g-card" href={`#/t/${t.id}`}>
              <Thumb template={t} />
              <div className="g-meta"><div><h3>{t.name}</h3><p>{t.blurb}</p></div><span className="g-tag">{t.tag}</span></div>
            </a>
          ))}
        </div>
      </section>

      <section className="l-sec" id="features">
        <h2>Everything a first page needs</h2>
        <div className="l-feats">
          {FEATURES.map((f) => (<article key={f.t}><h3>{f.t}</h3><p>{f.d}</p></article>))}
        </div>
      </section>

      <section className="l-sec l-narrow" id="faq">
        <h2>Questions</h2>
        <div className="l-faq">
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
        </div>
      </section>

      <section className="l-final">
        <h2>Your page is one template away.</h2>
        <a className="btn-solid" href="#/templates">Start free</a>
      </section>

      <footer className="l-foot"><span>Hero Studio</span><span>Pages you download are plain HTML and CSS. Host them anywhere.</span></footer>
    </div>
  )
}
