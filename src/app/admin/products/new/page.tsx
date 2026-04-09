'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'

export default function NewProduct() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    species: '',
    fact: '',
    price: '',
    image: '',
    available_on_request: false,
    badge: '',
    details: '',
    care_tips: '',
  })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
    if (field === 'name' && typeof value === 'string') {
      setForm(f => ({
        ...f,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        species: form.species,
        fact: form.fact,
        price: parseFloat(form.price) || 0,
        category: 'amigurumis',
        image: form.image || '/images/products/placeholder.jpeg',
        badge: form.badge || null,
        available_on_request: form.available_on_request,
        details: form.details,
        care_tips: form.care_tips,
        active: false, // starts as draft — publish from the products list when ready
      }),
    })
    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Save failed')
      setSaving(false)
      return
    }
    router.push('/admin/products?tab=hidden')
  }

  const textFields = [
    { key: 'name', label: 'Name', placeholder: 'e.g. Red Panda', required: true },
    { key: 'slug', label: 'Slug (auto-generated)', placeholder: 'e.g. red-panda', required: true },
    { key: 'species', label: 'Species (scientific / local name)', placeholder: 'e.g. Ailurus fulgens' },
    { key: 'price', label: 'Price (€)', placeholder: '81', required: true, type: 'number' },
  ]

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-[11px] text-stone hover:text-ink transition-colors">← Back</button>
        <h1 className="text-2xl font-semibold text-ink">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-6">

        {/* Photo upload */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Photo</label>
          <ImageUpload value={form.image} onChange={url => set('image', url)} />
        </div>

        {/* Text fields */}
        {textFields.map(f => (
          <div key={f.key}>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">{f.label}</label>
            <input
              type={f.type ?? 'text'}
              required={f.required}
              value={(form as Record<string, string | boolean>)[f.key] as string}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Fact / Story</label>
          <textarea value={form.fact} onChange={e => set('fact', e.target.value)} rows={3}
            placeholder="The animal's story — shown on the product page."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details</label>
            <textarea value={form.details} onChange={e => set('details', e.target.value)} rows={2}
              placeholder="Materials, size, etc."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips</label>
            <textarea value={form.care_tips} onChange={e => set('care_tips', e.target.value)} rows={2}
              placeholder="Hand wash with care and let air dry."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-3">Status</label>
          <div className="flex gap-4">
            {[
              { value: 'available', label: '✓ Available (in stock)', check: !form.available_on_request && form.badge !== 'soldout' },
              { value: 'request', label: '◎ Commission only', check: form.available_on_request },
              { value: 'soldout', label: '✕ Sold', check: form.badge === 'soldout' },
            ].map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 text-[12px] cursor-pointer px-4 py-2 border transition-colors ${opt.check ? 'border-teal text-teal bg-teal/5' : 'border-gray-200 text-stone hover:border-gray-400'}`}>
                <input type="radio" name="status" className="sr-only" checked={opt.check}
                  onChange={() => {
                    if (opt.value === 'soldout') { set('badge', 'soldout'); set('available_on_request', false) }
                    else if (opt.value === 'request') { set('badge', ''); set('available_on_request', true) }
                    else { set('badge', ''); set('available_on_request', false) }
                  }} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-[12px] text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save as Draft'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-gray-200 text-stone text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:border-ink hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
