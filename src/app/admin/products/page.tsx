'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase, type DbProduct } from '@/lib/supabase'

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'soldout', label: 'Sold' },
  { value: 'new', label: 'New' },
  { value: 'bestseller', label: 'Best Seller' },
  { value: 'sale', label: 'Sale' },
]

export default function AdminProducts() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'available' | 'sold' | 'request'>('all')

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('sort_order')
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function patchProduct(id: string, fields: Record<string, unknown>) {
    setSaving(id)
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    await load()
    setSaving(null)
  }

  async function toggleActive(p: DbProduct) {
    // null and true both mean visible — treat null as true when toggling
    const isVisible = p.active !== false
    await patchProduct(p.id, { active: !isVisible })
  }

  // Mark as sold → also auto-enables commission so the CTA shows on the live site
  async function markSold(p: DbProduct) {
    if (p.badge === 'soldout') {
      // Unmark sold — restore to commission-only
      await patchProduct(p.id, { badge: null, available_on_request: true })
    } else {
      // Mark sold — sold pieces are always commissionable
      await patchProduct(p.id, { badge: 'soldout', available_on_request: true })
    }
  }

  async function toggleRequest(p: DbProduct) {
    await patchProduct(p.id, { available_on_request: !p.available_on_request })
  }

  const filtered = products.filter(p => {
    if (filter === 'available') return !p.available_on_request && p.badge !== 'soldout' && p.active
    if (filter === 'sold') return p.badge === 'soldout'
    if (filter === 'request') return p.available_on_request
    return true
  })

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-ink">Products</h1>
        <a href="/admin/products/new" className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-4 py-2 hover:bg-teal-dark transition-colors">
          + Add Product
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'available', 'sold', 'request'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${filter === f ? 'bg-ink text-white border-ink' : 'border-gray-200 text-stone hover:border-ink hover:text-ink'}`}>
            {f === 'all' ? 'All' : f === 'available' ? 'Available' : f === 'sold' ? 'Sold' : 'Commission'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-stone font-medium tracking-wide">Product</th>
              <th className="text-left px-4 py-3 text-stone font-medium tracking-wide">Price</th>
              <th className="text-left px-4 py-3 text-stone font-medium tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-stone font-medium tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.active === false ? 'opacity-40' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linen relative overflow-hidden shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-ink">※ {p.name}</p>
                      {p.species && <p className="text-stone italic text-[11px]">{p.species}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink">€{p.price}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                    p.badge === 'soldout' ? 'bg-stone/10 text-stone' :
                    p.available_on_request ? 'bg-teal/10 text-teal' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {p.badge === 'soldout' ? 'Sold' : p.available_on_request ? 'Commission' : 'Available'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {saving === p.id ? (
                      <span className="text-stone text-[11px]">Saving…</span>
                    ) : (
                      <>
                        <button onClick={() => markSold(p)}
                          className={`text-[10px] px-2 py-1 border transition-colors ${p.badge === 'soldout' ? 'border-stone text-stone hover:bg-stone hover:text-white' : 'border-gray-200 text-stone hover:border-stone'}`}>
                          {p.badge === 'soldout' ? 'Unmark Sold' : 'Mark Sold'}
                        </button>
                        <button onClick={() => toggleRequest(p)}
                          className={`text-[10px] px-2 py-1 border transition-colors ${p.available_on_request ? 'border-teal text-teal hover:bg-teal hover:text-white' : 'border-gray-200 text-stone hover:border-teal hover:text-teal'}`}>
                          {p.available_on_request ? 'In Stock' : 'Commission'}
                        </button>
                        <a href={`/admin/products/${p.id}`}
                          className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-ink hover:text-ink transition-colors">
                          Edit
                        </a>
                        <button onClick={() => toggleActive(p)}
                          className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-red-300 hover:text-red-500 transition-colors">
                          {p.active === false ? 'Show' : 'Hide'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
