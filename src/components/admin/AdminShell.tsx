'use client'

import AdminGuard from './AdminGuard'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-semibold tracking-widest uppercase text-ink">※ Anagrama</span>
            <nav className="flex items-center gap-4">
              <a href="/admin" className="text-[12px] text-stone hover:text-ink transition-colors">Dashboard</a>
              <a href="/admin/products" className="text-[12px] text-stone hover:text-ink transition-colors">Products</a>
              <a href="/admin/orders" className="text-[12px] text-stone hover:text-ink transition-colors">Orders</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-[11px] text-stone hover:text-ink transition-colors">← View site</a>
            <button
              onClick={() => { localStorage.removeItem('admin_auth'); window.location.reload() }}
              className="text-[11px] text-stone hover:text-ink transition-colors"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
      </div>
    </AdminGuard>
  )
}
