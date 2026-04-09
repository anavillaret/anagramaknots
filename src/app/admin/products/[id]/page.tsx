'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { DbProduct } from '@/lib/supabase'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditProduct() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Partial<DbProduct>>({})

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/products/${id}`)
      if (res.ok) setForm(await res.json())
      setLoading(false)
    }
    load()
  }, [id])

  function set(field: string, value: string | boolean | null | number) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        species: form.species,
        fact: form.fact,
        price: form.price,
        image: form.image,
        badge: form.badge ?? null,
        available_on_request: form.available_on_request,
        details: form.details,
        care_tips: form.care_tips,
        active: form.active,
      }),
    })
    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Save failed')
      setSaving(false)
      return
    }
    router.push('/admin/products')
  }

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  const isSold = form.badge === 'soldout'
  const isOnRequest = form.available_on_request === true
  const status = isSold ? 'soldout' : isOnRequest ? 'request' : 'available'

  function setStatus(s: string) {
    if (s === 'soldout') { set('badge', 'soldout'); set('available_on_request', false) }
    else if (s === 'request') { set('badge', null); set('available_on_request', true) }
    else { set('badge', null); set('available_on_request', false) }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-[11px] text-stone hover:text-ink transition-colors">← Back</button>
        <h1 className="text-2xl font-semibold text-ink">Edit — {form.name || '…'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-6">

        {/* Photo upload */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Photo</label>
          <ImageUpload value={form.image ?? ''} onChange={url => set('image', url)} />
        </div>

        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Name</label>
            <input type="text" required value={form.name ?? ''} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Slug</label>
            <input type="text" required value={form.slug ?? ''} onChange={e => set('slug', e.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
        </div>

        {/* Species + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Species</label>
            <input type="text" value={form.species ?? ''} onChange={e => set('species', e.target.value)}
              placeholder="e.g. Ursus arctos horribilis"
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Price (€)</label>
            <input type="number" required value={form.price ?? ''} onChange={e => set('price', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
        </div>

        {/* Fact */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Fact / Story</label>
          <textarea value={form.fact ?? ''} onChange={e => set('fact', e.target.value)} rows={3}
            placeholder="The animal's story — shown on the product page."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
        </div>

        {/* Details + Care */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details</label>
            <textarea value={form.details ?? ''} onChange={e => set('details', e.target.value)} rows={3}
              placeholder="Materials: 100% cotton, hypoallergenic fiber stuffing. Size: XX cm."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips</label>
            <textarea value={form.care_tips ?? ''} onChange={e => set('care_tips', e.target.value)} rows={3}
              placeholder="Hand wash with care and let air dry."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-3">Status</label>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: 'available', label: '✓ Available (in stock)' },
              { value: 'request', label: '◎ Commission only' },
              { value: 'soldout', label: '✕ Sold' },
            ].map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 text-[12px] cursor-pointer px-4 py-2 border transition-colors ${status === opt.value ? 'border-teal text-teal bg-teal/5' : 'border-gray-200 text-stone hover:border-gray-400'}`}>
                <input type="radio" name="status" className="sr-only" checked={status === opt.value} onChange={() => setStatus(opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3 py-1">
          <input type="checkbox" id="active" checked={form.active !== false} onChange={e => set('active', e.target.checked)}
            className="w-4 h-4 accent-teal" />
          <label htmlFor="active" className="text-[12px] text-ink cursor-pointer">Visible on site</label>
          {form.active === false && (
            <span className="text-[10px] text-orange-500 ml-1">— currently hidden (draft)</span>
          )}
        </div>

        {error && <p className="text-[12px] text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.push('/admin/products')}
            className="border border-gray-200 text-stone text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:border-ink hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
