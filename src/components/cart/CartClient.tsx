'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useLang } from '@/lib/i18n/context'
import { SHOP_OPEN } from '@/lib/siteConfig'
import BrandSymbol from '@/components/ui/BrandSymbol'
import Eyebrow from '@/components/ui/Eyebrow'
import { FX, CURRENCIES } from '@/lib/fx'

export default function CartClient() {
  const { items, removeItem, total } = useCart()
  const { t, lang } = useLang()
  const c = t.cart
  const [currency, setCurrency] = useState('eur')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const rate = FX[currency] ?? 1
  const sym = CURRENCIES.find(cur => cur.code === currency)?.symbol ?? '€'

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, currency }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="pt-36 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-4">{c.eyebrow}</Eyebrow>
        <h1 className="text-3xl font-semibold text-ink">{c.empty.heading}</h1>
        <p className="mt-3 text-[14px] text-stone">{c.empty.sub}</p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors"
        >
          {c.empty.cta}
        </Link>
      </main>
    )
  }

  return (
    <main className="pt-36 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-3">{c.eyebrow}</Eyebrow>
        <h1 className="text-3xl font-semibold text-ink mb-10">
          {items.length} {items.length === 1 ? 'piece' : 'pieces'}
        </h1>

        {/* Items */}
        <div className="flex flex-col divide-y divide-stone-light">
          {items.map(({ product, personalisation }) => (
            <div key={product.id} className="flex gap-5 py-6">
              <Link href={`/products/${product.slug}`} className="shrink-0">
                <div className="relative w-24 h-24 overflow-hidden bg-linen">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-teal flex items-center gap-1.5"><BrandSymbol size={12} />{lang === 'pt' && product.namePt ? product.namePt : product.name}</p>
                    {product.species && (
                      <p className="text-[11px] text-stone italic">{product.species}</p>
                    )}
                    {personalisation && (
                      <p className="text-[11px] text-stone mt-1">
                        <span className="not-italic text-ink">{c.note}</span> {personalisation}
                      </p>
                    )}
                    <p className="text-[10px] tracking-[0.12em] uppercase text-stone mt-2">
                      {c.oneOfAKind}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-stone hover:text-ink transition-colors mt-0.5"
                    aria-label="Remove"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="mt-auto pt-3 text-[14px] font-medium text-ink">
                  {sym}{(product.price * rate).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 border-t border-stone-light pt-8 flex flex-col items-end gap-5">

          {/* Currency selector */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-[0.1em] uppercase text-stone">{c.currency}</span>
            <div className="flex items-center border border-stone-light">
              {CURRENCIES.map((cur, i) => (
                <button
                  key={cur.code}
                  onClick={() => setCurrency(cur.code)}
                  className={`text-[11px] tracking-[0.08em] px-3 py-1.5 transition-colors duration-150 ${
                    i > 0 ? 'border-l border-stone-light' : ''
                  } ${
                    currency === cur.code
                      ? 'bg-ink text-white'
                      : 'text-stone hover:text-ink hover:bg-linen'
                  }`}
                >
                  {cur.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 text-[13px]">
            <span className="text-stone">{c.subtotal}</span>
            <span className="font-semibold text-ink text-[18px]">
              {sym}{(total() * rate).toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-stone text-right">
            {c.shipping}
          </p>

          {error && (
            <p className="text-[12px] text-rose text-right">{error}</p>
          )}

          {/* T&C agreement */}
          <label className="flex items-start gap-2.5 cursor-pointer group w-full md:w-auto">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 shrink-0 accent-teal w-4 h-4"
            />
            <span className="text-[11px] text-stone leading-relaxed">
              {c.agreePrefix}{' '}
              <Link href="/terms" className="text-teal underline underline-offset-2 hover:text-teal-dark transition-colors">{c.agreeTerms}</Link>
              {' '}{c.agreeAnd}{' '}
              <Link href="/privacy" className="text-teal underline underline-offset-2 hover:text-teal-dark transition-colors">{c.agreePrivacy}</Link>
            </span>
          </label>

          {SHOP_OPEN ? (
            <button
              onClick={handleCheckout}
              disabled={loading || !agreed}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-14 py-4 hover:bg-teal-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> {t.cart.checkout}…</>
              ) : (
                c.checkout
              )}
            </button>
          ) : (
            <div className="w-full md:w-auto text-center border border-stone-light px-14 py-4">
              <p className="text-[11px] tracking-[0.15em] uppercase text-stone">{t.product.shopSoon}</p>
              <p className="text-[11px] text-stone mt-1">
                {t.product.wantThis}{' '}
                <a href="/commission" className="text-teal underline underline-offset-2 hover:text-teal-dark">{t.product.commissionIt}</a>
              </p>
            </div>
          )}

          <Link
            href="/products"
            className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
          >
            {c.continueShopping}
          </Link>
        </div>
      </div>
    </main>
  )
}
