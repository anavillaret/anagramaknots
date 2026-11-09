import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()

  if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { error } = await db
    .from('testimonials')
    .update({ status })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const db = supabaseAdmin()
  const { error } = await db.from('testimonials').delete().eq('id', id)

  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
