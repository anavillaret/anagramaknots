'use client'

import Link from 'next/link'
import Eyebrow from '@/components/ui/Eyebrow'
import { useLang } from '@/lib/i18n/context'

export default function ShippingContent() {
  const { t } = useLang()
  const s = t.shipping

  return (
    <main className="pt-32 pb-24">

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 mb-20 text-center">
        <Eyebrow className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6 justify-center">{s.eyebrow}</Eyebrow>
        <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-[1.1] tracking-tight">
          {s.heading[0]}<br />
          <em className="font-normal not-italic text-teal">{s.heading[1]}</em>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-stone max-w-lg mx-auto">
          {s.sub}
        </p>
      </section>

      {/* Packaging callout */}
      <section className="bg-linen py-16 mb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {s.features.map(item => (
              <div key={item.title}>
                <span className="text-teal text-xl">✦</span>
                <h3 className="mt-3 text-[13px] tracking-[0.15em] uppercase font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-[14px] leading-relaxed text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery times table */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-semibold text-ink mb-8 tracking-tight">{s.tableHeading}</h2>
        <div className="border border-stone-light divide-y divide-stone-light">
          <div className="grid grid-cols-2 px-6 py-3 bg-linen">
            <span className="text-[11px] tracking-[0.15em] uppercase text-stone font-medium">{s.colRegion}</span>
            <span className="text-[11px] tracking-[0.15em] uppercase text-stone font-medium">{s.colDelivery}</span>
          </div>
          {s.rows.map(r => (
            <div key={r.region} className="grid grid-cols-2 px-6 py-4">
              <span className="text-[14px] font-medium text-ink">{r.region}</span>
              <span className="text-[14px] text-stone">{r.delivery}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-stone">
          {s.disclaimer}
        </p>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-semibold text-ink mb-8 tracking-tight">{s.faqHeading}</h2>
        <div className="flex flex-col divide-y divide-stone-light">
          {s.faqs.map(faq => (
            <div key={faq.q} className="py-6">
              <h3 className="text-[14px] font-semibold text-ink mb-2">{faq.q}</h3>
              <p className="text-[14px] leading-relaxed text-stone">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-[14px] text-stone mb-4">{s.stillQuestions}</p>
        <Link
          href="/contact"
          className="inline-flex items-center bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors"
        >
          {s.contactCta}
        </Link>
      </section>

    </main>
  )
}
