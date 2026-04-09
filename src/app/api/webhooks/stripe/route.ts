import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function formatLineItems(session: Stripe.Checkout.Session) {
  const items = session.metadata?.items
  if (!items) return '<p>Order details unavailable.</p>'
  try {
    const parsed = JSON.parse(items) as Array<{ name: string; quantity: number; price: number }>
    return parsed.map(i => `<tr>
      <td style="padding:6px 0;border-bottom:1px solid #eee;">${i.name}</td>
      <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">×${i.quantity}</td>
      <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">€${(i.price / 100).toFixed(2)}</td>
    </tr>`).join('')
  } catch {
    return '<tr><td colspan="3">Order details unavailable.</td></tr>'
  }
}

async function sendOrderNotificationToAna(session: Stripe.Checkout.Session, resend: Resend) {
  const customerName = session.shipping_details?.name ?? session.customer_details?.name ?? 'Unknown'
  const customerEmail = session.customer_details?.email ?? 'Unknown'
  const shipping = session.shipping_details?.address
  const shippingAddress = shipping
    ? [shipping.line1, shipping.line2, shipping.city, shipping.postal_code, shipping.country].filter(Boolean).join(', ')
    : 'Not provided'

  const amountTotal = session.amount_total ? `€${(session.amount_total / 100).toFixed(2)}` : 'N/A'

  await resend.emails.send({
    from: 'Anagrama Orders <orders@anagramaknots.com>',
    to: EMAIL,
    subject: `New order from ${customerName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="color:#0F7A75;">New Order Received</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Ship to:</strong> ${shippingAddress}</p>
        <p><strong>Total:</strong> ${amountTotal}</p>
        <h3 style="margin-top:24px;">Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          ${formatLineItems(session)}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#888;">Order ID: ${session.id}</p>
      </div>
    `,
  })
}

async function sendConfirmationToCustomer(session: Stripe.Checkout.Session, resend: Resend) {
  const customerEmail = session.customer_details?.email
  if (!customerEmail) return

  const customerName = session.shipping_details?.name ?? session.customer_details?.name ?? 'there'
  const amountTotal = session.amount_total ? `€${(session.amount_total / 100).toFixed(2)}` : 'N/A'

  await resend.emails.send({
    from: 'Anagrama <hello@anagramaknots.com>',
    to: customerEmail,
    subject: 'Your Anagrama order is confirmed ✦',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="color:#0F7A75;">Thank you, ${customerName}.</h2>
        <p>Your order has been confirmed and Ana will start preparing it with care.</p>
        <h3 style="margin-top:24px;">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;">
          ${formatLineItems(session)}
        </table>
        <p style="margin-top:16px;"><strong>Total paid:</strong> ${amountTotal}</p>
        <p style="margin-top:24px;">You'll receive a shipping notification with a tracking number once your piece is on its way.</p>
        <p>Questions? Reply to this email or reach us at <a href="mailto:${EMAIL}" style="color:#0F7A75;">${EMAIL}</a>.</p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />
        <p style="font-size:11px;color:#999;">Anagrama Art in Knots · Handmade in Portugal</p>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const resend = getResend()

    if (resend) {
      await Promise.allSettled([
        sendOrderNotificationToAna(session, resend),
        sendConfirmationToCustomer(session, resend),
      ])
    } else {
      console.warn('RESEND_API_KEY not set — skipping order emails')
    }
  }

  return NextResponse.json({ received: true })
}
