import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'
import { brandedEmail, infoTable, divider, linedBlock } from '@/lib/emailTemplate'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Anagrama Contact <noreply@anagramaknots.com>',
      to: EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: brandedEmail(`
        <p style="font-size:18px;font-weight:600;color:#0F7A75;margin:0 0 20px;">New Message</p>
        ${infoTable([
          { label: 'From', value: `${name}` },
          { label: 'Email', value: `<a href="mailto:${email}" style="color:#0F7A75;">${email}</a>` },
          { label: 'Subject', value: subject },
        ])}
        ${divider()}
        ${linedBlock(message)}
      `),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
