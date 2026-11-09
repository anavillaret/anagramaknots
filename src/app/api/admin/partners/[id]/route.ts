import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminSession } from '@/lib/requireAdminSession'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authErr = await requireAdminSession(req)
  if (authErr) return authErr

  const body = await req.json()
  const db = supabaseAdmin()
  const { error } = await db.from('partners').update(body).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authErr = await requireAdminSession(req)
  if (authErr) return authErr

  const db = supabaseAdmin()
  const { error } = await db.from('partners').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
