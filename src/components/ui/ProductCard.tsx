'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import Badge from './Badge'
import Watermark from './Watermark'
import BrandSymbol from './BrandSymbol'
import type { Product } from '@/lib/products'
import { useLang } from '@/lib/i18n/context'
import { useCart } from '@/lib/cart'
import { SHOP_OPEN } from '@/lib/siteConfig'

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useLang()
  const { addItem, hasItem } = useCart()
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const isAvailable = SHOP_OPEN && product.badge !== 'soldout' && !product.availableOnRequest
  const inCart = hasItem(product.id)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inCart || added) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — click → PDP */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-[3/4]">
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

        {/* Quick add — only for truly available products */}
        {isAvailable && (
          <button
            onClick={handleAddToCart}
            className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between transition-all duration-300 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } ${inCart || added ? 'bg-teal/10' : ''}`}
          >
            <span className="text-[10px] tracking-[0.15em] uppercase text-ink">
              {inCart || added ? t.product.inCart ?? 'In cart' : t.product.addToCart}
            </span>
            {inCart || added
              ? <Check size={15} strokeWidth={1.5} className="text-teal" />
              : <ShoppingBag size={15} strokeWidth={1.5} className="text-teal" />
            }
          </button>
        )}
      </Link>

      {/* Info — click → PDP */}
      <Link href={`/products/${product.slug}`} className="mt-3 flex flex-col gap-0.5">
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
      </Link>
    </div>
  )
}
