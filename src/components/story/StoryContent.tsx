'use client'

import Image from 'next/image'
import Link from 'next/link'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'

export default function StoryContent() {
  const { t } = useLang()
  const s = t.story

  return (
    <main className="pt-32 pb-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{s.eyebrow}</p>
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

          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/process-1.jpeg"
              alt="Ana crocheting"
              fill
              className="object-cover"
              priority
            />
            <Watermark />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-linen py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="grid grid-cols-2 gap-3 order-2 md:order-1">
              <div className="relative aspect-square overflow-hidden mt-8">
                <Image src="/images/process-2.jpeg" alt="Ana at work" fill className="object-cover" />
                <Watermark />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="/images/process-3.jpeg" alt="Yarn and hooks" fill className="object-cover" />
                <Watermark />
              </div>
            </div>

            <div className="order-1 md:order-2 md:pl-8">
              <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{s.missionEyebrow}</p>
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

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{s.processEyebrow}</p>
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

      {/* CTA */}
      <section className="bg-ink py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-4">{s.ctaEyebrow}</p>
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
  )
}
