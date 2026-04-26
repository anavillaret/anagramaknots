import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { PageKey } from '@/lib/pageContent'

const VALID_PAGES: PageKey[] = [
  'page_home',
  'page_story',
  'page_shipping',
  'page_commission',
  'page_contact',
]

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params
  const key = page as PageKey

  if (!VALID_PAGES.includes(key)) {
    return NextResponse.json({ error: 'Invalid page key' }, { status: 400 })
  }

  try {
    const db = supabaseAdmin()
    const { data } = await db
      .from('site_config')
      .select('value')
      .eq('key', key)
      .single()

    if (data?.value) {
      return NextResponse.json({ ok: true, content: data.value })
    }
    return NextResponse.json({ ok: true, content: { en: {}, pt: {} } })
  } catch {
    return NextResponse.json({ ok: true, content: { en: {}, pt: {} } })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params
  const key = page as PageKey

  if (!VALID_PAGES.includes(key)) {
    return NextResponse.json({ error: 'Invalid page key' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { en, pt } = body

    if (typeof en !== 'object' || typeof pt !== 'object') {
      return NextResponse.json({ error: 'en and pt must be objects' }, { status: 400 })
    }

    const db = supabaseAdmin()
    await db
      .from('site_config')
      .upsert({ key, value: { en, pt } }, { onConflict: 'key' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/content]', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
