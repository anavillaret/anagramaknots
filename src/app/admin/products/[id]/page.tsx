'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { DbProduct } from '@/lib/supabase'
import ImageUpload from '@/components/admin/ImageUpload'

const REQUIRED: { key: keyof DbProduct; label: string }[] = [
  { key: 'image',        label: 'Photo' },
  { key: 'name',         label: 'Name' },
  { key: 'price',        label: 'Price' },
  { key: 'fact',         label: 'Fact (EN)' },
  { key: 'fact_pt',      label: 'Fact (PT)' },
  { key: 'details',      label: 'Details (EN)' },
  { key: 'details_pt',   label: 'Details (PT)' },
  { key: 'size',         label: 'Size (EN)' },
  { key: 'size_pt',      label: 'Size (PT)' },
  { key: 'care_tips',    label: 'Care Tips (EN)' },
  { key: 'care_tips_pt', label: 'Care Tips (PT)' },
]

function missingFields(form: Partial<DbProduct>) {
  return REQUIRED.filter(r => {
    const v = form[r.key]
    if (r.key === 'price') return !v && v !== 0
    return !v || String(v).trim() === '' || String(v).includes('placeholder')
  })
}

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

  const missing = missingFields(form)
  const isComplete = missing.length === 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    // Force draft if product is incomplete
    const active = isComplete ? form.active : false
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        species: form.species,
        fact: form.fact,
        fact_pt: form.fact_pt ?? null,
        price: form.price,
        image: form.image,
        badge: form.badge ?? null,
        available_on_request: form.available_on_request,
        details: form.details,
        details_pt: form.details_pt ?? '',
        size: form.size,
        size_pt: form.size_pt ?? '',
        care_tips: form.care_tips,
        care_tips_pt: form.care_tips_pt ?? '',
        active,
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
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Fact / Story <span className="text-stone/50 normal-case">(EN)</span></label>
          <textarea value={form.fact ?? ''} onChange={e => set('fact', e.target.value)} rows={3}
            placeholder="The animal's story — shown on the product page."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
        </div>

        {/* Fact PT */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Fact / Story <span className="text-stone/50 normal-case">(PT)</span></label>
          <textarea value={form.fact_pt ?? ''} onChange={e => set('fact_pt', e.target.value)} rows={3}
            placeholder="A história do animal em português — mostrada na versão PT do site."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
        </div>

        {/* Details + Size + Care (EN) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details <span className="text-stone/50 normal-case">(EN)</span></label>
            <textarea value={form.details ?? ''} onChange={e => set('details', e.target.value)} rows={3}
              placeholder="100% cotton, hypoallergenic fiber stuffing and eyes locked for safety."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Size <span className="text-stone/50 normal-case">(EN)</span></label>
            <input type="text" value={(form as { size?: string }).size ?? ''} onChange={e => set('size', e.target.value)}
              placeholder="e.g. 48 cm / 19 inches long"
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips <span className="text-stone/50 normal-case">(EN)</span></label>
            <textarea value={form.care_tips ?? ''} onChange={e => set('care_tips', e.target.value)} rows={3}
              placeholder="Hand wash with care and let air dry."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
        </div>

        {/* Details + Size + Care (PT) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details <span className="text-stone/50 normal-case">(PT)</span></label>
            <textarea value={form.details_pt ?? ''} onChange={e => set('details_pt', e.target.value)} rows={3}
              placeholder="100% algodão, enchimento hipoalergénico e olhos fixos para segurança."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Size <span className="text-stone/50 normal-case">(PT)</span></label>
            <input type="text" value={form.size_pt ?? ''} onChange={e => set('size_pt', e.target.value)}
              placeholder="ex. 48 cm de comprimento"
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips <span className="text-stone/50 normal-case">(PT)</span></label>
            <textarea value={form.care_tips_pt ?? ''} onChange={e => set('care_tips_pt', e.target.value)} rows={3}
              placeholder="Lavar à mão com cuidado e deixar secar ao ar."
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
        <div className="space-y-3">
          <div className={`flex items-center gap-3 py-1 ${!isComplete ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              id="active"
              checked={isComplete && form.active !== false}
              disabled={!isComplete}
              onChange={e => set('active', e.target.checked)}
              className="w-4 h-4 accent-teal disabled:cursor-not-allowed"
            />
            <label htmlFor="active" className={`text-[12px] text-ink ${!isComplete ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              Visible on site
            </label>
            {form.active === false && isComplete && (
              <span className="text-[10px] text-orange-500 ml-1">— currently hidden (draft)</span>
            )}
          </div>

          {/* Completeness checklist */}
          {!isComplete && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
              <p className="text-[11px] font-semibold text-amber-800 mb-2 tracking-wide uppercase">
                Product will be saved as draft — fill in to publish:
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {missing.map(f => (
                  <li key={f.key} className="text-[11px] text-amber-700 flex items-center gap-1">
                    <span className="text-amber-400">○</span> {f.label}
                  </li>
                ))}
              </ul>
            </div>
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
