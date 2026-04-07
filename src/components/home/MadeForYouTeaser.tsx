'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n/context'

export default function MadeForYouTeaser() {
  const { t } = useLang()
  const c = t.home.commission

  return (
    <section className="bg-ink py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="max-w-lg">
          <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-5">
            {c.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight text-balance">
            {c.heading[0]}<br />
            <em className="font-normal not-italic text-teal">{c.heading[1]}</em>
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-stone-light">
            {c.sub}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
          <Link
            href="/commission"
            className="inline-flex items-center bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-4 hover:bg-teal-dark transition-colors duration-200"
          >
            {c.cta}
          </Link>
        </div>

      </div>
    </section>
  )
}
