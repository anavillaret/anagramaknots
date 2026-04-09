import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { slugs } = await req.json()
    if (!Array.isArray(slugs) || slugs.length !== 3) {
      return NextResponse.json({ error: 'Exactly 3 slugs required' }, { status: 400 })
    }
    const db = supabaseAdmin()
    await db
      .from('site_config')
      .upsert({ key: 'hero_products', value: slugs })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/hero]', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
