'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Eyebrow from '@/components/ui/Eyebrow'
import { useLang } from '@/lib/i18n/context'
import { mergeContent } from '@/lib/mergeContent'

export default function MadeForYouTeaser() {
  const { t, lang } = useLang()
  const [c, setC] = useState(t.home.commission)

  useEffect(() => {
    fetch('/api/admin/content/page_home')
      .then(r => r.json())
      .then(d => {
        const langContent = d.content?.[lang] as Record<string, unknown> | undefined
        const homeContent = langContent?.home as Record<string, unknown> | undefined
        if (homeContent?.commission && typeof homeContent.commission === 'object') {
          setC(mergeContent(t.home.commission, homeContent.commission as Record<string, unknown>))
        } else {
          setC(t.home.commission)
        }
      })
      .catch(() => setC(t.home.commission))
  }, [lang, t.home.commission])

  return (
    <section className="bg-ink py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="max-w-lg">
          <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal-bright mb-5">
            {c.eyebrow}
          </Eyebrow>
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight text-balance">
            {c.heading[0]}<br />
            <em className="font-normal not-italic text-teal-bright">{c.heading[1]}</em>
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
