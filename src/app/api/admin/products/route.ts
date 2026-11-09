import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminSession } from '@/lib/requireAdminSession'

// GET /api/admin/products — returns ALL products (including hidden) via service role
export async function GET(req: NextRequest) {
  const authErr = await requireAdminSession(req)
  if (authErr) return authErr

  const db = supabaseAdmin()
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/products — create a new product (starts as draft, active=false)
export async function POST(request: NextRequest) {
  const authErr = await requireAdminSession(request)
  if (authErr) return authErr

  const body = await request.json()
  const db = supabaseAdmin()
  const { data, error } = await db.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
