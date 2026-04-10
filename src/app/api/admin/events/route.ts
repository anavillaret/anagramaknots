import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('events')
    .select('*')
    .order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('events')
      .insert([{
        title:          body.title,
        title_pt:       body.title_pt ?? '',
        date:           body.date,
        place:          body.place,
        description:    body.description ?? '',
        description_pt: body.description_pt ?? '',
        photos:         body.photos ?? [],
        active:         body.active ?? true,
        sort_order:     body.sort_order ?? 0,
      }])
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
