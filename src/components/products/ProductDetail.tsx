'use client'

import { useState } from 'react' // eslint-disable-line
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Check } from 'lucide-react'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart'
import Badge from '@/components/ui/Badge'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addItem, hasItem } = useCart()
  const { t } = useLang()
  const p = t.product
  const [justAdded, setJustAdded] = useState(false)

  const isSold = product.badge === 'soldout'
  const isOnRequest = product.availableOnRequest === true
  const inCart = hasItem(product.id)

  const handleAdd = () => {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  // Commission form URL with product pre-filled
  const commissionHref = `/commission?ref=${encodeURIComponent(product.name)}&type=${encodeURIComponent(
    product.category === 'amigurumis' ? 'Amigurumi' :
    product.category === 'acessorios' ? 'Accessory' : 'Clothing'
  )}&image=${encodeURIComponent(product.image)}`

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-stone mb-8">
          <Link href="/products" className="hover:text-ink transition-colors">{t.nav.products}</Link>
          <span>·</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Image */}
          <div className="relative overflow-hidden">
            <Image src={product.image} alt={product.name} width={800} height={1000} className="w-full h-auto" priority />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge type={product.badge} />
              </div>
            )}
            {isSold && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-[11px] tracking-[0.35em] uppercase text-ink font-semibold border border-ink px-5 py-2">
                  {p.soldOut}
                </span>
              </div>
            )}
            <Watermark />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.species && (
              <p className="text-[15px] tracking-[0.25em] uppercase font-bold text-teal mb-2">
                {product.species}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">
              ※ {product.name}
            </h1>
            {product.badge !== 'soldout' && !product.availableOnRequest && (
              <p className="mt-4 text-2xl font-medium text-ink">€{product.price}</p>
            )}

            {product.fact && (
              <div className="mt-6 border-l-2 border-teal pl-4">
                <p className="text-[13px] leading-relaxed text-stone italic">{product.fact}</p>
              </div>
            )}

            {isSold ? (
              /* Sold state */
              <div className="mt-8 flex flex-col gap-4">
                <p className="text-[13px] text-stone leading-relaxed">
                  This piece has found its home. Every piece is unique — but Ana can create something inspired by it, entirely your own.
                </p>
                <Link
                  href={commissionHref}
                  className="flex items-center justify-center gap-3 py-4 bg-ink text-white text-[11px] tracking-[0.2em] uppercase hover:bg-stone transition-colors duration-200"
                >
                  {p.requestSimilar}
                </Link>
              </div>
            ) : isOnRequest ? (
              /* Available on request state */
              <div className="mt-8 flex flex-col gap-4">
                <p className="text-[13px] text-stone leading-relaxed">
                  This piece is made to order. Tell Ana what you have in mind and she will bring it to life — just for you.
                </p>
                <Link
                  href={commissionHref}
                  className="flex items-center justify-center gap-3 py-4 bg-teal text-white text-[11px] tracking-[0.2em] uppercase hover:bg-teal-dark transition-colors duration-200"
                >
                  Commission this piece
                </Link>
                <p className="text-[11px] text-stone text-center">
                  3–5 working days to reply · No commitment required
                </p>
              </div>
            ) : (
              /* Available state */
              <>
                <button
                  onClick={handleAdd}
                  disabled={inCart}
                  className={`mt-8 flex items-center justify-center gap-3 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                    inCart || justAdded
                      ? 'bg-teal/40 text-white cursor-default'
                      : 'bg-teal text-white hover:bg-teal-dark'
                  }`}
                >
                  {inCart ? (
                    <><Check size={16} strokeWidth={2} /> {p.inCart}</>
                  ) : justAdded ? (
                    <><Check size={16} strokeWidth={2} /> {p.inCart}</>
                  ) : (
                    <><ShoppingBag size={16} strokeWidth={1.5} /> {p.addToCart}</>
                  )}
                </button>

                <p className="mt-4 text-[11px] text-stone text-center">
                  <Link href={commissionHref} className="text-teal underline underline-offset-2 hover:text-teal-dark">
                    {p.commissionLink}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Details & Care */}
        {(product.details || product.careTips) && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-light pt-12">
            {product.details && (
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-semibold mb-3">{p.details}</p>
                <p className="text-[13px] leading-relaxed text-stone">{product.details}</p>
              </div>
            )}
            {product.careTips && (
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-semibold mb-3">{p.care}</p>
                <p className="text-[13px] leading-relaxed text-stone">{product.careTips}</p>
              </div>
            )}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-stone-light pt-12">
            <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-8">{p.relatedEyebrow}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.id} href={`/products/${r.slug}`} className="group flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image src={r.image} alt={r.name} width={400} height={500} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                    {r.badge === 'soldout' && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <span className="text-[9px] tracking-[0.3em] uppercase text-ink border border-ink px-3 py-1">{p.soldOut}</span>
                      </div>
                    )}
                    <Watermark />
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-2">
                    <p className="text-[12px] font-medium text-ink group-hover:text-teal transition-colors">※ {r.name}</p>
                    {r.badge !== 'soldout' && (
                      <p className="text-[12px] text-ink shrink-0">€{r.price}</p>
                    )}
                  </div>
                  {r.species && <p className="text-[10px] text-stone italic mt-0.5">{r.species}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
