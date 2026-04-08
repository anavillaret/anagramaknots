'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
    badge: '',
    available_on_request: false,
    details: '',
    care_tips: '',
  })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
    if (field === 'name' && typeof value === 'string') {
      setForm(f => ({ ...f, name: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('products').insert({
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
    })
    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/products')
  }

  const fields = [
    { key: 'name', label: 'Name', placeholder: 'e.g. Red Panda', required: true },
    { key: 'slug', label: 'Slug (auto-generated)', placeholder: 'e.g. red-panda', required: true },
    { key: 'species', label: 'Species (scientific / local name)', placeholder: 'e.g. Ailurus fulgens' },
    { key: 'price', label: 'Price (€)', placeholder: '81', required: true, type: 'number' },
    { key: 'image', label: 'Image path', placeholder: '/images/products/IMG_XXXX.jpeg' },
  ]

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-[11px] text-stone hover:text-ink transition-colors">← Back</button>
        <h1 className="text-2xl font-semibold text-ink">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-6">
        {fields.map(f => (
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
          <textarea
            value={form.fact}
            onChange={e => set('fact', e.target.value)}
            rows={3}
            placeholder="The animal's story — shown on the product page."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details</label>
          <textarea
            value={form.details}
            onChange={e => set('details', e.target.value)}
            rows={2}
            placeholder="Materials, size, etc."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips</label>
          <textarea
            value={form.care_tips}
            onChange={e => set('care_tips', e.target.value)}
            rows={2}
            placeholder="Hand wash with care and let air dry."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Status</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-[12px] text-ink cursor-pointer">
              <input type="radio" name="status" checked={!form.available_on_request && form.badge !== 'soldout'}
                onChange={() => { set('available_on_request', false); set('badge', '') }} />
              Available (in stock)
            </label>
            <label className="flex items-center gap-2 text-[12px] text-ink cursor-pointer">
              <input type="radio" name="status" checked={form.available_on_request}
                onChange={() => { set('available_on_request', true); set('badge', '') }} />
              Commission only
            </label>
            <label className="flex items-center gap-2 text-[12px] text-ink cursor-pointer">
              <input type="radio" name="status" checked={form.badge === 'soldout'}
                onChange={() => { set('badge', 'soldout'); set('available_on_request', false) }} />
              Sold
            </label>
          </div>
        </div>

        {error && <p className="text-[12px] text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Product'}
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
