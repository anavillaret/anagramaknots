import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const db = supabaseAdmin()

  // Ensure the bucket exists (creates it on first upload if needed)
  await db.storage.createBucket('products', { public: true }).catch(() => {})

  // Unique filename: timestamp + original name, spaces replaced
  const safeName = file.name.replace(/\s+/g, '-').toLowerCase()
  const filename = `${Date.now()}-${safeName}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await db.storage
    .from('products')
    .upload(filename, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = db.storage.from('products').getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}
