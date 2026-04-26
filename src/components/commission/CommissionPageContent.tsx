'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Mail, MessageCircle, CreditCard, Wand2 } from 'lucide-react'
import CommissionForm from './CommissionForm'
import BrandSymbol from '@/components/ui/BrandSymbol'
import Eyebrow from '@/components/ui/Eyebrow'
import { useLang } from '@/lib/i18n/context'
import { mergeContent } from '@/lib/mergeContent'
import type { Product } from '@/lib/products'

// One icon per step — themed around craft, nature and making
const STEP_ICONS = [
  <Mail size={15} strokeWidth={1.5} />,          // 01 · Send your request — envelope
  <MessageCircle size={15} strokeWidth={1.5} />, // 02 · Ana reviews & replies
  <CreditCard size={15} strokeWidth={1.5} />,    // 03 · Confirm & pay
  <Wand2 size={15} strokeWidth={1.5} />,         // 04 · She brings it to life — wand ≈ crochet needle
]

export default function CommissionPageContent({ availableProducts }: { availableProducts: Product[] }) {
  const { t, lang } = useLang()
  const [c, setC] = useState(t.commission)

  useEffect(() => {
    fetch('/api/admin/content/page_commission')
      .then(r => r.json())
      .then(d => {
        const langContent = d.content?.[lang] as Record<string, unknown> | undefined
        if (langContent?.commission && typeof langContent.commission === 'object') {
          setC(mergeContent(t.commission, langContent.commission as Record<string, unknown>))
        } else {
          setC(t.commission)
        }
      })
      .catch(() => setC(t.commission))
  }, [lang, t.commission])

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-4">{c.eyebrow}</Eyebrow>
        <h1 className="text-4xl font-semibold text-ink tracking-tight leading-tight">
          {c.heading[0]}<br />
          <em className="font-normal not-italic text-teal">{c.heading[1]}</em>
        </h1>
        <p className="mt-5 text-[14px] leading-relaxed text-stone max-w-md">{c.sub}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-stone max-w-md">
          {c.sub2} <strong className="text-ink font-medium">{c.sub2Bold}</strong> {c.sub2Suffix}
        </p>

        {/* How it works */}
        <div className="mt-10">
          <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-medium mb-5">{c.howTitle}</p>
          <div className="grid grid-cols-2 gap-4">
            {c.steps.map((step, i) => (
              <div key={step.n} className="border border-stone-light p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-teal/60">{step.n}</span>
                  <span className="text-teal/40">{STEP_ICONS[i]}</span>
                </div>
                <p className="text-[13px] font-medium text-ink leading-snug">{step.title}</p>
                <p className="mt-1.5 text-[12px] text-stone leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-stone-light pt-10">
          <CommissionForm />
        </div>
      </div>

      {/* Available now upsell */}
      {availableProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-16 border-t border-stone-light">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-2">{c.upsellEyebrow}</Eyebrow>
              <h2 className="text-2xl font-semibold text-ink tracking-tight">{c.upsellHeading}</h2>
              <p className="mt-2 text-[13px] text-stone max-w-sm leading-relaxed">{c.upsellSub}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {availableProducts.map(product => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="mt-2.5 flex items-start justify-between gap-2">
                  <p className="text-[12px] font-medium text-teal flex items-center gap-1.5">
                    <BrandSymbol size={10} />
                    {lang === 'pt' && product.namePt ? product.namePt : product.name}
                  </p>
                  <p className="text-[12px] font-medium text-ink shrink-0">€{product.price}</p>
                </div>
                {product.species && (
                  <p className="text-[10px] text-stone italic mt-0.5">{product.species}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
