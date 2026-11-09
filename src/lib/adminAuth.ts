// HMAC-SHA256 signed session tokens using Web Crypto API.
// Works in both Edge Runtime (middleware) and Node.js (API routes).

const ALG = { name: 'HMAC', hash: 'SHA-256' }
const SESSION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let str = ''
  bytes.forEach(b => { str += String.fromCharCode(b) })
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64Url(s: string): Uint8Array {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - s.length % 4) % 4)
  const str = atob(base64)
  return new Uint8Array(str.split('').map(c => c.charCodeAt(0)))
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    ALG,
    false,
    ['sign', 'verify'],
  )
}

export async function signSession(secret: string): Promise<string> {
  const expires = Date.now() + SESSION_MS
  const key = await importKey(secret)
  const data = new TextEncoder().encode(String(expires))
  const sig = await crypto.subtle.sign(ALG, key, data)
  return `${expires}.${toBase64Url(sig)}`
}

export async function verifySession(value: string | undefined, secret: string): Promise<boolean> {
  if (!value) return false
  const dot = value.indexOf('.')
  if (dot === -1) return false
  const expiresStr = value.slice(0, dot)
  const sigStr = value.slice(dot + 1)
  const expires = parseInt(expiresStr, 10)
  if (isNaN(expires) || Date.now() > expires) return false
  const key = await importKey(secret)
  const data = new TextEncoder().encode(expiresStr)
  try {
    const sigBytes = fromBase64Url(sigStr)
    return await crypto.subtle.verify(ALG, key, sigBytes.buffer as ArrayBuffer, data)
  } catch {
    return false
  }
}
