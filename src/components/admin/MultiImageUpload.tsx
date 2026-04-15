'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { X, Plus, Loader2 } from 'lucide-react'

interface Props {
  values: string[]
  onChange: (urls: string[]) => void
}

export default function MultiImageUpload({ values, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Upload failed')
    } else {
      onChange([...values, json.url])
    }
    setUploading(false)
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index))
  }

  function move(from: number, to: number) {
    const updated = [...values]
    const [item] = updated.splice(from, 1)
    updated.splice(to, 0, item)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {/* Photo grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {values.map((url, i) => (
            <div key={url} className="relative group">
              <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-200">
                <Image src={url} alt={`Event photo ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[9px] bg-stone text-white px-1.5 py-0.5 tracking-wide uppercase">
                    1st
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    className="text-white text-[10px] bg-black/60 px-2 py-1 hover:bg-black/80"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-white bg-black/60 p-1 hover:bg-red-600/80 rounded-full"
                  title="Remove"
                >
                  <X size={12} />
                </button>
                {i < values.length - 1 && (
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    className="text-white text-[10px] bg-black/60 px-2 py-1 hover:bg-black/80"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add photo button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = '' }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 border border-dashed border-gray-300 text-stone text-[11px] tracking-[0.1em] uppercase px-4 py-2.5 hover:border-teal hover:text-teal transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <><Loader2 size={13} className="animate-spin" /> Uploading…</>
        ) : (
          <><Plus size={13} /> Add photo</>
        )}
      </button>

      {error && <p className="text-[11px] text-red-500">{error}</p>}
      <p className="text-[10px] text-gray-400">First photo is the main one · Drag to reorder using arrows</p>
    </div>
  )
}
