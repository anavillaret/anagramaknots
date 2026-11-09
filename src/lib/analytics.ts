declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type GaItem = {
  item_id: string
  item_name: string
  price: number
  quantity: number
  item_category: string
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

export function viewItem(item: GaItem) {
  gtag('event', 'view_item', {
    currency: 'EUR',
    value: item.price,
    items: [item],
  })
}

export function addToCart(item: GaItem) {
  gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: item.price * item.quantity,
    items: [item],
  })
}

export function beginCheckout(items: GaItem[], value: number) {
  gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value,
    items,
  })
}

export type PurchaseData = {
  transactionId: string
  value: number
  currency: string
  items: GaItem[]
}

export function purchase(data: PurchaseData) {
  gtag('event', 'purchase', {
    transaction_id: data.transactionId,
    currency: data.currency,
    value: data.value,
    items: data.items,
  })
}

export function generateLead(formName: 'commission' | 'contact') {
  gtag('event', 'generate_lead', { form_name: formName })
}
