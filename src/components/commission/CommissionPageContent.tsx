'use client'

import CommissionForm from './CommissionForm'
import { useLang } from '@/lib/i18n/context'

export default function CommissionPageContent() {
  const { t } = useLang()
  const c = t.commission

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-4">{c.eyebrow}</p>
        <h1 className="text-4xl font-semibold text-ink tracking-tight leading-tight">
          {c.heading[0]}<br />
          <em className="font-normal not-italic text-teal">{c.heading[1]}</em>
        </h1>
        <p className="mt-5 text-[14px] leading-relaxed text-stone max-w-md">{c.sub}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-stone max-w-md">
          {c.sub2} <strong className="text-ink font-medium">{c.sub2Bold}</strong> {c.sub2Suffix}
        </p>
        <div className="mt-12 border-t border-stone-light pt-10">
          <CommissionForm />
        </div>
      </div>
    </main>
  )
}
