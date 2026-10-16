// Minimal ZIP writer (store only, no compression). Enough for a handful of text files.
const TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(bytes) {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

export function makeZip(files) {
  const enc = new TextEncoder()
  const chunks = []
  const central = []
  let offset = 0
  const push = (u8) => { chunks.push(u8); offset += u8.length }

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = enc.encode(name)
    const data = typeof content === 'string' ? enc.encode(content) : content
    const crc = crc32(data)
    const head = new DataView(new ArrayBuffer(30))
    head.setUint32(0, 0x04034b50, true)
    head.setUint16(4, 20, true)
    head.setUint16(6, 0x0800, true) // UTF-8 names
    head.setUint32(14, crc, true)
    head.setUint32(18, data.length, true)
    head.setUint32(22, data.length, true)
    head.setUint16(26, nameBytes.length, true)
    const start = offset
    push(new Uint8Array(head.buffer)); push(nameBytes); push(data)

    const c = new DataView(new ArrayBuffer(46))
    c.setUint32(0, 0x02014b50, true)
    c.setUint16(4, 20, true)
    c.setUint16(6, 20, true)
    c.setUint16(8, 0x0800, true)
    c.setUint32(16, crc, true)
    c.setUint32(20, data.length, true)
    c.setUint32(24, data.length, true)
    c.setUint16(28, nameBytes.length, true)
    c.setUint32(42, start, true)
    central.push(new Uint8Array(c.buffer), nameBytes)
  }
  const cdStart = offset
  central.forEach(push)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(8, Object.keys(files).length, true)
  end.setUint16(10, Object.keys(files).length, true)
  end.setUint32(12, offset - cdStart, true)
  end.setUint32(16, cdStart, true)
  push(new Uint8Array(end.buffer))
  return new Blob(chunks, { type: 'application/zip' })
}
