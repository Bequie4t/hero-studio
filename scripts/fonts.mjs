// Copies the latin woff2 files the templates use from node_modules into src/fonts/files.
// Run after changing src/fonts/registry.js:  node scripts/fonts.mjs
import fs from 'node:fs'
import { FONTS } from '../src/fonts/registry.js'

const out = new URL('../src/fonts/files/', import.meta.url)
fs.mkdirSync(out, { recursive: true })
let n = 0, bytes = 0
for (const [id, f] of Object.entries(FONTS)) {
  for (const w of f.weights) {
    const name = `${f.pkg}-latin-${w}-normal.woff2`
    const src = new URL(`../node_modules/@fontsource/${f.pkg}/files/${name}`, import.meta.url)
    fs.copyFileSync(src, new URL(`${id}-${w}.woff2`, out))
    bytes += fs.statSync(src).size; n++
  }
}
console.log(`copied ${n} files, ${(bytes / 1024).toFixed(0)} KB`)
