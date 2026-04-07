'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PRODUCTS } from '@/lib/products'
import Badge from '@/components/ui/Badge'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'

export default function ProductsClient() {
  const { t } = useLang()
  const f = t.products.filters
  const FILTERS = [
    { value: 'all', label: f.all },
    { value: 'amigurumis', label: f.amigurumis },
    { value: 'acessorios', label: f.accessories },
    { value: 'roupa', label: f.clothing },
  ]
  const [active, setActive] = useState('all')

  const filtered = active === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === active)

  return (
    <>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`text-[10px] tracking-[0.18em] uppercase px-4 py-2 rounded-full border transition-colors ${
              active === f.value
                ? 'bg-teal text-white border-teal'
                : 'border-stone-light text-stone hover:border-ink hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {filtered.map(product => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-linen">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.badge && (
                <div className="absolute top-2 left-2">
                  <Badge type={product.badge} />
                </div>
              )}
              <Watermark />
            </div>
            <div className="mt-3 flex flex-col gap-0.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-medium text-ink group-hover:text-teal transition-colors">
                  ※ {product.name}
                </p>
                {product.badge !== 'soldout' && (
                  <p className="text-[13px] font-medium text-ink shrink-0">€{product.price}</p>
                )}
              </div>
              {product.species && (
                <p className="text-[11px] text-stone italic">{product.species}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[13px] text-stone py-16 text-center">{t.products.empty}</p>
      )}
    </>
  )
}
