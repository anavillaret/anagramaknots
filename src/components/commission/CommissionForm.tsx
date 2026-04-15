'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Paperclip, X } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'
import BrandSymbol from '@/components/ui/BrandSymbol'
import Eyebrow from '@/components/ui/Eyebrow'

type Status = 'idle' | 'sending' | 'success' | 'error'

function CommissionFormInner() {
  const { t } = useLang()
  const c = t.commission
  const f = c.fields
  const params = useSearchParams()
  const refProduct = params.get('ref') || ''
  const refImage = params.get('image') || ''

  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!refImage) return
    fetch(refImage)
      .then(r => r.blob())
      .then(blob => {
        const filename = refImage.split('/').pop() || 'reference.jpg'
        setFiles([new File([blob], filename, { type: blob.type })])
      })
      .catch(() => {})
  }, [refImage])

  useEffect(() => {
    if (refProduct) {
      setDescription(`${f.descriptionRefPrefix} ${refProduct}`)
    }
  }, [refProduct, f.descriptionRefPrefix])

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const allowed = Array.from(incoming).filter(f =>
      f.type.startsWith('image/') || f.type === 'application/pdf'
    )
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size))
      return [...prev, ...allowed.filter(f => !existing.has(f.name + f.size))]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // Upload each file individually to storage first, collect public URLs
      const fileUrls: string[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const json = await res.json()
          fileUrls.push(json.url)
        }
        // If a file fails to upload, skip it silently — don't block the submission
      }

      // Submit form data as JSON (tiny payload, no binary)
      const productType = params.get('type') || 'Amigurumi'
      const res = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, productType, description, fileUrls }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-10 text-center">
        <Eyebrow className="text-[12px] tracking-[0.25em] uppercase text-teal mb-3 justify-center">{c.successEyebrow}</Eyebrow>
        <h2 className="text-2xl font-semibold text-ink">{c.successHeading}</h2>
        <p className="mt-3 text-[14px] text-stone leading-relaxed">{c.successSub}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Reference product banner */}
      {refProduct && refImage && (
        <div className="flex items-center gap-4 bg-linen px-4 py-3 border border-stone-light">
          <div className="relative w-14 h-14 shrink-0 overflow-hidden">
            <Image src={refImage} alt={refProduct} fill className="object-contain" />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-0.5">{c.refBanner}</p>
            <p className="text-[13px] font-medium text-teal flex items-center gap-1.5"><BrandSymbol size={11} />{refProduct}</p>
          </div>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={f.name} required>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={f.namePlaceholder}
            className="w-full border border-stone-light px-4 py-3 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
        </Field>
        <Field label={f.email} required>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={f.emailPlaceholder}
            className="w-full border border-stone-light px-4 py-3 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
        </Field>
      </div>

      {/* Description */}
      <Field label={f.description} required hint={f.descriptionHint}>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5}
          placeholder={f.descriptionPlaceholder}
          className="w-full border border-stone-light px-4 py-3 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
      </Field>

      {/* File upload */}
      <Field label={f.attachments} hint={f.attachmentHint}>
        <div
          className={`border border-dashed transition-colors cursor-pointer ${dragOver ? 'border-teal bg-teal/5' : 'border-stone-light hover:border-stone'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple className="hidden"
            onChange={e => addFiles(e.target.files)} />
          <div className="flex flex-col items-center gap-2 py-6 px-4 text-center pointer-events-none">
            <Paperclip size={18} className="text-stone" strokeWidth={1.5} />
            <p className="text-[12px] text-stone">
              {f.attachmentDrop} <span className="text-ink underline">{f.attachmentBrowse}</span>
            </p>
            <p className="text-[10px] text-stone-light">{f.attachmentLimit}</p>
          </div>
        </div>
        {files.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-[12px] text-stone bg-linen px-3 py-2">
                <span className="truncate">{file.name}</span>
                <button type="button" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                  className="shrink-0 text-stone hover:text-ink transition-colors">
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      {status === 'error' && (
        <p className="text-[13px] text-red-500">{c.error}</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="self-start bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors disabled:opacity-60">
        {status === 'sending' ? f.sending : f.submit}
      </button>
    </form>
  )
}

export default function CommissionForm() {
  return (
    <Suspense fallback={null}>
      <CommissionFormInner />
    </Suspense>
  )
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.15em] uppercase text-ink">
        {label}{required && <span className="text-teal ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[11px] text-stone -mt-0.5">{hint}</p>}
      {children}
    </div>
  )
}
