'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { DbProduct } from '@/lib/supabase'
import AdminShell from '@/components/admin/AdminShell'
import Image from 'next/image'

export default function AdminHero() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [slots, setSlots] = useState<[string, string, string]>(['', '', ''])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: prods }, { data: config }] = await Promise.all([
        supabase.from('products').select('*').eq('active', true).order('sort_order'),
        supabase.from('site_config').select('value').eq('key', 'hero_products').single(),
      ])
      setProducts(prods ?? [])
      const slugs: string[] = config?.value ?? ['', '', '']
      setSlots([slugs[0] ?? '', slugs[1] ?? '', slugs[2] ?? ''])
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: slots }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const getProduct = (slug: string) => products.find(p => p.slug === slug)

  if (loading) return (
    <AdminShell>
      <p className="text-[13px] text-stone">Loading…</p>
    </AdminShell>
  )

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Hero Slideshow</h1>
          <p className="text-[13px] text-stone mt-1">Choose the 3 animals that rotate on the homepage.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([0, 1, 2] as const).map(i => {
          const selected = getProduct(slots[i])
          return (
            <div key={i} className="bg-white border border-gray-100 rounded-sm overflow-hidden">
              {/* Preview image */}
              <div className="relative aspect-square bg-linen">
                {selected?.image ? (
                  <Image
                    src={selected.image.startsWith('http') ? selected.image : selected.image}
                    alt={selected.name}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[12px] text-stone">No product selected</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 text-[10px] tracking-[0.15em] uppercase text-teal px-2 py-0.5">
                  Slide {i + 1}
                </div>
                {i === 0 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[9px] px-2 py-1 leading-snug">
                    Text: "Every knot tells a story." — generic brand slide, any animal works
                  </div>
                )}
                {i === 1 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[9px] px-2 py-1 leading-snug">
                    Text: "Art born from love of nature." — pick an animal with a nature/conservation story
                  </div>
                )}
                {i === 2 && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[9px] px-2 py-1 leading-snug">
                    Text: "One knot, one creature." — pick any signature piece
                  </div>
                )}
              </div>

              {/* Selector */}
              <div className="p-4">
                {selected && (
                  <p className="text-[13px] font-medium text-ink mb-2">{selected.name}</p>
                )}
                <select
                  value={slots[i]}
                  onChange={e => {
                    const next = [...slots] as [string, string, string]
                    next[i] = e.target.value
                    setSlots(next)
                  }}
                  className="w-full text-[12px] border border-gray-200 px-3 py-2 text-stone outline-none hover:border-teal transition-colors bg-white"
                >
                  <option value="">— Choose an animal —</option>
                  {products.map(p => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}{p.badge === 'soldout' ? ' (sold)' : ''}
                    </option>
                  ))}
                </select>
                {selected && (
                  <p className="mt-2 text-[11px] text-stone leading-relaxed line-clamp-3">
                    {selected.fact}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </AdminShell>
  )
}
