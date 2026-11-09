import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { signSession } from '@/lib/adminAuth'

const COOKIE = 'admin_session'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!expected || !secret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  // Constant-time comparison prevents timing attacks
  const enc = new TextEncoder()
  const a = enc.encode(password ?? '')
  const b = enc.encode(expected)
  const match =
    a.length === b.length &&
    timingSafeEqual(Buffer.from(a), Buffer.from(b))

  if (!match) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const token = await signSession(secret)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, token, COOKIE_OPTIONS)
  return response
}

// DELETE — logout: clears the session cookie
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })
  return response
}
