'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Paperclip, X } from 'lucide-react'

const PRODUCT_TYPES = [
  { value: '', label: 'Select a type…' },
  { value: 'Amigurumi', label: 'Amigurumi (animal character)' },
  { value: 'Accessory', label: 'Accessory (bag, bookmark, beanie…)' },
  { value: 'Clothing', label: 'Clothing (crop top, wearable…)' },
  { value: 'Other', label: 'Other / Not sure yet' },
]

type Status = 'idle' | 'sending' | 'success' | 'error'

function CommissionFormInner() {
  const params = useSearchParams()
  const refProduct = params.get('ref') || ''
  const refImage = params.get('image') || ''
  const refType = params.get('type') || ''

  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [productType, setProductType] = useState(refType)
  const [description, setDescription] = useState(
    refProduct ? `Something similar to the ${refProduct}` : ''
  )
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // If coming from a sold product, fetch its image and add as a reference file
  useEffect(() => {
    if (!refImage) return
    fetch(refImage)
      .then(r => r.blob())
      .then(blob => {
        const filename = refImage.split('/').pop() || 'reference.jpg'
        const file = new File([blob], filename, { type: blob.type })
        setFiles([file])
      })
      .catch(() => {/* ignore if fetch fails */})
  }, [refImage])

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

  const removeFile = (index: number) =>
    setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const data = new FormData()
      data.append('name', name)
      data.append('email', email)
      data.append('productType', productType)
      data.append('description', description)
      if (refProduct) data.append('refProduct', refProduct)
      files.forEach(f => data.append('files', f))

      const res = await fetch('/api/commission', { method: 'POST', body: data })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-10 text-center">
        <p className="text-[12px] tracking-[0.25em] uppercase text-teal mb-3">※ Request received</p>
        <h2 className="text-2xl font-semibold text-ink">Thank you.</h2>
        <p className="mt-3 text-[14px] text-stone leading-relaxed">
          Ana will be in touch within 3–5 working days with a price and timeline estimate.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Reference product banner */}
      {refProduct && refImage && (
        <div className="flex items-center gap-4 bg-linen px-4 py-3 border border-stone-light">
          <div className="relative w-14 h-14 shrink-0 overflow-hidden">
            <Image src={refImage} alt={refProduct} fill className="object-cover" />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-0.5">Reference piece</p>
            <p className="text-[13px] font-medium text-ink">※ {refProduct}</p>
          </div>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your name" required>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ana Silva" className="field-input" />
        </Field>
        <Field label="Email address" required>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="field-input" />
        </Field>
      </div>

      {/* Product type */}
      <Field label="What would you like made?" required>
        <select value={productType} onChange={e => setProductType(e.target.value)} required className="field-input">
          {PRODUCT_TYPES.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>

      {/* Description */}
      <Field label="Describe your idea" required hint="Animal, colours, size, who it's for, any personalisation — the more detail, the better.">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required rows={5}
          placeholder="e.g. A red panda amigurumi, around 25cm, in pastel tones. It's a birthday gift for my daughter who loves animals. If possible, with a little scarf in yellow…"
          className="field-input resize-none"
        />
      </Field>

      {/* File upload */}
      <Field label="Attachments" hint="Photos, sketches or PDFs for inspiration. Optional.">
        <div
          className={`border border-dashed transition-colors cursor-pointer ${dragOver ? 'border-teal bg-teal-light' : 'border-stone-light hover:border-stone'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
          <div className="flex flex-col items-center gap-2 py-6 px-4 text-center pointer-events-none">
            <Paperclip size={18} className="text-stone" strokeWidth={1.5} />
            <p className="text-[12px] text-stone">Drop files here or <span className="text-ink underline">browse</span></p>
            <p className="text-[10px] text-stone-light">Images or PDFs · Max 10 MB each</p>
          </div>
        </div>

        {files.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-[12px] text-stone bg-linen px-3 py-2">
                <span className="truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="shrink-0 text-stone hover:text-ink transition-colors" aria-label={`Remove ${f.name}`}>
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      {status === 'error' && (
        <p className="text-[13px] text-rose">
          Something went wrong. Please try again or email us at anagramaknots@gmail.com.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="self-start bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors duration-200 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send Request'}
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
