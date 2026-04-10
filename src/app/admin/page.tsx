'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, available: 0, sold: 0, onRequest: 0, orders: 0, revenue: 0 })

  useEffect(() => {
    async function load() {
      const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from('products').select('badge,available_on_request,price,active').eq('active', true),
        supabase.from('orders').select('status,total_amount'),
      ])
      if (products) {
        setStats({
          products: products.length,
          available: products.filter(p => !p.available_on_request && p.badge !== 'soldout').length,
          sold: products.filter(p => p.badge === 'soldout').length,
          onRequest: products.filter(p => p.available_on_request).length,
          orders: orders?.filter(o => o.status !== 'cancelled').length ?? 0,
          revenue: orders?.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0,
        })
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, color: 'text-ink' },
    { label: 'Available Now', value: stats.available, color: 'text-teal' },
    { label: 'Sold', value: stats.sold, color: 'text-stone' },
    { label: 'Commission Only', value: stats.onRequest, color: 'text-amber-600' },
    { label: 'Orders', value: stats.orders, color: 'text-ink' },
    { label: 'Revenue', value: `€${stats.revenue.toFixed(0)}`, color: 'text-teal' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-gray-100 p-6 rounded-sm">
            <p className="text-[11px] tracking-[0.15em] uppercase text-stone mb-2">{c.label}</p>
            <p className={`text-3xl font-semibold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <a href="/admin/products" className="bg-white border border-gray-100 p-6 rounded-sm hover:border-teal transition-colors group">
          <p className="text-[11px] tracking-[0.15em] uppercase text-teal mb-2 group-hover:text-teal-dark">Products →</p>
          <p className="text-[13px] text-stone">Add, edit, mark as sold, reorder, upload images.</p>
        </a>
        <a href="/admin/orders" className="bg-white border border-gray-100 p-6 rounded-sm hover:border-teal transition-colors group">
          <p className="text-[11px] tracking-[0.15em] uppercase text-teal mb-2 group-hover:text-teal-dark">Orders →</p>
          <p className="text-[13px] text-stone">View all orders, update shipping status.</p>
        </a>
      </div>
    </div>
  )
}
