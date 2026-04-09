import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { EMAIL } from '@/lib/tokens'
import { brandedEmail, infoTable, divider, TEAL, STONE } from '@/lib/emailTemplate'
import { supabaseAdmin } from '@/lib/supabase'

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
  const shipping = session.shipping_details?.address ?? session.customer_details?.address
  const shippingAddress = shipping
    ? [shipping.line1, shipping.line2, shipping.city, shipping.postal_code, shipping.country].filter(Boolean).join(', ')
    : 'Not provided'

  const amountTotal = session.amount_total ? `€${(session.amount_total / 100).toFixed(2)}` : 'N/A'

  await resend.emails.send({
    from: 'Anagrama Orders <orders@anagramaknots.com>',
    to: EMAIL,
    subject: `New order from ${customerName}`,
    html: brandedEmail(`
      <p style="font-size:18px;font-weight:600;color:${TEAL};margin:0 0 20px;">New Order Received 🎉</p>
      ${infoTable([
        { label: 'Customer', value: customerName },
        { label: 'Email', value: `<a href="mailto:${customerEmail}" style="color:${TEAL};">${customerEmail}</a>` },
        { label: 'Ship to', value: shippingAddress },
        { label: 'Total', value: `<strong>${amountTotal}</strong>` },
      ])}
      ${divider()}
      <p style="font-size:12px;color:${STONE};margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Items</p>
      <table style="width:100%;border-collapse:collapse;">
        ${formatLineItems(session)}
      </table>
      <p style="margin-top:20px;font-size:11px;color:#bbb;">Order ID: ${session.id}</p>
    `),
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
    subject: 'Your Anagrama order is confirmed ※',
    html: brandedEmail(`
      <p style="font-size:22px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">Thank you, ${customerName}.</p>
      <p style="font-size:14px;color:${STONE};line-height:1.7;margin:0 0 24px;">
        Your order has been confirmed. Ana will prepare it by hand, with care — just for you.
      </p>
      <p style="font-size:12px;color:${STONE};margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Order Summary</p>
      <table style="width:100%;border-collapse:collapse;">
        ${formatLineItems(session)}
      </table>
      <p style="margin-top:12px;font-size:13px;"><strong>Total paid: ${amountTotal}</strong></p>
      ${divider()}
      <p style="font-size:14px;color:${STONE};line-height:1.7;margin:0 0 12px;">
        You'll receive a shipping notification once your piece is on its way.
        Questions? Reply to this email or write to
        <a href="mailto:${EMAIL}" style="color:${TEAL};">${EMAIL}</a>.
      </p>
    `),
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

    // Save order to Supabase
    try {
      const db = supabaseAdmin()
      const customerName = session.shipping_details?.name ?? session.customer_details?.name ?? ''
      const customerEmail = session.customer_details?.email ?? ''
      const shipping = session.shipping_details?.address ?? session.customer_details?.address
      const shippingAddress = shipping
        ? { line1: shipping.line1, line2: shipping.line2, city: shipping.city, postal_code: shipping.postal_code, country: shipping.country }
        : {}

      let lineItems: Array<{ name: string; quantity: number; price: number }> = []
      try { lineItems = JSON.parse(session.metadata?.items ?? '[]') } catch { /* ignore */ }

      await db.from('orders').insert({
        stripe_session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerName,
        status: 'paid',
        currency: session.currency?.toUpperCase() ?? 'EUR',
        total_amount: session.amount_total ?? 0,
        line_items: lineItems,
        shipping_address: shippingAddress,
        notes: '',
      })

      // Mark purchased products as sold out + available on commission
      for (const item of lineItems) {
        await db
          .from('products')
          .update({ badge: 'soldout', available_on_request: true })
          .ilike('name', item.name)
      }
    } catch (err) {
      console.error('Failed to save order to Supabase:', err)
    }

    // Send emails
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
