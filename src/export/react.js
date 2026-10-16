// Turns a template's generated HTML page into a ready-to-run Vite + React project.
// The markup becomes JSX, the CSS becomes a stylesheet, and the page script runs in an effect
// that cleans up its timers and listeners when the component unmounts.

const VOID = /<(br|hr|img|input|meta|link)([^>]*?)\/?>/g

function pull(html, re, what) {
  const m = html.match(re)
  if (!m) throw new Error(`Could not find ${what} in the generated page`)
  return m
}

function toJsx(markup) {
  return markup
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .replace(/\sclass=/g, ' className=')
    .replace(/\sshape-rendering=/g, ' shapeRendering=')
    .replace(/\scrossorigin(?=[\s>])/g, ' crossOrigin')
    .replace(VOID, '<$1$2 />')
    .replace(/<(\w+)([^>]*?)\sstyle="[^"]*"/g, '<$1$2')
}

export function toReactProject(html, { name = 'site' } = {}) {
  const title = pull(html, /<title>([\s\S]*?)<\/title>/, 'title')[1]
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''
  const fontHref = (html.match(/<link rel="stylesheet" href="([^"]+)"/) || [])[1]
  const icon = (html.match(/<link rel="icon" href="([^"]+)"/) || [])[1]
  const fontsCss = (html.match(/<style id="fonts">([\s\S]*?)<\/style>/) || [])[1]
  const css = pull(html, /<style>([\s\S]*?)<\/style>/, 'styles')[1].trim()
  const bodyM = pull(html, /<body([^>]*)>([\s\S]*)<\/body>/, 'body')
  const bodyClass = (bodyM[1].match(/class="([^"]*)"/) || [])[1] || ''
  const body = bodyM[2]
  const cfgJson = (body.match(/<script type="application\/json" id="cfg">([\s\S]*?)<\/script>/) || [])[1]
  const runtime = [...body.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n') || undefined
  const markup = body.replace(/<script[\s\S]*?<\/script>/g, '').trim()

  // Uploaded images become real files under src/assets instead of giant inline strings.
  const images = []
  const withoutImages = markup.replace(/src="data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)"/g, (m, ext, b64) => {
    images.push({ ext: ext === 'jpeg' ? 'jpg' : ext, b64 })
    return `src="__IMG${images.length - 1}__"`
  })
  let jsx = toJsx(withoutImages).replace(/src="__IMG(\d+)__"/g, 'src={img$1}')
  if (bodyClass) jsx = `<div className="${bodyClass}">\n${jsx}\n</div>`
  const imgImports = images.map((im, i) => `import img${i} from './assets/img${i}.${im.ext}'\n`).join('')

  let component
  if (runtime) {
    const effect = runtime
      .replace("JSON.parse(document.getElementById('cfg').textContent)", 'CONFIG')
      .replace(/setTimeout\(/g, 'later(')
      .replace(/setInterval\(/g, 'every(')
      .replace(/requestAnimationFrame\(/g, 'frame(')
      .replace(/([A-Za-z_$][\w$]*(?:\.[\w$]+|\([^()]*\))*)\.addEventListener\(/g, 'on($1, ')
      .replace(/(^|[^\w$.])addEventListener\(/g, '$1on(window, ')
      .trim()
      .split('\n')
      .map((l) => (l ? '    ' + l : l))
      .join('\n')
    component = `import { useEffect } from 'react'
${fontsCss ? "import './fonts.css'\n" : ''}${imgImports}import './Hero.css'

const CONFIG = ${JSON.stringify(JSON.parse(cfgJson || '{}'), null, 2)}

export default function Hero() {
  useEffect(() => {
    // Timers and listeners are tracked so they stop when the component unmounts.
    const timers = new Set()
    const cleanups = []
    let raf = 0
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.add(id); return id }
    const every = (fn, ms) => { const id = setInterval(fn, ms); timers.add(id); return id }
    const frame = (fn) => { raf = requestAnimationFrame(fn); return raf }
    const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)) }

${effect}

    return () => {
      timers.forEach((id) => { clearTimeout(id); clearInterval(id) })
      cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <>
${jsx.split('\n').map((l) => '      ' + l).join('\n')}
    </>
  )
}
`
  } else {
    component = `${fontsCss ? "import './fonts.css'\n" : ''}${imgImports}import './Hero.css'

export default function Hero() {
  return (
    <>
${jsx.split('\n').map((l) => '      ' + l).join('\n')}
    </>
  )
}
`
  }
  const pkg = name.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'site'
  return {
    'package.json': JSON.stringify({
      name: pkg,
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
      dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
      devDependencies: { '@vitejs/plugin-react': '^5.0.0', vite: '^7.0.0' },
    }, null, 2) + '\n',
    'vite.config.js': "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()], base: './' })\n",
    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
${icon ? `    <link rel="icon" href="${icon}" />\n` : ''}${fontHref ? `    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fontHref}" />\n` : ''}  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
    'src/main.jsx': "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport Hero from './Hero.jsx'\n\ncreateRoot(document.getElementById('root')).render(\n  <StrictMode>\n    <Hero />\n  </StrictMode>,\n)\n",
    'src/Hero.jsx': component,
    ...(fontsCss ? { 'src/fonts.css': fontsCss.trim() + '\n' } : {}),
    ...Object.fromEntries(images.map((im, i) => [`src/assets/img${i}.${im.ext}`, Uint8Array.from(atob(im.b64), (ch) => ch.charCodeAt(0))])),
    'src/Hero.css': css + '\n',
    'README.md': `# ${pkg}\n\nherocat studio로 만든 React 페이지예요.\n\n    npm install\n    npm run dev      # http://localhost:5173\n    npm run build    # dist/ 에 정적 파일 생성\n\n글은 \`src/Hero.jsx\`, 색과 폰트는 \`src/Hero.css\`에서 고칠 수 있어요.\n`,
    '.gitignore': 'node_modules\ndist\n',
  }
}
