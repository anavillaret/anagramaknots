'use client'

import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Watermark from '@/components/ui/Watermark'
import BrandSymbol from '@/components/ui/BrandSymbol'
import { Product } from '@/lib/products'
import { useLang } from '@/lib/i18n/context'

export default function ProductMosaic({ products }: { products: Product[] }) {
  const { t } = useLang()
  const m = t.home.mosaic

  // First 4 products: first one gets the large card, next 3 get small cards
  const featured = products.slice(0, 4)
  const hero = featured[0]
  const rest = featured.slice(1, 4)

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

      {/* Asymmetric grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {/* Large card — col-span-2 */}
        <div className="col-span-2 row-span-1">
          <div className="relative overflow-hidden bg-linen aspect-[4/3] group">
            <img
              src={hero.image}
              alt={hero.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
              <Link
                href={`/products/${hero.slug}`}
                className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-white border border-white/60 px-4 py-2 hover:bg-white hover:text-ink transition-all duration-200"
              >
                {hero.badge === 'soldout' ? 'View · Sold' : hero.availableOnRequest ? 'Commission this piece' : `Shop Now — €${hero.price}`}
              </Link>
            </div>
          </div>
        </div>

        {/* Three smaller cards */}
        {rest.map(product => (
          <div key={product.id} className="col-span-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile/tablet "View All" */}
      <div className="mt-10 flex justify-center lg:hidden">
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
