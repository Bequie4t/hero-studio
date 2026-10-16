// Pre-subsets the Korean fonts to the 2,350 common Hangul syllables (KS X 1001) plus Latin and symbols.
// The editor loads these on demand and trims them again to the characters a page really uses.
//   node scripts/ko-fonts.mjs
import fs from 'node:fs'
import subsetFont from 'subset-font'

const P = 'node_modules/pretendard/dist/web/static/woff2/Pretendard-'
const G = 'node_modules/@expo-google-fonts/'
const SOURCES = {
  pretendard: { 400: P + 'Regular.woff2', 500: P + 'Medium.woff2', 700: P + 'Bold.woff2', 800: P + 'ExtraBold.woff2' },
  gowunbatang: { 400: G + 'gowun-batang/400Regular/GowunBatang_400Regular.ttf', 700: G + 'gowun-batang/700Bold/GowunBatang_700Bold.ttf' },
  gowundodum: { 400: G + 'gowun-dodum/400Regular/GowunDodum_400Regular.ttf' },
  jua: { 400: G + 'jua/400Regular/Jua_400Regular.ttf' },
  blackhan: { 400: G + 'black-han-sans/400Regular/BlackHanSans_400Regular.ttf' },
  nanumpen: { 400: G + 'nanum-pen-script/400Regular/NanumPenScript_400Regular.ttf' },
  galmuri: { 400: 'node_modules/galmuri/dist/Galmuri11.woff2', 700: 'node_modules/galmuri/dist/Galmuri11-Bold.woff2' },
  galmurimono: { 400: 'node_modules/galmuri/dist/GalmuriMono11.woff2' },
}

function ksx1001Hangul() {
  const dec = new TextDecoder('euc-kr')
  let out = ''
  for (let hi = 0xb0; hi <= 0xc8; hi++) {
    for (let lo = 0xa1; lo <= 0xfe; lo++) {
      const ch = dec.decode(new Uint8Array([hi, lo]))
      if (/[가-힣]/.test(ch)) out += ch
    }
  }
  return out
}
let ascii = ''
for (let i = 0x20; i < 0x7f; i++) ascii += String.fromCharCode(i)
const symbols = '·…—–‘’“”′″〈〉《》「」『』【】♡♥♪♬★☆※→←↑↓↔✓✕×÷±°℃♀♂•◆◇■□▲△▼▽○●◎♭♯✦✧❤❣♠♣♦ㅤ'
const text = ascii + ksx1001Hangul() + symbols + 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
console.log('characters:', [...text].length)

fs.mkdirSync('public/fonts/ko', { recursive: true })
for (const [id, files] of Object.entries(SOURCES)) {
  for (const [w, file] of Object.entries(files)) {
    const t0 = Date.now()
    const out = await subsetFont(fs.readFileSync(file), text, { targetFormat: 'woff' })
    fs.writeFileSync(`public/fonts/ko/${id}-${w}.woff`, out)
    console.log(`${id}-${w}: ${(out.length / 1024).toFixed(0)} KB (${Date.now() - t0} ms)`)
  }
}
