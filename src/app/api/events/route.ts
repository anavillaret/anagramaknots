import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Use service role key to bypass RLS; fall back to anon if not available
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await db
    .from('events')
    .select('*')
    .eq('active', true)
    .order('date', { ascending: false })

  if (error) {
    console.error('[GET /api/events] error:', JSON.stringify(error))
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  // Temporarily return debug info alongside data so we can see what's happening
  console.log('[GET /api/events] rows returned:', data?.length, 'key prefix:', key?.slice(0, 10))

  return NextResponse.json(data ?? [], {
    headers: { 'Cache-Control': 'no-store' },
  })
}
