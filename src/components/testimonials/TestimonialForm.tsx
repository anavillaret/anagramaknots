'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, ImagePlus } from 'lucide-react'
import { useLang } from '@/lib/i18n/context'
import { supabase } from '@/lib/supabase'

type Props = {
  productName?: string
  productId?: string
}

const MAX_PHOTOS = 3
const MAX_MB = 5

export default function TestimonialForm({ productName, productId }: Props) {
  const { t } = useLang()
  const tr = t.testimonials
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [text, setText] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function addPhotos(files: FileList | null) {
    if (!files) return
    const incoming = Array.from(files).filter(f => f.type.startsWith('image/'))
    const remaining = MAX_PHOTOS - photos.length
    const toAdd = incoming.slice(0, remaining)

    const oversized = toAdd.filter(f => f.size > MAX_MB * 1024 * 1024)
    if (oversized.length > 0) {
      setErrorMsg(`Each photo must be under ${MAX_MB}MB.`)
      return
    }

    setErrorMsg('')
    const newPreviews = toAdd.map(f => URL.createObjectURL(f))
    setPhotos(prev => [...prev, ...toAdd])
    setPreviews(prev => [...prev, ...newPreviews])
  }

  function removePhoto(i: number) {
    URL.revokeObjectURL(previews[i])
    setPhotos(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  async function uploadPhotos(): Promise<string[]> {
    const urls: string[] = []
    for (const file of photos) {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage
        .from('testimonial-media')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('testimonial-media').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setStatus('sending')
    setErrorMsg('')

    try {
      const mediaUrls = photos.length > 0 ? await uploadPhotos() : []

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          text,
          product_name: productName,
          product_id: productId,
          media_urls: mediaUrls,
        }),
      })

      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMsg(tr.error)
      }
    } catch {
      setStatus('error')
      setErrorMsg(tr.error)
    }
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

      {/* Photo upload */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-[0.15em] uppercase text-stone">{tr.photosLabel}</label>

        <div className="flex flex-wrap gap-2">
          {/* Previews */}
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 bg-linen">
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-1.5 -right-1.5 bg-ink text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-rose transition-colors"
              >
                <X size={9} />
              </button>
            </div>
          ))}

          {/* Add button */}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 border border-dashed border-stone-light flex flex-col items-center justify-center gap-1 text-stone hover:border-teal hover:text-teal transition-colors"
            >
              <ImagePlus size={18} strokeWidth={1.5} />
              <span className="text-[9px] tracking-wide uppercase">{tr.addPhoto}</span>
            </button>
          )}
        </div>

        <p className="text-[10px] text-stone">{tr.photosHint}</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => addPhotos(e.target.files)}
        />
      </div>

      {errorMsg && <p className="text-[12px] text-rose">{errorMsg}</p>}

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
