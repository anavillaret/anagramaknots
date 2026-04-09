'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { DbProduct } from '@/lib/supabase'

type Filter = 'all' | 'available' | 'sold' | 'commission' | 'hidden'

/** Returns the list of issues preventing a product from going live */
function publishIssues(p: DbProduct): string[] {
  const issues: string[] = []
  if (!p.name?.trim()) issues.push('Missing name')
  if (!p.slug?.trim()) issues.push('Missing slug')
  if (!p.price || p.price <= 0) issues.push('Price must be > 0')
  if (!p.image || p.image.includes('placeholder')) issues.push('No real photo yet')
  return issues
}

export default function AdminProducts() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function patch(id: string, fields: Record<string, unknown>) {
    setSaving(id)
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    await load()
    setSaving(null)
  }

  async function markSold(p: DbProduct) {
    if (p.badge === 'soldout') {
      await patch(p.id, { badge: null, available_on_request: true })
    } else {
      await patch(p.id, { badge: 'soldout', available_on_request: true })
    }
  }

  async function toggleRequest(p: DbProduct) {
    await patch(p.id, { available_on_request: !p.available_on_request })
  }

  async function hideProduct(p: DbProduct) {
    await patch(p.id, { active: false })
  }

  async function deleteProduct(id: string) {
    setSaving(id)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    await load()
    setSaving(null)
  }

  async function publishProduct(p: DbProduct) {
    const issues = publishIssues(p)
    if (issues.length > 0) return // button is disabled, shouldn't reach here
    await patch(p.id, { active: true })
  }

  const counts = {
    all: products.length,
    available: products.filter(p => p.active !== false && !p.available_on_request && p.badge !== 'soldout').length,
    sold: products.filter(p => p.badge === 'soldout').length,
    commission: products.filter(p => p.active !== false && p.available_on_request).length,
    hidden: products.filter(p => p.active === false).length,
  }

  const filtered = products.filter(p => {
    if (filter === 'available') return p.active !== false && !p.available_on_request && p.badge !== 'soldout'
    if (filter === 'sold') return p.badge === 'soldout'
    if (filter === 'commission') return p.active !== false && p.available_on_request
    if (filter === 'hidden') return p.active === false
    return true
  })

  const TABS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'sold', label: 'Sold' },
    { key: 'commission', label: 'Commission' },
    { key: 'hidden', label: 'Hidden / Draft' },
  ]

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-ink">Products</h1>
        <a href="/admin/products/new"
          className="bg-teal text-white text-[11px] tracking-[0.15em] uppercase px-4 py-2 hover:bg-teal-dark transition-colors">
          + Add Product
        </a>
      </div>
      <p className="text-[12px] text-stone bg-amber-50 border border-amber-200 px-4 py-2.5 mb-6 rounded-sm">
        📐 <strong>Featured spot tip:</strong> The first available product appears as the large card on the homepage. For best results, use a <strong>portrait photo (3:4 ratio, e.g. 900×1200px)</strong> — the animal centred, minimal background.
      </p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
              filter === tab.key
                ? tab.key === 'hidden' ? 'bg-orange-500 text-white border-orange-500' : 'bg-ink text-white border-ink'
                : tab.key === 'hidden' && counts.hidden > 0
                  ? 'border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                  : 'border-gray-200 text-stone hover:border-ink hover:text-ink'
            }`}>
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className="ml-1.5 opacity-60">{counts[tab.key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Empty hidden tab */}
      {filter === 'hidden' && filtered.length === 0 && (
        <p className="text-[13px] text-stone py-12 text-center">No hidden or draft products.</p>
      )}

      {filtered.length > 0 && (
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
              {filtered.map(p => {
                const isDraft = p.active === false
                const issues = isDraft ? publishIssues(p) : []
                const canPublish = issues.length === 0

                return (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isDraft ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linen relative overflow-hidden shrink-0">
                          <Image src={p.image || '/images/products/placeholder.jpeg'} alt={p.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">※ {p.name || <em className="text-stone">No name</em>}</p>
                          {p.species && <p className="text-stone italic text-[11px]">{p.species}</p>}
                          {isDraft && issues.length > 0 && (
                            <p className="text-[10px] text-orange-500 mt-0.5">⚠ {issues.join(' · ')}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {p.price > 0 ? `€${p.price}` : <span className="text-stone italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isDraft ? (
                        <span className="text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 bg-orange-50 text-orange-500 border border-orange-200">
                          Draft
                        </span>
                      ) : (
                        <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                          p.badge === 'soldout' ? 'bg-stone/10 text-stone' :
                          p.available_on_request ? 'bg-teal/10 text-teal' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {p.badge === 'soldout' ? 'Sold' : p.available_on_request ? 'Commission' : 'Available'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {saving === p.id ? (
                          <span className="text-stone text-[11px]">Saving…</span>
                        ) : isDraft ? (
                          /* Draft product actions */
                          <>
                            <button
                              onClick={() => publishProduct(p)}
                              disabled={!canPublish}
                              title={!canPublish ? `Cannot publish: ${issues.join(', ')}` : 'Publish to store'}
                              className={`text-[10px] px-3 py-1 border transition-colors ${
                                canPublish
                                  ? 'border-teal text-teal hover:bg-teal hover:text-white'
                                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
                              }`}>
                              Publish →
                            </button>
                            <a href={`/admin/products/${p.id}`}
                              className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-ink hover:text-ink transition-colors">
                              Edit
                            </a>
                            {confirmDelete === p.id ? (
                              <span className="flex items-center gap-1.5">
                                <span className="text-[10px] text-red-500">Delete forever?</span>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="text-[10px] px-2 py-1 bg-red-500 text-white border border-red-500 hover:bg-red-600 transition-colors">
                                  Yes, delete
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-ink transition-colors">
                                  Cancel
                                </button>
                              </span>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(p.id)}
                                className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-red-400 hover:text-red-500 transition-colors">
                                Delete
                              </button>
                            )}
                          </>
                        ) : (
                          /* Live product actions */
                          <>
                            <button onClick={() => markSold(p)}
                              className={`text-[10px] px-2 py-1 border transition-colors ${
                                p.badge === 'soldout'
                                  ? 'border-stone text-stone hover:bg-stone hover:text-white'
                                  : 'border-gray-200 text-stone hover:border-stone'
                              }`}>
                              {p.badge === 'soldout' ? 'Unmark Sold' : 'Mark Sold'}
                            </button>
                            {p.badge !== 'soldout' && (
                              <button onClick={() => toggleRequest(p)}
                                className={`text-[10px] px-2 py-1 border transition-colors ${
                                  p.available_on_request
                                    ? 'border-teal text-teal hover:bg-teal hover:text-white'
                                    : 'border-gray-200 text-stone hover:border-teal hover:text-teal'
                                }`}>
                                {p.available_on_request ? 'In Stock' : 'Commission'}
                              </button>
                            )}
                            <a href={`/admin/products/${p.id}`}
                              className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-ink hover:text-ink transition-colors">
                              Edit
                            </a>
                            <button onClick={() => hideProduct(p)}
                              className="text-[10px] px-2 py-1 border border-gray-200 text-stone hover:border-red-300 hover:text-red-500 transition-colors">
                              Hide
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
