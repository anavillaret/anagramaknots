'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

type Event = {
  id: string
  title: string
  date: string
  place: string
  description: string
  photos: string[]
}

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

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => { setEvents(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  if (!loaded || events.length === 0) return null

  return (
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
          const mainPhoto = event.photos?.[0]
          const extraPhotos = event.photos?.slice(1) ?? []

          return (
            <article
              key={event.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Photo side */}
              <div>
                {mainPhoto ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-linen">
                    <Image
                      src={mainPhoto}
                      alt={event.title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-linen flex items-center justify-center">
                    <span className="text-stone text-[13px] tracking-wide">No photo</span>
                  </div>
                )}

                {/* Extra photos */}
                {extraPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {extraPhotos.slice(0, 4).map((url, j) => (
                      <div key={j} className="relative aspect-square overflow-hidden bg-linen">
                        <Image
                          src={url}
                          alt={`${event.title} ${j + 2}`}
                          fill
                          className="object-cover object-top"
                          sizes="15vw"
                        />
                      </div>
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
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 text-stone mb-5">
                  <MapPin size={13} strokeWidth={1.5} />
                  <span className="text-[13px]">{event.place}</span>
                </div>
                {event.description && (
                  <p className="text-[14px] leading-relaxed text-stone whitespace-pre-line">
                    {event.description}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
