'use client'

import Link from 'next/link'
import ClearCart from '@/components/cart/ClearCart'
import { useLang } from '@/lib/i18n/context'

export default function SuccessContent() {
  const { t } = useLang()
  const s = t.success

  return (
    <main className="pt-36 pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <ClearCart />
      <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{s.eyebrow}</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-tight tracking-tight">
        {s.heading[0]}<br />
        <em className="font-normal not-italic text-teal">{s.heading[1]}</em>
      </h1>
      <p className="mt-6 text-[14px] leading-relaxed text-stone max-w-sm">
        {s.sub}
      </p>
      <p className="mt-3 text-[13px] text-stone">
        {s.contact} <span className="text-ink">hello@anagramaknots.com</span>
      </p>
      <div className="mt-10 flex items-center gap-6">
        <Link
          href="/products"
          className="inline-flex items-center bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors"
        >
          {s.cta}
        </Link>
        <Link
          href="/"
          className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
        >
          {s.home}
        </Link>
      </div>
    </main>
  )
}
