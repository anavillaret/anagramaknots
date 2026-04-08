'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { SHOP_OPEN } from '@/lib/siteConfig'

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (SHOP_OPEN) return
    const dismissed = sessionStorage.getItem('banner_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    sessionStorage.setItem('banner_dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="bg-ink text-white px-4 py-2.5 flex items-center justify-center gap-4 relative">
      <p className="text-[11px] tracking-[0.12em] text-center">
        ※ The shop is coming soon — browse freely and{' '}
        <Link href="/commission" className="underline underline-offset-2 hover:text-teal transition-colors">
          reach out to commission a piece
        </Link>
        . Purchasing will open shortly.
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}
