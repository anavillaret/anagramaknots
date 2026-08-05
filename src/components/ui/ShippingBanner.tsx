'use client'

import { useLang } from '@/lib/i18n/context'

const until = process.env.NEXT_PUBLIC_FREE_SHIPPING_UNTIL

function isActive(): boolean {
  if (!until) return false
  return new Date() <= new Date(until + 'T23:59:59Z')
}

export default function ShippingBanner() {
  const { t } = useLang()

  if (!isActive()) return null

  return (
    <div className="bg-teal text-white text-center text-[11px] tracking-[0.15em] uppercase py-2 px-4">
      {t.banner.freeShipping}
    </div>
  )
}
