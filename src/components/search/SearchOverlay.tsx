'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BrandSymbol from '@/components/ui/BrandSymbol'
import { X, Search } from 'lucide-react'
import { Product } from '@/lib/products'
import { useLang } from '@/lib/i18n/context'

function matchesQuery(product: Product, query: string): boolean {
  const q = query.toLowerCase()
  return (
    product.name.toLowerCase().includes(q) ||
    (product.namePt?.toLowerCase().includes(q) ?? false) ||
    product.species.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q)
  )
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLang()
  const s = t.search
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const CATEGORIES = [
    { value: 'all', label: s.filters.all },
    { value: 'amigurumis', label: s.filters.amigurumis },
  ]

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Fetch live products from the API
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => {})
  }, [])

  const results = products.filter(p => {
    const categoryMatch = category === 'all' || p.category === category
    const queryMatch = query.trim() === '' || matchesQuery(p, query)
    return categoryMatch && queryMatch
  })

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      <div
        className="bg-white w-full px-6 py-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Search size={18} className="text-stone shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={s.placeholder}
            className="flex-1 text-[15px] text-ink placeholder:text-stone-light outline-none bg-transparent"
          />
          <button onClick={onClose} className="text-stone hover:text-ink transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Category pills */}
        <div className="max-w-3xl mx-auto mt-4 flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`text-[10px] tracking-[0.18em] uppercase px-3.5 py-1.5 rounded-full border transition-colors ${
                category === cat.value
                  ? 'bg-teal text-white border-teal'
                  : 'border-stone-light text-stone hover:border-ink hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div
        className="flex-1 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {results.length === 0 ? (
          <div className="max-w-3xl mx-auto px-6 py-12 text-center">
            <p className="text-[13px] text-stone">{s.noResults} &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="group flex flex-col gap-2"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-teal flex items-center gap-1.5">
                    <BrandSymbol size={11} />{lang === 'pt' && product.namePt ? product.namePt : product.name}
                  </p>
                  {product.species && (
                    <p className="text-[10px] text-stone italic">{product.species}</p>
                  )}
                  <p className="text-[11px] text-teal mt-0.5">€{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
