'use client'

import Link from 'next/link'
import { SHOP_OPEN } from '@/lib/siteConfig'

export default function AnnouncementBanner() {
  if (SHOP_OPEN) return null

  return (
    <div className="bg-ink text-white px-4 py-2.5 flex items-center justify-center">
      <p className="text-[11px] tracking-[0.12em] text-center leading-relaxed">
        ※ The shop is coming soon — browse freely and{' '}
        <Link href="/commission" className="underline underline-offset-2 hover:text-teal transition-colors">
          commission a piece
        </Link>
        . Purchases will open shortly.
      </p>
    </div>
  )
}
