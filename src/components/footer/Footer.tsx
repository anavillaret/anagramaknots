'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { INSTAGRAM_URL, EMAIL } from '@/lib/tokens'
import { LogoFull } from '@/components/ui/Logo'
import { useLang } from '@/lib/i18n/context'

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

export default function Footer() {
  const { t } = useLang()

  const navLinks = [
    { href: '/products', label: t.nav.products },
    { href: '/story', label: t.nav.story },
    { href: '/shipping', label: t.nav.shipping },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <footer className="border-t border-stone-light bg-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo mark */}
          <Link href="/" aria-label="Anagrama — Art in Knots">
            <LogoFull width={100} />
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone hover:text-teal transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="text-stone hover:text-teal transition-colors"
              aria-label="Email"
            >
              <Mail size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-stone-light flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-wide text-stone">
            © {new Date().getFullYear()} Anagrama Art in Knots. {t.footer.rights}
          </p>
          <p className="text-[10px] tracking-wide text-stone italic">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
