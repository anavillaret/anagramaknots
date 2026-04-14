'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'
import Watermark from '@/components/ui/Watermark'

type Event = {
  id: string
  title: string
  title_pt: string
  date: string
  place: string
  description: string
  description_pt: string
  photos: string[]
}

type Lightbox = { photos: string[]; index: number } | null

function formatDate(dateStr: string, lang: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(
    lang === 'pt' ? 'pt-PT' : 'en-GB',
    { month: 'long', year: 'numeric' }
  )
}

export default function EventsSection() {
  const { t, lang } = useLang()
  const e = t.events
  const [events, setEvents] = useState<Event[]>([])
  const [loaded, setLoaded] = useState(false)
  const [lightbox, setLightbox] = useState<Lightbox>(null)

  useEffect(() => {
    fetch(`/api/events?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { setEvents(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const openLightbox = (photos: string[], index: number) => setLightbox({ photos, index })
  const closeLightbox = () => setLightbox(null)

  const prev = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.photos.length) % lightbox.photos.length })
  }, [lightbox])

  const next = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.photos.length })
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

  if (!loaded || events.length === 0) return null

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-3">{e.eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">{e.heading}</h2>
          <p className="mt-4 text-[15px] text-stone leading-relaxed">{e.sub}</p>
        </div>

        {/* Events */}
        <div className="space-y-20">
          {events.map((event, i) => {
            const reverse = i % 2 === 1
            const allPhotos = event.photos ?? []
            const mainPhoto = allPhotos[0]
            const extraPhotos = allPhotos.slice(1)

            return (
              <article
                key={event.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                {/* Photo side */}
                <div>
                  {mainPhoto ? (
                    <button
                      onClick={() => openLightbox(allPhotos, 0)}
                      className="relative aspect-[4/3] overflow-hidden bg-linen w-full block cursor-zoom-in"
                    >
                      <Image
                        src={mainPhoto}
                        alt={event.title}
                        fill
                        className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <Watermark />
                    </button>
                  ) : (
                    <div className="aspect-[4/3] bg-linen flex items-center justify-center">
                      <span className="text-stone text-[13px] tracking-wide">No photo</span>
                    </div>
                  )}

                  {/* Thumbnails */}
                  {extraPhotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {extraPhotos.slice(0, 4).map((url, j) => (
                        <button
                          key={j}
                          onClick={() => openLightbox(allPhotos, j + 1)}
                          className="relative aspect-square overflow-hidden bg-linen cursor-zoom-in"
                        >
                          <Image
                            src={url}
                            alt={`${event.title} ${j + 2}`}
                            fill
                            className="object-cover object-top hover:scale-[1.05] transition-transform duration-300"
                            sizes="15vw"
                          />
                          <Watermark />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text side */}
                <div className={`flex flex-col justify-center ${reverse ? 'md:order-1' : ''}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-teal font-medium">
                      {formatDate(event.date, lang)}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight leading-tight mb-3">
                    {lang === 'pt' && event.title_pt ? event.title_pt : event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-stone mb-5">
                    <MapPin size={13} strokeWidth={1.5} />
                    <span className="text-[13px]">{event.place}</span>
                  </div>
                  {event.description && (
                    <p className="text-[14px] leading-relaxed text-stone whitespace-pre-line">
                      {lang === 'pt' && event.description_pt ? event.description_pt : event.description}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X size={28} />
          </button>

          {/* Prev */}
          {lightbox.photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/80 hover:text-white p-2"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox.photos[lightbox.index]}
              alt=""
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <Watermark />
          </div>

          {/* Next */}
          {lightbox.photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white/80 hover:text-white p-2"
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Dots */}
          {lightbox.photos.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {lightbox.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightbox({ ...lightbox, index: i }) }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightbox.index ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
