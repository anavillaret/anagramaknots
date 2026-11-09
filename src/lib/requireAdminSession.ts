import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from './adminAuth'

export async function requireAdminSession(req: NextRequest): Promise<NextResponse | null> {
  const session = req.cookies.get('admin_session')?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !(await verifySession(session, secret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
