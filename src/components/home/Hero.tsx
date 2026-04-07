'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'

const SLIDE_META = [
  { image: '/images/hero.jpeg', alt: 'Anagrama teal bird amigurumi', href: '/products' },
  { image: '/images/cockatoo.jpeg', alt: 'Cockatoo amigurumi', href: '/products/cockatoo' },
  { image: '/images/penguin.jpeg', alt: 'Penguin amigurumi', href: '/products/penguin' },
]

const INTERVAL = 6000

export default function Hero() {
  const { t } = useLang()
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDE_META.length)
        setFading(false)
      }, 400)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    if (index === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 400)
  }

  const slideMeta = SLIDE_META[current]
  const slide = t.hero.slides[current]

  return (
    <section className="pt-16 md:h-screen md:flex md:flex-col">
      <div className="md:flex-1 grid grid-cols-1 md:grid-cols-2">

        {/* Image — top on mobile, right on desktop */}
        <div
          className="relative overflow-hidden order-1 md:order-2 h-[70vw] md:h-full"
          style={{ backgroundColor: '#e6f3f3' }}
        >
          <Image
            src={slideMeta.image}
            alt={slideMeta.alt}
            fill
            className="object-cover object-center"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}
            priority={current === 0}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
          <Watermark />
        </div>

        {/* Text — bottom on mobile, left on desktop */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-10 md:py-0 bg-white order-2 md:order-1">
          <div
            className="max-w-md transition-opacity duration-400"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <p className="text-[13px] md:text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-4 md:mb-6">
              {slide.label}
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-ink leading-[1.1] tracking-tight">
              {slide.heading[0]}<br />
              <em className="font-normal not-italic text-teal">{slide.heading[1]}</em>
            </h1>
            <p className="mt-4 md:mt-6 text-[13px] md:text-[14px] leading-relaxed text-stone max-w-sm">
              {slide.sub}
            </p>
            <div className="mt-6 md:mt-10 flex flex-wrap items-center gap-4 md:gap-5">
              <Link
                href={slideMeta.href}
                className="inline-flex items-center bg-teal text-white text-[10px] md:text-[11px] tracking-[0.2em] uppercase px-6 md:px-8 py-3 md:py-3.5 hover:bg-teal-dark transition-colors duration-200"
              >
                {slide.cta}
              </Link>
              <Link
                href="/story"
                className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
              >
                {slide.secondary}
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="mt-6 md:mt-10 flex items-center gap-2">
              {SLIDE_META.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-6 h-1.5 bg-teal'
                      : 'w-1.5 h-1.5 bg-stone-light hover:bg-stone'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
