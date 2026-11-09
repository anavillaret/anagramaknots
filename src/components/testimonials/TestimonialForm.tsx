'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n/context'

type Props = {
  productName?: string
  productId?: string
}

export default function TestimonialForm({ productName, productId }: Props) {
  const { t } = useLang()
  const tr = t.testimonials
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setStatus('sending')

    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location, text, product_name: productName, product_id: productId }),
    })

    setStatus(res.ok ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <div className="border border-teal/30 bg-teal/5 p-6 text-center">
        <p className="text-[13px] text-teal font-medium tracking-wide">{tr.thankYou}</p>
        <p className="text-[12px] text-stone mt-1">{tr.thankYouSub}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-semibold">{tr.formTitle}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone">{tr.nameLabel}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder={tr.namePlaceholder}
            className="border border-stone-light px-3 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone">{tr.locationLabel}</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder={tr.locationPlaceholder}
            className="border border-stone-light px-3 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] tracking-[0.15em] uppercase text-stone">{tr.textLabel}</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          required
          rows={3}
          placeholder={tr.textPlaceholder}
          className="border border-stone-light px-3 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors bg-white resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-[12px] text-rose">{tr.error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !name.trim() || !text.trim()}
        className="bg-teal text-white text-[11px] tracking-[0.2em] uppercase py-3 hover:bg-teal-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-default"
      >
        {status === 'sending' ? tr.sending : tr.submit}
      </button>
    </form>
  )
}
