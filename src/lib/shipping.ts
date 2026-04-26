export type ShippingZone = 'portugal' | 'spain' | 'europe' | 'world'

export type ZoneData = {
  eurPerPiece: number
  label: string   // display name in Stripe checkout
  days: string    // delivery estimate string (for UI)
  minDays: number
  maxDays: number
  countries: string[]
}

export const ZONES: Record<ShippingZone, ZoneData> = {
  portugal: {
    eurPerPiece: 6,
    label: 'Portugal',
    days: '1–3 business days',
    minDays: 1,
    maxDays: 3,
    countries: ['PT'],
  },
  spain: {
    eurPerPiece: 9,
    label: 'Spain',
    days: '2–5 business days',
    minDays: 2,
    maxDays: 5,
    countries: ['ES'],
  },
  europe: {
    eurPerPiece: 14,
    label: 'Rest of Europe',
    days: '5–7 business days',
    minDays: 5,
    maxDays: 7,
    countries: [
      'FR', 'DE', 'IT', 'NL', 'BE', 'GB', 'IE', 'CH',
      'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU',
      'RO', 'GR', 'HR', 'SK', 'SI',
    ],
  },
  world: {
    eurPerPiece: 21,
    label: 'Rest of World',
    days: '5–9 business days',
    minDays: 5,
    maxDays: 9,
    countries: ['US', 'CA', 'AU', 'NZ', 'BR', 'JP', 'SG'],
  },
}

// All supported countries, sorted for the dropdown
// Portugal and Spain are pinned first for Ana's primary market
export const SHIPPING_COUNTRIES: { code: string; name: string; zone: ShippingZone }[] = [
  { code: 'PT', name: 'Portugal', zone: 'portugal' },
  { code: 'ES', name: 'Spain / España', zone: 'spain' },
  // --- Europe ---
  { code: 'AT', name: 'Austria', zone: 'europe' },
  { code: 'BE', name: 'Belgium', zone: 'europe' },
  { code: 'HR', name: 'Croatia', zone: 'europe' },
  { code: 'CZ', name: 'Czech Republic', zone: 'europe' },
  { code: 'DK', name: 'Denmark', zone: 'europe' },
  { code: 'FI', name: 'Finland', zone: 'europe' },
  { code: 'FR', name: 'France', zone: 'europe' },
  { code: 'DE', name: 'Germany', zone: 'europe' },
  { code: 'GR', name: 'Greece', zone: 'europe' },
  { code: 'HU', name: 'Hungary', zone: 'europe' },
  { code: 'IE', name: 'Ireland', zone: 'europe' },
  { code: 'IT', name: 'Italy', zone: 'europe' },
  { code: 'NL', name: 'Netherlands', zone: 'europe' },
  { code: 'NO', name: 'Norway', zone: 'europe' },
  { code: 'PL', name: 'Poland', zone: 'europe' },
  { code: 'RO', name: 'Romania', zone: 'europe' },
  { code: 'SK', name: 'Slovakia', zone: 'europe' },
  { code: 'SI', name: 'Slovenia', zone: 'europe' },
  { code: 'SE', name: 'Sweden', zone: 'europe' },
  { code: 'CH', name: 'Switzerland', zone: 'europe' },
  { code: 'GB', name: 'United Kingdom', zone: 'europe' },
  // --- Rest of world ---
  { code: 'AU', name: 'Australia', zone: 'world' },
  { code: 'BR', name: 'Brazil', zone: 'world' },
  { code: 'CA', name: 'Canada', zone: 'world' },
  { code: 'JP', name: 'Japan', zone: 'world' },
  { code: 'NZ', name: 'New Zealand', zone: 'world' },
  { code: 'SG', name: 'Singapore', zone: 'world' },
  { code: 'US', name: 'United States', zone: 'world' },
]

/** All country codes Stripe should accept for address collection */
export const ALL_ALLOWED_COUNTRIES = SHIPPING_COUNTRIES.map(c => c.code)

export function getZone(countryCode: string): ShippingZone {
  for (const [zone, data] of Object.entries(ZONES) as [ShippingZone, ZoneData][]) {
    if (data.countries.includes(countryCode)) return zone
  }
  return 'world'
}
