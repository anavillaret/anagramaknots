'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Watermark from '@/components/ui/Watermark'
import Eyebrow from '@/components/ui/Eyebrow'
import { useLang } from '@/lib/i18n/context'
import { mergeContent } from '@/lib/mergeContent'

const PHOTOS = [
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190677242-img_8751.jpg', alt: 'Crochet heart' },
  { src: '/images/process-2.jpeg', alt: 'Ana at work' },
  { src: '/images/process-3.jpeg', alt: 'Green animals' },
]

type Lightbox = { index: number } | null

export default function StoryTeaser() {
  const { t, lang } = useLang()
  const [s, setS] = useState(t.home.story)
  const [lightbox, setLightbox] = useState<Lightbox>(null)

  useEffect(() => {
    fetch('/api/admin/content/page_home')
      .then(r => r.json())
      .then(d => {
        const langContent = d.content?.[lang] as Record<string, unknown> | undefined
        const homeContent = langContent?.home as Record<string, unknown> | undefined
        if (homeContent?.story && typeof homeContent.story === 'object') {
          setS(mergeContent(t.home.story, homeContent.story as Record<string, unknown>))
        } else {
          setS(t.home.story)
        }
      })
      .catch(() => setS(t.home.story))
  }, [lang, t.home.story])

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

          {/* Image collage — tall left + two stacked right */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setLightbox({ index: 0 })} className="relative aspect-[3/4] overflow-hidden cursor-zoom-in">
              <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill className="object-cover hover:scale-[1.03] transition-transform duration-500" sizes="25vw" />
              <Watermark />
            </button>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={() => setLightbox({ index: 1 })} className="relative aspect-square overflow-hidden cursor-zoom-in">
                <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill className="object-cover hover:scale-[1.03] transition-transform duration-500" sizes="25vw" />
                <Watermark />
              </button>
              <button onClick={() => setLightbox({ index: 2 })} className="relative aspect-[4/3] overflow-hidden cursor-zoom-in">
                <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill className="object-cover hover:scale-[1.03] transition-transform duration-500" sizes="25vw" />
                <Watermark />
              </button>
            </div>
          </div>

          {/* Text */}
          <div className="md:pl-8 lg:pl-16">
            <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-5">{s.eyebrow}</Eyebrow>
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
