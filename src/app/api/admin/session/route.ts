import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/requireAdminSession'

export async function GET(req: NextRequest) {
  const err = await requireAdminSession(req)
  if (err) return err
  return NextResponse.json({ ok: true })
}
