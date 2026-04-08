'use client'

import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { LogoSymbol } from '@/components/ui/Logo'
import SearchOverlay from '@/components/search/SearchOverlay'
import CartIcon from '@/components/nav/CartIcon'
import { useLang } from '@/lib/i18n/context'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  const navLinks = [
    { href: '/products', label: t.nav.products },
    { href: '/story', label: t.nav.story },
    { href: '/shipping', label: t.nav.shipping },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div style={{ backgroundColor: '#111', color: '#fff', padding: '8px 16px', textAlign: 'center', fontSize: '11px', letterSpacing: '0.12em' }}>
          ※ The shop is coming soon — browse freely and{' '}
          <a href="/commission" style={{ textDecoration: 'underline', color: 'inherit' }}>commission a piece</a>
          . Purchases will open shortly.
        </div>
        <div className="bg-white/95 backdrop-blur-sm border-b border-stone-light">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Mobile menu button */}
          <button
            className="md:hidden text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo — centered */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 group"
            aria-label="Anagrama — Art in Knots"
          >
            <LogoSymbol size={28} />
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink group-hover:text-teal transition-colors duration-200">
                Anagrama
              </span>
              <span className="text-[8px] tracking-[0.22em] uppercase text-stone mt-0.5">
                Art in Knots
              </span>
            </div>
          </Link>

          {/* Desktop nav — left */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.slice(0, 2).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop nav — right */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.slice(2).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Language toggle */}
            <div className="flex items-center border border-stone-light text-[10px] tracking-[0.1em] uppercase overflow-hidden">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-ink text-white' : 'text-stone hover:text-ink'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('pt')}
                className={`px-2 py-1 border-l border-stone-light transition-colors ${lang === 'pt' ? 'bg-ink text-white' : 'text-stone hover:text-ink'}`}
              >
                PT
              </button>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="text-ink hover:text-teal transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <CartIcon size={18} />
          </div>

          {/* Mobile: search + cart only */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-ink hover:text-teal transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <CartIcon size={20} />
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-stone-light bg-white px-6 py-6 flex flex-col gap-5">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[12px] tracking-[0.2em] uppercase text-ink hover:text-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Language toggle in drawer */}
            <div className="flex items-center border border-stone-light text-[10px] tracking-[0.1em] uppercase overflow-hidden w-fit mt-2">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 transition-colors ${lang === 'en' ? 'bg-ink text-white' : 'text-stone'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('pt')}
                className={`px-2.5 py-1.5 border-l border-stone-light transition-colors ${lang === 'pt' ? 'bg-ink text-white' : 'text-stone'}`}
              >
                PT
              </button>
            </div>
          </nav>
        )}
        </div>{/* end bg-white div */}
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
