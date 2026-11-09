'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLang } from '@/lib/i18n/context'
import BrandSymbol from '@/components/ui/BrandSymbol'

type Testimonial = {
  id: string
  name: string
  location: string | null
  text: string
  product_name: string | null
  media_urls: string[]
}

export default function TestimonialsDisplay() {
  const { t } = useLang()
  const tr = t.testimonials
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <div className="mt-20 border-t border-stone-light pt-12">
      <p className="text-[11px] tracking-[0.3em] uppercase text-teal mb-8">{tr.sectionTitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.slice(0, 6).map(item => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const photos = item.media_urls ?? []

  return (
    <>
      <div className="flex flex-col gap-3 p-6 bg-linen">
        {/* Photos */}
        {photos.length > 0 && (
          <div className="flex gap-1.5 mb-1">
            {photos.slice(0, 3).map((url, i) => (
              <button
                key={i}
                onClick={() => setLightbox(url)}
                className="relative overflow-hidden bg-white cursor-zoom-in"
                style={{ width: photos.length === 1 ? '100%' : '33.33%', aspectRatio: '1' }}
              >
                <Image src={url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="120px" />
              </button>
            ))}
          </div>
        )}

        <BrandSymbol size={14} className="text-teal/40" />
        <p className="text-[14px] leading-relaxed text-ink italic">"{item.text}"</p>
        <div className="mt-auto pt-3 border-t border-stone-light/50">
          <p className="text-[11px] font-medium text-ink">{item.name}</p>
          {item.location && <p className="text-[10px] text-stone mt-0.5">{item.location}</p>}
          {item.product_name && <p className="text-[10px] text-teal mt-0.5 tracking-wide">✦ {item.product_name}</p>}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] w-full h-full">
            <Image src={lightbox} alt="" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  )
}
