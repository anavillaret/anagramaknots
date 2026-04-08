'use client'

import { useLang } from '@/lib/i18n/context'

export default function InstagramStrip() {
  const { t } = useLang()

  return (
    <section className="py-16 px-6 text-center">
      <p className="text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
        {t.home.instagram.eyebrow}
      </p>
      <a
        href="https://www.instagram.com/anagrama_knots/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] tracking-wide text-ink hover:text-teal transition-colors border-b border-ink/20 pb-0.5"
      >
        @anagrama_knots
      </a>
    </section>
  )
}
