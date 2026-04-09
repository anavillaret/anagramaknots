'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/i18n/context'

export default function CookieBanner() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-light shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-stone leading-relaxed max-w-xl">
          {t.cookie.message}{' '}
          <Link href="/privacy" className="text-teal underline underline-offset-2 hover:text-teal-dark transition-colors">
            {t.footer.privacy}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border border-stone-light px-5 py-2"
          >
            {t.cookie.decline}
          </button>
          <button
            onClick={handleAccept}
            className="text-[11px] tracking-[0.15em] uppercase bg-teal text-white px-5 py-2 hover:bg-teal-dark transition-colors"
          >
            {t.cookie.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
