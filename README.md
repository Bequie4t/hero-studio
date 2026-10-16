# Hero Studio

A free, no-account builder for a pixel-mascot hero page. Visitors edit the page in a
sidebar, watch it update live, then download one self-contained `.html` file (or copy it,
or share a link that carries their settings).

## Run

    npm install
    npm run dev       # editor at http://localhost:5173
    npm run build     # static site in dist/
    npm run check     # sprite sizes + output escaping

## How it works

- `#/` is the landing page, `#/templates` the gallery, `#/t/<id>` the editor, `#c=...` a shared link.
- Each template in `src/templates/` exports `{ id, name, blurb, tag, defaults, fields, palettes, build, fonts }`.
  `build(config, { fontCss })` returns a complete HTML page. The editor sidebar is generated from `fields`
  (types: text, textarea, select, choice, range, check, colors, palette, datetime, image), and the live
  preview and the downloaded file both come from `build`, so they match.
- Add a template: copy a file in `src/templates/`, change `defaults`, `fields` and `build`, then list it in
  `src/templates/index.js`. It appears in the gallery and on the landing page automatically.
- Fonts are self-hosted. `src/fonts/registry.js` lists the families and weights, `node scripts/fonts.mjs`
  copies the Latin woff2 files from `@fontsource`, and downloads embed them as data: URIs. Only Latin
  glyphs are embedded; other scripts fall back to system fonts.
- Uploaded images are resized in the browser (`src/images.js`) and embedded in the page. The React export
  writes them to `src/assets/` and the fonts to `src/fonts.css`.
- `src/templates/util.js` has the escaping helpers. User text is escaped, URLs are limited to http(s), `#`,
  `/` and `mailto:`, colours must be 6-digit hex and images must be `data:image/...;base64`.
  `npm run check` tries to inject script through the fields of every template.

Templates: Pixel Mascot, Terminal Launch, Soft Orbit, Folio, Storefront, Event Countdown.

## Host it for free

`dist/` is plain static files. Drop it on GitHub Pages, Netlify or Cloudflare Pages.
The exported pages load their fonts from Google Fonts and need no server.
