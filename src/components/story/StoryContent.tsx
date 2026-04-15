'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Watermark from '@/components/ui/Watermark'
import Eyebrow from '@/components/ui/Eyebrow'
import { useLang } from '@/lib/i18n/context'
import EventsSection from '@/components/story/EventsSection'

const PHOTOS = [
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190677242-img_8751.jpg', alt: 'Crochet heart' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776190678839-img_8562.jpg', alt: 'Crochet square' },
  { src: '/images/process-3.jpeg', alt: 'Green animals' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191359279-img_6360.jpg', alt: 'Crochet granny squares in progress' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191361270-img_0356.jpg', alt: 'Yarn and granny squares' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191363725-img_7408.jpg', alt: 'Crocheting in progress' },
  { src: 'https://mkfaebmekhaqwrlcvtte.supabase.co/storage/v1/object/public/products/1776191365240-img_8400.jpg', alt: 'Crochet bookmarks' },
]

type Lightbox = { index: number } | null

function PhotoCarousel({
  photos,
  lightboxOffset,
  onOpen,
}: {
  photos: { src: string; alt: string }[]
  lightboxOffset: number[]
  onOpen: (lb: { index: number }) => void
}) {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((dir: number) => {
    setActive(a => (a + dir + photos.length) % photos.length)
  }, [photos.length])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(a => (a + 1) % photos.length), 4000)
  }, [photos.length])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  // Indices of the 3 visible slots: prev, active, next
  const indices = [
    (active - 1 + photos.length) % photos.length,
    active,
    (active + 1) % photos.length,
  ]

  return (
    <section className="py-16 overflow-hidden">
      <div className="relative flex items-center justify-center gap-4 px-16">

        {/* Prev arrow */}
        <button
          onClick={() => { go(-1); resetTimer() }}
          className="absolute left-4 z-10 p-2 text-stone hover:text-ink transition-colors"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>

        {/* 3 photos: side · center · side */}
        {indices.map((photoIdx, slot) => {
          const isCenter = slot === 1
          return (
            <button
              key={slot}
              onClick={() => {
                if (isCenter) {
                  onOpen({ index: lightboxOffset[photoIdx] })
                } else {
                  go(slot === 0 ? -1 : 1)
                  resetTimer()
                }
              }}
              className={`relative overflow-hidden shrink-0 transition-all duration-500 ${
                isCenter
                  ? 'w-[600px] aspect-[4/3] cursor-zoom-in opacity-100 scale-100'
                  : 'w-[360px] aspect-[4/3] cursor-pointer opacity-50 scale-95 hover:opacity-70'
              }`}
            >
              <Image
                src={photos[photoIdx].src}
                alt={photos[photoIdx].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 420px"
              />
              {isCenter && <Watermark />}
            </button>
          )
        })}

        {/* Next arrow */}
        <button
          onClick={() => { go(1); resetTimer() }}
          className="absolute right-4 z-10 p-2 text-stone hover:text-ink transition-colors"
        >
          <ChevronRight size={32} strokeWidth={1.5} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetTimer() }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'bg-teal w-4' : 'bg-stone-light hover:bg-stone'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default function StoryContent() {
  const { t } = useLang()
  const s = t.story
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
    <main className="pt-32 pb-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <Eyebrow className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{s.eyebrow}</Eyebrow>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-ink leading-[1.1] tracking-tight">
              {s.heading[0]}<br />
              <em className="font-normal not-italic text-teal">{s.heading[1]}</em>
            </h1>
            <p className="mt-8 text-[15px] leading-relaxed text-stone max-w-md">
              {s.p1}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-stone max-w-md">
              {s.p2}
            </p>
          </div>

          <button
            onClick={() => setLightbox({ index: 0 })}
            className="relative aspect-[3/4] overflow-hidden w-full cursor-zoom-in"
          >
            <Image
              src={PHOTOS[0].src}
              alt={PHOTOS[0].alt}
              fill
              className="object-cover object-center hover:scale-[1.02] transition-transform duration-500"
              priority
            />
            <Watermark />
          </button>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-linen py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

            <button
              onClick={() => setLightbox({ index: 2 })}
              className="relative aspect-[3/4] overflow-hidden order-2 md:order-1 cursor-zoom-in w-full"
            >
              <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill className="object-cover hover:scale-[1.03] transition-transform duration-500" />
              <Watermark />
            </button>

            <div className="order-1 md:order-2 md:pl-8">
              <Eyebrow className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{s.missionEyebrow}</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-semibold text-ink leading-tight tracking-tight">
                {s.missionHeading[0]}<br />
                <em className="font-normal not-italic text-teal">{s.missionHeading[1]}</em>
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-stone">
                {s.missionP1}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-stone">
                {s.missionP2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo carousel */}
      <PhotoCarousel photos={[PHOTOS[1], ...PHOTOS.slice(3)]} lightboxOffset={[1,3,4,5,6]} onOpen={setLightbox} />

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Eyebrow className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6 justify-center">{s.processEyebrow}</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink leading-tight tracking-tight">
            {s.processHeading[0]}<br />
            <em className="font-normal not-italic text-teal">{s.processHeading[1]}</em>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-stone">
            {s.processSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {s.steps.map(step => (
            <div key={step.number} className="flex flex-col items-center">
              <span className="text-[40px] font-semibold text-teal/30 leading-none mb-4">{step.number}</span>
              <h3 className="text-[13px] tracking-[0.2em] uppercase font-semibold text-ink mb-3">{step.title}</h3>
              <p className="text-[14px] leading-relaxed text-stone max-w-xs">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events & Workshops */}
      <EventsSection />

      {/* CTA */}
      <section className="bg-ink py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <Eyebrow className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-4">{s.ctaEyebrow}</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
              {s.ctaHeading[0]}<br />
              <em className="font-normal not-italic text-teal">{s.ctaHeading[1]}</em>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-4 hover:bg-teal-dark transition-colors duration-200"
            >
              {s.ctaButton}
            </Link>
            <Link
              href="/commission"
              className="text-[11px] tracking-[0.15em] uppercase text-stone-light hover:text-white transition-colors border-b border-stone pb-0.5"
            >
              {s.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

    </main>

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
