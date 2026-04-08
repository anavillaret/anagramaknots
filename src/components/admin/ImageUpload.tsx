'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  value: string          // current image URL or path
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
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
      onChange(json.url)
    }
    setUploading(false)
  }

  function handleFiles(files: FileList | null) {
    if (files?.[0]) upload(files[0])
  }

  const hasImage = value && !value.includes('placeholder')

  return (
    <div className="space-y-3">
      {/* Drop zone / preview */}
      <div
        className={`relative border-2 border-dashed transition-colors cursor-pointer ${
          dragOver ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-gray-400'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex items-center justify-center h-40 text-[12px] text-stone">
            Uploading…
          </div>
        ) : hasImage ? (
          /* Preview */
          <div className="relative w-full aspect-square max-w-[200px] mx-auto my-4">
            <Image src={value} alt="Product image" fill className="object-contain" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-[11px] tracking-[0.1em] uppercase bg-black/60 px-3 py-1.5">
                Change photo
              </span>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-40 gap-2 pointer-events-none">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <p className="text-[12px] text-stone text-center">
              Drop a photo here or <span className="text-ink underline">browse</span>
            </p>
            <p className="text-[10px] text-gray-400">JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-red-500">{error}</p>}

      {/* Current URL shown as small text (read-only, for reference) */}
      {value && (
        <p className="text-[10px] text-gray-400 truncate" title={value}>{value}</p>
      )}
    </div>
  )
}
