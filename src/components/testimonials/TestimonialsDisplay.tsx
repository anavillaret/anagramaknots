'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n/context'
import BrandSymbol from '@/components/ui/BrandSymbol'

type Testimonial = {
  id: string
  name: string
  location: string | null
  text: string
  product_name: string | null
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
          <div key={item.id} className="flex flex-col gap-3 p-6 bg-linen">
            <BrandSymbol size={14} className="text-teal/40" />
            <p className="text-[14px] leading-relaxed text-ink italic">"{item.text}"</p>
            <div className="mt-auto pt-3 border-t border-stone-light/50">
              <p className="text-[11px] font-medium text-ink">{item.name}</p>
              {item.location && (
                <p className="text-[10px] text-stone mt-0.5">{item.location}</p>
              )}
              {item.product_name && (
                <p className="text-[10px] text-teal mt-0.5 tracking-wide">✦ {item.product_name}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
