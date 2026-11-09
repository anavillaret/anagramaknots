'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BrandSymbol from '@/components/ui/BrandSymbol'
import type { DbTestimonial } from '@/lib/supabase'

export default function TestimonialsCarousel({ testimonials }: { testimonials: DbTestimonial[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + testimonials.length) % testimonials.length), [testimonials.length])

  const next = useCallback(() =>
    setCurrent(c => (c + 1) % testimonials.length), [testimonials.length])

  useEffect(() => {
    if (paused || testimonials.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next, testimonials.length])

  const item = testimonials[current]
  const photos = item.media_urls ?? []

  return (
    <section
      className="py-20 bg-linen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-teal mb-2">Customer Reviews</p>
            <h2 className="text-2xl font-semibold text-ink">What our customers say</h2>
          </div>
          <Link
            href="/reviews"
            className="hidden md:block text-[10px] tracking-[0.2em] uppercase text-teal border-b border-teal/40 hover:border-teal pb-0.5 transition-colors"
          >
            See all reviews →
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="bg-white p-8 md:p-12 min-h-[220px] flex flex-col md:flex-row gap-8 items-center">

            {/* Photos */}
            {photos.length > 0 && (
              <div className={`shrink-0 grid gap-1.5 w-full md:w-auto ${
                photos.length === 1 ? 'grid-cols-1 md:w-48' :
                photos.length === 2 ? 'grid-cols-2 md:w-64' :
                'grid-cols-3 md:w-72'
              }`}>
                {photos.slice(0, 3).map((url, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden">
                    <Image src={url} alt="" fill className="object-cover" sizes="150px" />
                  </div>
                ))}
              </div>
            )}

            {/* Text */}
            <div className="flex flex-col gap-4 flex-1">
              <BrandSymbol size={16} className="text-teal/40" />
              <p className="text-[16px] md:text-[18px] leading-relaxed text-ink italic">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="mt-auto pt-4 border-t border-stone-light">
                <p className="text-[12px] font-medium text-ink">{item.name}</p>
                {item.location && <p className="text-[11px] text-stone mt-0.5">{item.location}</p>}
                {item.product_name && <p className="text-[11px] text-teal mt-1 tracking-wide">✦ {item.product_name}</p>}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-stone-light w-9 h-9 flex items-center justify-center text-stone hover:text-ink hover:border-ink transition-colors shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-stone-light w-9 h-9 flex items-center justify-center text-stone hover:text-ink hover:border-ink transition-colors shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-teal' : 'bg-teal/25'}`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/reviews" className="text-[10px] tracking-[0.2em] uppercase text-teal border-b border-teal/40 pb-0.5">
            See all reviews →
          </Link>
        </div>

      </div>
    </section>
  )
}
