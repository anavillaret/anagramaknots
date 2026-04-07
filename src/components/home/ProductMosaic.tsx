'use client'

import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Watermark from '@/components/ui/Watermark'
import { FEATURED_PRODUCTS } from '@/lib/products'
import { useLang } from '@/lib/i18n/context'

export default function ProductMosaic() {
  const { t } = useLang()
  const m = t.home.mosaic

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
          className="hidden md:inline-flex text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
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
              src={FEATURED_PRODUCTS[0].image}
              alt={FEATURED_PRODUCTS[0].name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <Watermark />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/80 mb-1">
                ※ {FEATURED_PRODUCTS[0].name}
              </p>
              <p className="text-white text-sm leading-snug line-clamp-2 max-w-xs">
                {FEATURED_PRODUCTS[0].fact}
              </p>
              <Link
                href={`/products/${FEATURED_PRODUCTS[0].slug}`}
                className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-white border border-white/60 px-4 py-2 hover:bg-white hover:text-ink transition-all duration-200"
              >
                Shop Now — €{FEATURED_PRODUCTS[0].price}
              </Link>
            </div>
          </div>
        </div>

        {/* Three smaller cards */}
        {FEATURED_PRODUCTS.slice(1, 4).map(product => (
          <div key={product.id} className="col-span-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile "View All" */}
      <div className="mt-10 flex justify-center md:hidden">
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
