import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('events')
    .select('*')
    .eq('active', true)
    .order('date', { ascending: false })

  if (error) {
    console.error('[GET /api/events]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [], {
    headers: { 'Cache-Control': 'no-store' },
  })
}
