'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'

const PHOTOS = [
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190677242-img_8751.jpg', alt: 'Crochet heart' },
  { src: '/images/process-2.jpeg', alt: 'Ana at work' },
  { src: '/images/process-3.jpeg', alt: 'Green animals' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190678839-img_8562.jpg', alt: 'Crochet square' },
]

type Lightbox = { index: number } | null

export default function StoryTeaser() {
  const { t } = useLang()
  const s = t.home.story
  const [lightbox, setLightbox] = useState<Lightbox>(null)

  const prev = useCallback(() => {
    if (!lightbox) return
    setLightbox({ index: (lightbox.index - 1 + PHOTOS.length) % PHOTOS.length })
  }, [lightbox])

  const next = useCallback(() => {
    if (!lightbox) return
    setLightbox({ index: (lightbox.index + 1) % PHOTOS.length })
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

  return (
    <>
    <section className="bg-linen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Image collage — 2×2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {PHOTOS.map((photo, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ index: i })}
                className="relative overflow-hidden cursor-zoom-in"
                style={{ aspectRatio: i === 0 ? '3/4' : i === 1 ? '1/1' : i === 2 ? '4/3' : '1/1' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <Watermark />
              </button>
            ))}
          </div>

          {/* Text */}
          <div className="md:pl-8 lg:pl-16">
            <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-5">{s.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink leading-tight tracking-tight text-balance">
              {s.heading[0]}<br />
              <em className="font-normal not-italic text-teal">{s.heading[1]}</em>
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-stone">{s.sub}</p>
            <Link
              href="/story"
              className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.2em] uppercase text-ink border-b border-ink pb-0.5 hover:text-teal hover:border-teal transition-colors"
            >
              {s.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Lightbox */}
    {lightbox && (
      <div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={() => setLightbox(null)}
      >
        <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/80 hover:text-white p-2">
          <X size={28} />
        </button>

        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 text-white/80 hover:text-white p-2"
        >
          <ChevronLeft size={36} />
        </button>

        <div
          className="relative w-full h-full max-w-4xl max-h-[90vh] mx-16"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={PHOTOS[lightbox.index].src}
            alt={PHOTOS[lightbox.index].alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
          <Watermark />
        </div>

        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 text-white/80 hover:text-white p-2"
        >
          <ChevronRight size={36} />
        </button>

        <div className="absolute bottom-4 flex gap-2">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setLightbox({ index: i }) }}
              className={`w-2 h-2 rounded-full transition-colors ${i === lightbox.index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    )}
    </>
  )
}
