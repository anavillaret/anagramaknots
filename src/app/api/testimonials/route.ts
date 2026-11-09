import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'
import { brandedEmail, infoTable, divider } from '@/lib/emailTemplate'

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { name, location, text, product_name, product_id, media_urls } = await req.json()

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { error } = await db.from('testimonials').insert({
    name: name.trim(),
    location: location?.trim() || null,
    text: text.trim(),
    product_name: product_name || null,
    product_id: product_id || null,
    media_urls: Array.isArray(media_urls) ? media_urls : [],
    status: 'pending',
  })

  if (error) {
    console.error('Testimonial insert error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  // Notify Ana
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Anagrama Site <noreply@anagramaknots.com>',
      to: EMAIL,
      subject: `[Anagrama] New testimonial from ${name}`,
      html: brandedEmail(`
        <p style="font-size:18px;font-weight:600;color:#0F7A75;margin:0 0 20px;">New Testimonial to Approve</p>
        ${infoTable([
          { label: 'From', value: name },
          { label: 'Location', value: location || '—' },
          { label: 'Product', value: product_name || '—' },
        ])}
        ${divider()}
        <p style="font-size:15px;line-height:1.7;color:#1a1a1a;font-style:italic;">"${text}"</p>
        ${divider()}
        <a href="https://anagramaknots.com/admin/testimonials" style="display:inline-block;background:#0F7A75;color:#fff;padding:12px 28px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">
          Approve in Backoffice →
        </a>
      `),
    })
  } catch (e) {
    console.error('Testimonial notification email error:', e)
  }

  return NextResponse.json({ ok: true })
}
