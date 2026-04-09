/** Static FX rates relative to EUR — used in cart display and Stripe checkout */
export const FX: Record<string, number> = {
  eur: 1,
  usd: 1.09,
  gbp: 0.86,
}

export const CURRENCIES = [
  { code: 'eur', label: 'EUR €', symbol: '€' },
  { code: 'usd', label: 'USD $', symbol: '$' },
  { code: 'gbp', label: 'GBP £', symbol: '£' },
]
