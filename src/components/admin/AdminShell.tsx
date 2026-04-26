'use client'

import AdminGuard from './AdminGuard'
import { LogoSymbol } from '@/components/ui/Logo'
import { useLang } from '@/lib/i18n/context'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/admin" className="flex items-center gap-2.5">
              <LogoSymbol size={22} />
              <span className="text-[13px] font-semibold tracking-widest uppercase text-ink">Anagrama</span>
            </a>
            <nav className="flex items-center gap-4">
              <a href="/admin" className="text-[12px] text-stone hover:text-ink transition-colors">Dashboard</a>
              <a href="/admin/products" className="text-[12px] text-stone hover:text-ink transition-colors">Products</a>
              <a href="/admin/orders" className="text-[12px] text-stone hover:text-ink transition-colors">Orders</a>
              <a href="/admin/events" className="text-[12px] text-stone hover:text-ink transition-colors">Events</a>
              <a href="/admin/hero" className="text-[12px] text-stone hover:text-ink transition-colors">Hero</a>
              <a href="/admin/partners" className="text-[12px] text-stone hover:text-ink transition-colors">Partners</a>
              <span className="text-gray-300 select-none">|</span>
              <span className="text-[10px] text-stone/50 uppercase tracking-[0.1em]">Content</span>
              <a href="/admin/content/home" className="text-[12px] text-teal/70 hover:text-teal transition-colors">Home</a>
              <a href="/admin/content/story" className="text-[12px] text-teal/70 hover:text-teal transition-colors">Story</a>
              <a href="/admin/content/shipping" className="text-[12px] text-teal/70 hover:text-teal transition-colors">Shipping</a>
              <a href="/admin/content/commission" className="text-[12px] text-teal/70 hover:text-teal transition-colors">Commission</a>
              <a href="/admin/content/contact" className="text-[12px] text-teal/70 hover:text-teal transition-colors">Contact</a>
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

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">{children}</main>

        <footer className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
          <p className="text-[11px] text-stone">© {new Date().getFullYear()} Anagrama Art in Knots. {t.footer.rights}</p>
          <p className="text-[11px] text-stone italic">{t.footer.tagline}</p>
        </footer>
      </div>
    </AdminGuard>
  )
}
