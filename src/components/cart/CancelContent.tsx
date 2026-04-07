'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n/context'

export default function CancelContent() {
  const { t } = useLang()
  const c = t.cancel

  return (
    <main className="pt-28 pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{c.eyebrow}</p>
      <h1 className="text-4xl font-semibold text-ink tracking-tight">
        {c.heading[0]}<br />
        <em className="font-normal not-italic text-teal">{c.heading[1]}</em>
      </h1>
      <p className="mt-6 text-[14px] leading-relaxed text-stone max-w-sm">
        {c.sub}
      </p>
      <div className="mt-10 flex items-center gap-6">
        <Link
          href="/cart"
          className="inline-flex items-center bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors"
        >
          {c.cta}
        </Link>
        <Link
          href="/products"
          className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
        >
          {c.browse}
        </Link>
      </div>
    </main>
  )
}
