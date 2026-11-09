import Stripe from 'stripe'
import SuccessContent from '@/components/cart/SuccessContent'
import type { PurchaseData } from '@/lib/analytics'

export const metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let purchaseData: PurchaseData | null = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items'],
      })

      const metaItems: Array<{ name: string; quantity: number; price: number }> =
        session.metadata?.items ? JSON.parse(session.metadata.items) : []

      purchaseData = {
        transactionId: session.id,
        value: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? 'eur').toUpperCase(),
        items: metaItems.map(item => ({
          item_id: item.name.toLowerCase().replace(/\s+/g, '-'),
          item_name: item.name,
          price: item.price / 100,
          quantity: item.quantity,
          item_category: 'amigurumis',
        })),
      }
    } catch (err) {
      console.error('[success] Stripe session fetch failed:', err)
    }
  }

  return <SuccessContent purchaseData={purchaseData} />
}
