import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = await req.json()

  const { name, email, productType, description, fileUrls } = body as {
    name: string
    email: string
    productType: string
    description: string
    fileUrls: string[]
  }

  if (!name || !email || !productType || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const filesHtml = fileUrls?.length > 0
    ? `<div style="margin-top: 20px;">
        <p style="font-size: 12px; color: #8A837C; margin-bottom: 8px;">${fileUrls.length} file(s) attached:</p>
        <ul style="margin: 0; padding: 0; list-style: none;">
          ${fileUrls.map((url, i) => `<li style="margin-bottom: 4px;"><a href="${url}" style="color: #0F7A75; font-size: 12px;">View file ${i + 1}</a></li>`).join('')}
        </ul>
      </div>`
    : ''

  try {
    await Promise.allSettled([
      // Email to Ana
      resend.emails.send({
        from: 'Anagrama <noreply@anagramaknots.com>',
        to: EMAIL,
        subject: `New commission request — ${productType} from ${name}`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #0F7A75; margin-bottom: 24px;">New Commission Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #8A837C; font-size: 13px; width: 140px;">Name</td><td style="padding: 8px 0; font-size: 13px;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #8A837C; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${email}" style="color: #0F7A75;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #8A837C; font-size: 13px;">Product type</td><td style="padding: 8px 0; font-size: 13px;">${productType}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #F7E7DD; font-size: 13px; line-height: 1.7; white-space: pre-wrap;">${description}</div>
            ${filesHtml}
          </div>
        `,
      }),

      // Confirmation to customer
      resend.emails.send({
        from: 'Ana · Anagrama <noreply@anagramaknots.com>',
        to: email,
        subject: 'We received your request ※',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #0F7A75; margin-bottom: 8px;">Thank you, ${name}.</h2>
            <p style="color: #8A837C; font-size: 14px; line-height: 1.6;">
              Your commission request has been received. Ana will review it and get back to you within <strong style="color: #1a1a1a;">3–5 working days</strong> with a price and timeline estimate.
            </p>
            <p style="color: #8A837C; font-size: 14px; line-height: 1.6; margin-top: 16px;">
              In the meantime, feel free to browse the collection or follow the making process on Instagram <a href="https://www.instagram.com/anagrama_knots/" style="color: #0F7A75;">@anagrama_knots</a>.
            </p>
            <p style="margin-top: 32px; font-size: 13px; color: #8A837C;">
              ※ Anagrama · Art in Knots<br/>
              <a href="mailto:anagramaknots@gmail.com" style="color: #0F7A75;">anagramaknots@gmail.com</a>
            </p>
          </div>
        `,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Commission email error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
