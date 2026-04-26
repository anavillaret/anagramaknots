import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export type StoryPhoto = { src: string; alt: string }

const KEY = 'story_photos'

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data } = await db
      .from('site_config')
      .select('value')
      .eq('key', KEY)
      .single()

    const photos = (data?.value as { photos?: StoryPhoto[] })?.photos ?? null
    return NextResponse.json({ ok: true, photos })
  } catch {
    return NextResponse.json({ ok: true, photos: null })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { photos } = await req.json()

    if (!Array.isArray(photos)) {
      return NextResponse.json({ error: 'photos must be an array' }, { status: 400 })
    }

    const db = supabaseAdmin()
    await db
      .from('site_config')
      .upsert({ key: KEY, value: { photos } }, { onConflict: 'key' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[story-photos]', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
