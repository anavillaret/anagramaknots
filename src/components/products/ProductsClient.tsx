'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import Watermark from '@/components/ui/Watermark'
import BrandSymbol from '@/components/ui/BrandSymbol'
import { useLang } from '@/lib/i18n/context'

export default function ProductsClient({ products }: { products: Product[] }) {
  const { t } = useLang()
  const p = t.products
  const [filter, setFilter] = useState<'all' | 'available'>('all')

  const filtered = filter === 'available'
    ? products.filter(prod => prod.badge !== 'soldout' && !prod.availableOnRequest)
    : products

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-10">
        {(['all', 'available'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] tracking-[0.18em] uppercase px-4 py-1.5 border transition-colors ${
              filter === f
                ? 'bg-teal text-white border-teal'
                : 'border-stone-light text-stone hover:border-teal hover:text-teal'
            }`}
          >
            {f === 'all' ? p.filterAll : p.filterAvailable}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {filtered.map(product => {
          const isSold = product.badge === 'soldout'
          const isOnRequest = product.availableOnRequest === true
          const isUnavailable = isSold || isOnRequest
          const commissionHref = `/commission?ref=${encodeURIComponent(product.name)}&type=Amigurumi&image=${encodeURIComponent(product.image)}`

          return (
            <div key={product.id} className="flex flex-col">
              {/* Image + name → product page */}
              <Link href={`/products/${product.slug}`} className="group flex flex-col">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Status tag */}
                  {isUnavailable && (
                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] tracking-[0.2em] uppercase px-2 py-1 font-medium ${
                        isSold
                          ? 'bg-stone text-white'
                          : 'bg-teal text-white'
                      }`}>
                        {isSold ? p.tagSold : p.tagCommission}
                      </span>
                    </div>
                  )}
                  <Watermark />
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <p className="text-[13px] font-medium text-teal transition-colors flex items-center gap-1.5">
                    <BrandSymbol size={12} />
                    {product.name}
                  </p>
                  {!isUnavailable && (
                    <p className="text-[13px] font-medium text-ink shrink-0">€{product.price}</p>
                  )}
                </div>
                {product.species && (
                  <p className="text-[11px] text-stone italic mt-0.5">{product.species}</p>
                )}
              </Link>

              {/* Commission CTA — separate link, not nested inside above */}
              {isUnavailable && (
                <Link
                  href={commissionHref}
                  className="mt-2 text-[11px] text-teal hover:text-teal-dark transition-colors tracking-wide"
                >
                  {isSold ? p.commissionSimilar : p.commissionThis}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-[13px] text-stone py-16 text-center">{p.empty}</p>
      )}
    </>
  )
}
