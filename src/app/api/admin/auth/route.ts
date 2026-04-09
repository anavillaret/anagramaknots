import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/auth — verifies admin password server-side
// Password is stored in ADMIN_PASSWORD env var (not NEXT_PUBLIC_)
export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 })
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
