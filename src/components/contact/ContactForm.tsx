'use client'

import { useState, FormEvent } from 'react'
import { Loader2, Check } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'

export default function ContactForm() {
  const { t } = useLang()
  const f = t.contact.fields
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[11px] tracking-[0.15em] uppercase text-stone">{f.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={f.namePlaceholder}
            className="field-input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[11px] tracking-[0.15em] uppercase text-stone">{f.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={f.emailPlaceholder}
            className="field-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-[11px] tracking-[0.15em] uppercase text-stone">{f.subject}</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder={f.subjectPlaceholder}
          className="field-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-[11px] tracking-[0.15em] uppercase text-stone">{f.message}</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder={f.messagePlaceholder}
          className="field-input resize-none"
        />
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-3 py-4 px-5 bg-teal-light text-teal-deep text-[13px]">
          <Check size={16} strokeWidth={2} />
          {t.contact.success}
        </div>
      ) : (
        <>
          {status === 'error' && (
            <p className="text-[13px] text-rose">{t.contact.error}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 bg-teal text-white text-[11px] tracking-[0.2em] uppercase py-4 hover:bg-teal-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <><Loader2 size={14} className="animate-spin" /> {f.sending}</>
            ) : (
              f.submit
            )}
          </button>
        </>
      )}

    </form>
  )
}
