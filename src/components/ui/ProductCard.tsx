'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import Badge from './Badge'
import Watermark from './Watermark'
import BrandSymbol from './BrandSymbol'
import type { Product } from '@/lib/products'
import { useLang } from '@/lib/i18n/context'
import { SHOP_OPEN } from '@/lib/siteConfig'

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useLang()
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge type={product.badge} />
          </div>
        )}

        <Watermark />

        {/* Quick add — appears on hover, only if not sold and shop is open */}
        {SHOP_OPEN && product.badge !== 'soldout' && (
          <div
            className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between transition-all duration-300 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <span className="text-[10px] tracking-[0.15em] uppercase text-ink">
              {t.product.addToCart}
            </span>
            <ShoppingBag size={15} strokeWidth={1.5} className="text-teal" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[12px] font-semibold tracking-wide text-teal transition-colors flex items-center gap-1.5 uppercase">
              <BrandSymbol size={11} />
              {lang === 'pt' && product.namePt ? product.namePt : product.name}
            </p>
            {product.species && (
              <p className="text-[10px] tracking-wide text-stone italic mt-0.5">
                {product.species}
              </p>
            )}
          </div>
          {product.badge !== 'soldout' && !product.availableOnRequest && (
            <p className="text-[12px] font-semibold text-ink shrink-0">
              €{product.price}
            </p>
          )}
        </div>

        {product.fact && (
          <p className="text-[10px] leading-relaxed text-stone mt-1 line-clamp-2">
            {lang === 'pt' && product.factPt ? product.factPt : product.fact}
          </p>
        )}
      </div>
    </Link>
  )
}
