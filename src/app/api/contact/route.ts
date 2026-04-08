import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'

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
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
