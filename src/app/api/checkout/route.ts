import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FX } from '@/lib/fx'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type CartItem = {
  product: {
    id: string
    name: string
    price: number
    image: string
    species?: string
  }
  personalisation?: string
}

export async function POST(req: NextRequest) {
  try {
    const { items, currency }: { items: CartItem[]; currency: string } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const cur = (currency || 'eur').toLowerCase()
    const rate = FX[cur] ?? 1
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const line_items = items.map(({ product, personalisation }) => ({
      price_data: {
        currency: cur,
        product_data: {
          name: `※ ${product.name}`,
          description: [
            product.species || null,
            personalisation ? `Note: ${personalisation}` : null,
            'One of a kind · Handmade in Portugal',
          ]
            .filter(Boolean)
            .join(' · '),
        },
        unit_amount: Math.round(product.price * rate * 100),
      },
      quantity: 1,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await (stripe.checkout.sessions.create as any)({
      payment_method_types: ['card', 'mb_way'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: [
          'PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'GB', 'IE', 'US',
          'CA', 'AU', 'NZ', 'BR', 'JP', 'SG', 'CH', 'AT', 'SE', 'NO',
          'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'GR', 'HR', 'SK', 'SI',
        ],
      },
      // Shipping is per piece — each item is individually boxed as a complete gift.
      // Multiply base rate by the number of items in the cart.
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(6 * items.length * rate * 100), currency: cur },
            display_name: items.length > 1 ? `Portugal (${items.length} × €6)` : 'Portugal',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(9 * items.length * rate * 100), currency: cur },
            display_name: items.length > 1 ? `Spain (${items.length} × €9)` : 'Spain',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(14 * items.length * rate * 100), currency: cur },
            display_name: items.length > 1 ? `Rest of Europe (${items.length} × €14)` : 'Rest of Europe',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(21 * items.length * rate * 100), currency: cur },
            display_name: items.length > 1 ? `Rest of World (${items.length} × €21)` : 'Rest of World',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 9 },
            },
          },
        },
      ],
      metadata: {
        product_ids: items.map(i => i.product.id).join(','),
        items: JSON.stringify(items.map(({ product }) => ({
          name: product.name,
          quantity: 1,
          price: Math.round(product.price * rate * 100),
        }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
