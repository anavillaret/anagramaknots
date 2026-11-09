'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { type DbTestimonial } from '@/lib/supabase'

function RequestReviewPanel() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [product, setProduct] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    const res = await fetch('/api/admin/testimonials/request-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_email: email.trim(),
        customer_name: name.trim() || null,
        product_name: product.trim() || 'your piece',
      }),
    })
    if (res.ok) {
      setStatus('sent')
      setEmail('')
      setName('')
      setProduct('')
      setTimeout(() => setStatus('idle'), 4000)
    } else {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="bg-white border border-gray-100 p-6 mb-10">
      <h2 className="text-[13px] font-semibold text-ink mb-1">Request a Review</h2>
      <p className="text-[11px] text-stone mb-5">Send a review request email to any customer — no order needed.</p>

      <form onSubmit={send} className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="sofia@example.com"
            className="border border-gray-200 px-3 py-2 text-[12px] text-ink outline-none focus:border-teal transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone">Customer name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Sofia"
            className="border border-gray-200 px-3 py-2 text-[12px] text-ink outline-none focus:border-teal transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone">Product</label>
          <input
            type="text"
            value={product}
            onChange={e => setProduct(e.target.value)}
            placeholder="Dachshund"
            className="border border-gray-200 px-3 py-2 text-[12px] text-ink outline-none focus:border-teal transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending' || !email.trim()}
          className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase bg-teal text-white hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send Request'}
        </button>
        {status === 'error' && <p className="text-[11px] text-red-500 self-end">Failed to send.</p>}
      </form>
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-500',
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<DbTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    setSaving(id)
    await fetch('/api/admin/testimonials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await load()
    setSaving(null)
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial permanently?')) return
    setSaving(id)
    await fetch('/api/admin/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
    setSaving(null)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)
  const pendingCount = items.filter(i => i.status === 'pending').length

  if (loading) return (
    <div>
      <RequestReviewPanel />
      <p className="text-[13px] text-stone">Loading…</p>
    </div>
  )

  return (
    <div>
      <RequestReviewPanel />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Testimonials</h1>
          {pendingCount > 0 && (
            <p className="text-[12px] text-amber-600 mt-1">{pendingCount} pending approval</p>
          )}
        </div>
        <p className="text-[12px] text-stone">{items.length} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors capitalize ${filter === f ? 'bg-ink text-white border-ink' : 'border-gray-200 text-stone hover:border-ink hover:text-ink'}`}>
            {f}
            {f !== 'all' && <span className="ml-1.5 opacity-60">({items.filter(i => i.status === f).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <p className="text-[13px] text-stone">No {filter === 'all' ? '' : filter} testimonials.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-ink">{item.name}</p>
                    {item.location && <p className="text-[11px] text-stone">· {item.location}</p>}
                    <span className={`text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.product_name && (
                    <p className="text-[11px] text-teal">✦ {item.product_name}</p>
                  )}
                  <p className="text-[10px] text-stone">
                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <p className="text-[14px] leading-relaxed text-ink italic border-l-2 border-teal/30 pl-3">
                "{item.text}"
              </p>

              {/* Photos */}
              {item.media_urls?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {item.media_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 overflow-hidden bg-gray-50 hover:opacity-80 transition-opacity">
                      <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                    </a>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                {saving === item.id ? (
                  <span className="text-[11px] text-stone">Saving…</span>
                ) : (
                  <>
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                    {item.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(item.id, 'pending')}
                        className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border border-gray-200 text-stone hover:border-ink hover:text-ink transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => remove(item.id)}
                      className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 text-red-400 hover:text-red-600 transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
