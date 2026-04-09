import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('events')
      .select('*')
      .eq('active', true)
      .order('date', { ascending: false })

    if (error) throw error
    return NextResponse.json(data ?? [], {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[GET /api/events]', err)
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
