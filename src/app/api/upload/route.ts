import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Public upload endpoint for commission form attachments
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
  }

  const db = supabaseAdmin()
  await db.storage.createBucket('commission-files', { public: true }).catch(() => {})

  const safeName = file.name.replace(/\s+/g, '-').toLowerCase()
  const filename = `${Date.now()}-${safeName}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await db.storage
    .from('commission-files')
    .upload(filename, arrayBuffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = db.storage.from('commission-files').getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}
