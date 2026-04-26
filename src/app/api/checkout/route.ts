import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FX } from '@/lib/fx'
import { getZone, ZONES, ALL_ALLOWED_COUNTRIES } from '@/lib/shipping'

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
    const {
      items,
      currency,
      country,
    }: { items: CartItem[]; currency: string; country: string } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!country) {
      return NextResponse.json({ error: 'Destination country is required' }, { status: 400 })
    }

    const cur = (currency || 'eur').toLowerCase()
    const rate = FX[cur] ?? 1
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const zone = getZone(country)
    const zoneData = ZONES[zone]
    const n = items.length

    // Human-friendly shipping label, e.g. "Portugal (2 × €6)"
    const shippingLabel = n > 1
      ? `${zoneData.label} (${n} × €${zoneData.eurPerPiece})`
      : zoneData.label

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
        // Allow all countries in the selected zone so Stripe validates the address.
        // The customer already told us their country — this just restricts the
        // address entry to that zone's countries so they can't change region mid-flow.
        allowed_countries: zoneData.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(zoneData.eurPerPiece * n * rate * 100),
              currency: cur,
            },
            display_name: shippingLabel,
            delivery_estimate: {
              minimum: { unit: 'business_day', value: zoneData.minDays },
              maximum: { unit: 'business_day', value: zoneData.maxDays },
            },
          },
        },
      ],
      metadata: {
        product_ids: items.map(i => i.product.id).join(','),
        shipping_country: country,
        shipping_zone: zone,
        items: JSON.stringify(items.map(({ product }) => ({
          name: product.name,
          quantity: 1,
          price: Math.round(product.price * rate * 100),
        }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Stripe checkout error:', msg)
    return NextResponse.json({ error: 'Checkout failed', detail: msg }, { status: 500 })
  }
}
