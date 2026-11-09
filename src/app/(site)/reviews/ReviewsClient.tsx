'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n/context'
import BrandSymbol from '@/components/ui/BrandSymbol'
import type { DbTestimonial } from '@/lib/supabase'

export default function ReviewsClient({ testimonials }: { testimonials: DbTestimonial[] }) {
  const { t } = useLang()
  const tr = t.testimonials

  return (
    <main className="pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-[11px] tracking-[0.3em] uppercase text-teal mb-3">{tr.sectionTitle}</p>
          <h1 className="text-4xl font-semibold text-ink mb-5">
            {testimonials.length > 0
              ? `${testimonials.length} ${testimonials.length === 1 ? 'review' : 'reviews'}`
              : 'Reviews'}
          </h1>
          <p className="text-[14px] text-stone leading-relaxed">
            Every piece leaves our hands and enters someone&apos;s home. Here&apos;s what they say.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="border border-stone-light py-20 text-center">
            <BrandSymbol size={24} className="mx-auto text-teal/30 mb-4" />
            <p className="text-[13px] text-stone">No reviews yet — be the first.</p>
            <Link
              href="/review"
              className="inline-block mt-5 text-[11px] tracking-[0.2em] uppercase text-teal border border-teal px-6 py-3 hover:bg-teal hover:text-white transition-colors"
            >
              {tr.ctaButton}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map(item => (
                <div key={item.id} className="flex flex-col gap-4 p-7 bg-linen">
                  <BrandSymbol size={14} className="text-teal/40" />
                  <p className="text-[15px] leading-relaxed text-ink italic flex-1">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-stone-light/60">
                    <p className="text-[12px] font-medium text-ink">{item.name}</p>
                    {item.location && (
                      <p className="text-[11px] text-stone mt-0.5">{item.location}</p>
                    )}
                    {item.product_name && (
                      <p className="text-[11px] text-teal mt-1.5 tracking-wide">✦ {item.product_name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Leave a review CTA */}
            <div className="mt-20 border-t border-stone-light pt-12 flex flex-col md:flex-row items-start gap-8 justify-between">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-teal mb-2">{tr.ctaTitle}</p>
                <p className="text-[14px] text-stone leading-relaxed max-w-sm">{tr.ctaSub}</p>
              </div>
              <Link
                href="/review"
                className="shrink-0 inline-block text-[11px] tracking-[0.2em] uppercase bg-teal text-white px-8 py-4 hover:bg-teal-dark transition-colors"
              >
                {tr.ctaButton}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
