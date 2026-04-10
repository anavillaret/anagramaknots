'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Watermark from '@/components/ui/Watermark'
import BrandSymbol from '@/components/ui/BrandSymbol'
import { Product } from '@/lib/products'
import { useLang } from '@/lib/i18n/context'

export default function ProductMosaic({ products }: { products: Product[] }) {
  const { t } = useLang()
  const m = t.home.mosaic

  // Available pieces first, then commission/on-request, then sold — so homepage shows what can be bought
  const sorted = [...products].sort((a, b) => {
    const rank = (p: Product) => {
      if (p.badge === 'soldout') return 2
      if (p.availableOnRequest) return 1
      return 0
    }
    return rank(a) - rank(b)
  })

  const featured = sorted.slice(0, 7)
  const hero = featured[0]
  const row1 = featured.slice(1, 3)   // 2 cards alongside the hero
  const row2 = featured.slice(3, 7)   // 4 cards in second row

  if (!hero) return null

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-2">
            {m.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold text-ink tracking-tight">
            {m.heading}
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden lg:inline-flex text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
        >
          {m.cta}
        </Link>
      </div>

      {/* Row 1 — large hero + 2 small */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-5 md:mb-6">
        {/* Hero card — spans 2 cols */}
        <div className="col-span-2">
          <Link href={`/products/${hero.slug}`} className="block group">
            <div className="relative overflow-hidden bg-linen aspect-[3/4] md:aspect-[4/5]">
              <Image
                src={hero.image}
                alt={hero.name}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <Watermark />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/80 mb-1 flex items-center gap-1.5">
                  <BrandSymbol size={10} className="opacity-80" />
                  {hero.name}
                </p>
                <p className="text-white text-sm leading-snug line-clamp-2 max-w-xs">
                  {hero.fact}
                </p>
                <span className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-white border border-white/60 px-4 py-2 group-hover:bg-white group-hover:text-ink transition-all duration-200">
                  {hero.badge === 'soldout' ? m.viewSold : hero.availableOnRequest ? m.commissionPiece : `${m.shopNow} — €${hero.price}`}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* 2 small cards in row 1 */}
        {row1.map(product => (
          <div key={product.id} className="col-span-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Row 2 — 4 small cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {row2.map(product => (
          <div key={product.id} className="col-span-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* "View All" CTA */}
      <div className="mt-10 flex justify-center lg:justify-end">
        <Link
          href="/products"
          className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
        >
          {m.cta}
        </Link>
      </div>
    </section>
  )
}
