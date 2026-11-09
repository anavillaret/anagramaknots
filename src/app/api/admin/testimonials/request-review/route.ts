import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireAdminSession } from '@/lib/requireAdminSession'
import { brandedEmail, divider } from '@/lib/emailTemplate'

const TEAL = '#0F7A75'

export async function POST(req: NextRequest) {
  const authErr = await requireAdminSession(req)
  if (authErr) return authErr

  const { customer_email, customer_name, product_name, product_id } = await req.json()

  if (!customer_email || !product_name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const firstName = customer_name?.split(' ')[0] || 'there'

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.anagramaknots.com'
  const reviewUrl = product_id
    ? `${SITE_URL}/products/${product_id}?review=1`
    : `${SITE_URL}/review`

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Ana · Anagrama <ana@anagramaknots.com>',
      to: customer_email,
      subject: `Your ${product_name} — a quick note from Ana ✦`,
      html: brandedEmail(`
        <p style="font-size:16px;line-height:1.8;color:#1a1a1a;margin:0 0 16px;">
          Olá ${firstName},
        </p>
        <p style="font-size:15px;line-height:1.8;color:#1a1a1a;margin:0 0 16px;">
          I hope your <strong>${product_name}</strong> has arrived safely and that you're loving it as much as I loved making it.
        </p>
        <p style="font-size:15px;line-height:1.8;color:#1a1a1a;margin:0 0 24px;">
          If you have a moment, I'd love to hear what you think — a few words from you mean everything to someone who hasn't yet found the courage to place their first order. 🌿
        </p>
        ${divider()}
        <div style="text-align:center;padding:8px 0 24px;">
          <a href="${reviewUrl}" style="display:inline-block;background:${TEAL};color:#fff;padding:14px 32px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">
            Leave my review →
          </a>
        </div>
        ${divider()}
        <p style="font-size:13px;line-height:1.7;color:#8A837C;margin:16px 0 0;">
          No pressure at all — and thank you so much for supporting this little handmade project. 🤍
        </p>
        <p style="font-size:13px;color:#8A837C;margin:8px 0 0;">Ana</p>
      `),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Review request email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
