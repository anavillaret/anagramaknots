'use client'

import ContactForm from '@/components/contact/ContactForm'
import { useLang } from '@/lib/i18n/context'

export default function ContactPageContent() {
  const { t } = useLang()
  const c = t.contact

  return (
    <main className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — info */}
          <div className="flex flex-col justify-center">
            <p className="text-[15px] tracking-[0.3em] uppercase font-bold text-teal mb-6">{c.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-[1.1] tracking-tight">
              {c.heading[0]}<br />
              <em className="font-normal not-italic text-teal">{c.heading[1]}</em>
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-stone max-w-sm">
              {c.sub}
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone mb-1">{c.emailLabel}</p>
                <a
                  href="mailto:hello@anagramaknots.com"
                  className="text-[14px] text-ink hover:text-teal transition-colors border-b border-ink/20 pb-0.5"
                >
                  hello@anagramaknots.com
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone mb-1">{c.instagramLabel}</p>
                <a
                  href="https://www.instagram.com/anagrama_knots/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-ink hover:text-teal transition-colors border-b border-ink/20 pb-0.5"
                >
                  @anagrama_knots
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-stone mb-1">{c.basedLabel}</p>
                <p className="text-[14px] text-ink">Portugal 🇵🇹</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  )
}
