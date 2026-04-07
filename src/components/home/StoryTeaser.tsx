'use client'

import Link from 'next/link'
import Image from 'next/image'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'

export default function StoryTeaser() {
  const { t } = useLang()
  const s = t.home.story

  return (
    <section className="bg-linen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/process-1.jpeg" alt="Crochet in progress" fill className="object-cover" />
              <Watermark />
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <div className="relative aspect-square overflow-hidden">
                <Image src="/images/process-2.jpeg" alt="Ana at work" fill className="object-cover" />
                <Watermark />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/process-3.jpeg" alt="Yarn and materials" fill className="object-cover" />
                <Watermark />
              </div>
            </div>
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
  )
}
