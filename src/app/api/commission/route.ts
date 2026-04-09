import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'
import { brandedEmail, infoTable, divider, linedBlock, TEAL, STONE } from '@/lib/emailTemplate'

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
    ? `${divider()}
       <p style="font-size:12px;color:${STONE};margin:0 0 8px;">${fileUrls.length} file(s) attached:</p>
       <ul style="margin:0;padding:0;list-style:none;">
         ${fileUrls.map((url, i) => `<li style="margin-bottom:6px;"><a href="${url}" style="color:${TEAL};font-size:13px;">📎 View file ${i + 1}</a></li>`).join('')}
       </ul>`
    : ''

  try {
    await Promise.allSettled([
      // Email to Ana
      resend.emails.send({
        from: 'Anagrama <noreply@anagramaknots.com>',
        to: EMAIL,
        subject: `New commission request — ${productType} from ${name}`,
        html: brandedEmail(`
          <p style="font-size:18px;font-weight:600;color:${TEAL};margin:0 0 20px;">New Commission Request</p>
          ${infoTable([
            { label: 'Name', value: name },
            { label: 'Email', value: `<a href="mailto:${email}" style="color:${TEAL};">${email}</a>` },
            { label: 'Type', value: productType },
          ])}
          ${divider()}
          <p style="font-size:12px;color:${STONE};margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
          ${linedBlock(description)}
          ${filesHtml}
        `),
      }),

      // Confirmation to customer
      resend.emails.send({
        from: 'Ana · Anagrama <noreply@anagramaknots.com>',
        to: email,
        subject: 'We received your request ※',
        html: brandedEmail(`
          <p style="font-size:22px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">Thank you, ${name}.</p>
          <p style="font-size:14px;color:${STONE};line-height:1.7;margin:0 0 16px;">
            Your commission request has been received. Ana will review it and get back to you within
            <strong style="color:#1a1a1a;">3–5 working days</strong> with a price and timeline estimate.
            No commitment required.
          </p>
          <p style="font-size:14px;color:${STONE};line-height:1.7;margin:0;">
            In the meantime, feel free to explore the collection or follow the making process on Instagram
            <a href="https://www.instagram.com/anagrama_knots/" style="color:${TEAL};">@anagrama_knots</a>.
          </p>
        `),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Commission email error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
