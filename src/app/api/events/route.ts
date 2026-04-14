import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('events')
    .select('*')
    .eq('active', true)
    .neq('id', '3a66f45a-ec6a-4955-ad8d-ea92ccc2655b')
    .order('date', { ascending: false })

  if (error) {
    console.error('[GET /api/events] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [], {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  })
}
