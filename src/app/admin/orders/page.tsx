'use client'

import { useEffect, useState } from 'react'
import { supabase, type DbOrder } from '@/lib/supabase'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-blue-50 text-blue-700',
  shipped: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-500',
}

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    setSaving(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    await load()
    setSaving(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <p className="text-[13px] text-stone">Loading…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-ink">Orders</h1>
        <p className="text-[12px] text-stone">{orders.length} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', ...STATUS_OPTIONS]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors capitalize ${filter === f ? 'bg-ink text-white border-ink' : 'border-gray-200 text-stone hover:border-ink hover:text-ink'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <p className="text-[13px] text-stone">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-stone font-medium">Date</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Items</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Total</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Status</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-stone">
                    {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink font-medium">{o.customer_name ?? '—'}</p>
                    <p className="text-stone text-[11px]">{o.customer_email ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-stone">
                    {Array.isArray(o.line_items) ? o.line_items.map((li: { name: string; quantity: number }) => (
                      <span key={li.name} className="block">{li.name} ×{li.quantity}</span>
                    )) : '—'}
                  </td>
                  <td className="px-4 py-3 text-ink font-medium">
                    {o.total_amount ? `€${(Number(o.total_amount) / 100).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 ${STATUS_COLORS[o.status] ?? ''}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {saving === o.id ? (
                      <span className="text-stone text-[11px]">Saving…</span>
                    ) : (
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        className="text-[11px] border border-gray-200 px-2 py-1 text-stone outline-none hover:border-ink transition-colors"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
