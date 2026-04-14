'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

type FormState = {
  name: string; slug: string; species: string
  fact: string; fact_pt: string; price: string; image: string
  available_on_request: boolean; badge: string
  details: string; details_pt: string
  size: string; size_pt: string
  care_tips: string; care_tips_pt: string
  images: string[]
}

const REQUIRED: { key: keyof FormState; label: string }[] = [
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

function missingFields(form: FormState) {
  return REQUIRED.filter(r => {
    const v = form[r.key]
    if (r.key === 'price') return !v || String(v).trim() === '' || String(v) === '0'
    return !v || String(v).trim() === '' || String(v).includes('placeholder')
  })
}

export default function NewProduct() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>({
    name: '', slug: '', species: '',
    fact: '', fact_pt: '', price: '', image: '',
    available_on_request: false, badge: '',
    details: '', details_pt: '',
    size: '', size_pt: '',
    care_tips: '', care_tips_pt: '',
    images: [],
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

  const missing = missingFields(form)
  const isComplete = missing.length === 0

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
        fact_pt: form.fact_pt || null,
        price: parseFloat(form.price) || 0,
        category: 'amigurumis',
        image: form.image || '/images/products/placeholder.jpeg',
        badge: form.badge || null,
        available_on_request: form.available_on_request,
        details: form.details,
        details_pt: form.details_pt || '',
        size: form.size,
        size_pt: form.size_pt || '',
        care_tips: form.care_tips,
        care_tips_pt: form.care_tips_pt || '',
        images: form.images,
        active: false, // always draft — publish from products list
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

        {/* Gallery photos */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Gallery Photos <span className="text-stone/50 normal-case">(optional — shown below the main photo)</span></label>
          <MultiImageUpload values={form.images} onChange={urls => setForm(f => ({ ...f, images: urls }))} />
        </div>

        {/* Text fields */}
        {textFields.map(f => (
          <div key={f.key}>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">{f.label}</label>
            <input
              type={f.type ?? 'text'}
              required={f.required}
              value={(form as Record<string, unknown>)[f.key] as string}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Fact / Story <span className="text-stone/50 normal-case">(EN)</span></label>
          <textarea value={form.fact} onChange={e => set('fact', e.target.value)} rows={3}
            placeholder="The animal's story — shown on the product page."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Fact / Story <span className="text-stone/50 normal-case">(PT)</span></label>
          <textarea value={form.fact_pt} onChange={e => set('fact_pt', e.target.value)} rows={3}
            placeholder="A história do animal em português — mostrada na versão PT do site."
            className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
        </div>

        {/* Details + Size + Care (EN) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details <span className="text-stone/50 normal-case">(EN)</span></label>
            <textarea value={form.details} onChange={e => set('details', e.target.value)} rows={3}
              placeholder="100% cotton, hypoallergenic fiber stuffing and eyes locked for safety."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Size <span className="text-stone/50 normal-case">(EN)</span></label>
            <input type="text" value={form.size} onChange={e => set('size', e.target.value)}
              placeholder="e.g. 48 cm / 19 inches long"
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips <span className="text-stone/50 normal-case">(EN)</span></label>
            <textarea value={form.care_tips} onChange={e => set('care_tips', e.target.value)} rows={3}
              placeholder="Hand wash with care and let air dry."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
        </div>

        {/* Details + Size + Care (PT) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Details <span className="text-stone/50 normal-case">(PT)</span></label>
            <textarea value={form.details_pt} onChange={e => set('details_pt', e.target.value)} rows={3}
              placeholder="100% algodão, enchimento hipoalergénico e olhos fixos para segurança."
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Size <span className="text-stone/50 normal-case">(PT)</span></label>
            <input type="text" value={form.size_pt} onChange={e => set('size_pt', e.target.value)}
              placeholder="ex. 48 cm de comprimento"
              className="w-full border border-gray-200 px-4 py-2.5 text-[13px] text-ink outline-none focus:border-teal transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-stone mb-2">Care Tips <span className="text-stone/50 normal-case">(PT)</span></label>
            <textarea value={form.care_tips_pt} onChange={e => set('care_tips_pt', e.target.value)} rows={3}
              placeholder="Lavar à mão com cuidado e deixar secar ao ar."
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

        {/* Completeness checklist */}
        {!isComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
            <p className="text-[11px] font-semibold text-amber-800 mb-2 tracking-wide uppercase">
              Will be saved as draft — fill in to be ready to publish:
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

        {isComplete && (
          <div className="bg-teal/5 border border-teal/20 rounded-sm px-4 py-3">
            <p className="text-[11px] text-teal font-semibold tracking-wide uppercase">
              ✓ Product is complete — you can publish it from the products list after saving.
            </p>
          </div>
        )}

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
