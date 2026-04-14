'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'
import type { Product } from '@/lib/products'

const INTERVAL = 6000

type Slide = {
  image: string
  alt: string
  href: string
  label: string
  heading: [string, string]
  sub: string
  cta: string
  secondary: string
}

// Infer the Portuguese article from the first word of the PT name:
// words ending in 'a' are feminine ("a"), everything else masculine ("o").
// Covers all common animal names: Alpaca→a, Cacatua→a, Cobra→a, Urso→o, Pinguim→o, Flamingo→o…
function ptArticle(name: string): string {
  return name.split(' ')[0].toLowerCase().endsWith('a') ? 'a' : 'o'
}

export default function Hero({ heroProducts }: { heroProducts?: Product[] }) {
  const { t, lang } = useLang()

  // Headings stay curated (from translations). Label, description and CTA come from the product.
  const slides: Slide[] = t.hero.slides.map((text, i) => {
    const product = heroProducts?.[i]
    const fact = lang === 'pt' && product?.factPt ? product.factPt : product?.fact
    const displayName = product ? (lang === 'pt' && product.namePt ? product.namePt : product.name) : null
    const article = displayName ? ptArticle(displayName) : 'o'
    const cta = product
      ? product.badge === 'soldout'
        ? lang === 'pt' ? `Conhece ${article} ${displayName}` : `Meet the ${product.name}`
        : lang === 'pt' ? `Conhece ${article} ${displayName} — €${product.price}` : `Meet the ${product.name} — €${product.price}`
      : text.cta
    return {
      image: product?.image ?? '/images/hero.jpeg',
      alt: product ? `${product.name} amigurumi` : 'Anagrama amigurumi',
      href: product ? `/products/${product.slug}` : '/products',
      label: product?.species || text.label,
      heading: text.heading as [string, string],
      sub: fact ?? text.sub,
      cta,
      secondary: text.secondary,
    }
  })

  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setFading(false)
      }, 400)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [slides.length])

  const goTo = (index: number) => {
    if (index === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 400)
  }

  const slide = slides[current] ?? slides[0]

  return (
    <section className="pt-16 lg:h-screen lg:flex lg:flex-col">
      <div className="lg:flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* Image */}
        <div
          className="relative overflow-hidden order-1 lg:order-2 aspect-[4/5] md:aspect-auto md:h-[55vw] lg:h-full lg:aspect-auto"
          style={{ backgroundColor: '#F7E7DD' }}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={current === 0}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
          <Watermark />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-0 bg-white order-2 lg:order-1">
          <div
            className="max-w-md transition-opacity duration-400"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <p className="text-[13px] lg:text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-4 lg:mb-6">
              {slide.label}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-ink leading-[1.1] tracking-tight">
              {slide.heading[0]}<br />
              <em className="font-normal not-italic text-teal">{slide.heading[1]}</em>
            </h1>
            <p className="mt-4 lg:mt-6 text-[13px] md:text-[14px] leading-relaxed text-stone max-w-sm">
              {slide.sub}
            </p>
            <div className="mt-6 lg:mt-10 flex flex-wrap items-center gap-4 lg:gap-5">
              <Link
                href={slide.href}
                className="inline-flex items-center bg-teal text-white text-[10px] lg:text-[11px] tracking-[0.2em] uppercase px-6 lg:px-8 py-3 lg:py-3.5 hover:bg-teal-dark transition-colors duration-200"
              >
                {slide.cta}
              </Link>
              <Link
                href="/story"
                className="text-[10px] lg:text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
              >
                {slide.secondary}
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="mt-6 lg:mt-10 flex items-center gap-2">
              {slides.map((_, i) => (
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
