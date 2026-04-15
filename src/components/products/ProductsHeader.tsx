'use client'

import Eyebrow from '@/components/ui/Eyebrow'
import { useLang } from '@/lib/i18n/context'

export default function ProductsHeader() {
  const { t } = useLang()
  const p = t.products

  return (
    <>
      <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-3">{p.eyebrow}</Eyebrow>
      <h1 className="text-4xl font-semibold text-ink tracking-tight">{p.heading}</h1>
      <p className="mt-3 text-[14px] text-stone max-w-lg leading-relaxed">{p.sub}</p>
    </>
  )
}
