'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import BrandSymbol from '@/components/ui/BrandSymbol'
import Eyebrow from '@/components/ui/Eyebrow'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart'
import Badge from '@/components/ui/Badge'
import Watermark from '@/components/ui/Watermark'
import { useLang } from '@/lib/i18n/context'
import { SHOP_OPEN } from '@/lib/siteConfig'

type Lightbox = { photos: string[]; index: number } | null

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addItem, hasItem } = useCart()
  const { t, lang } = useLang()
  const p = t.product
  const [justAdded, setJustAdded] = useState(false)
  const [lightbox, setLightbox] = useState<Lightbox>(null)

  const allPhotos = [product.image, ...(product.images ?? []).filter(u => u && u !== product.image)]

  const openLightbox = (index: number) => setLightbox({ photos: allPhotos, index })
  const closeLightbox = () => setLightbox(null)

  const prev = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.photos.length) % lightbox.photos.length })
  }, [lightbox])

  const next = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.photos.length })
  }, [lightbox])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

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
    <>
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-stone mb-8">
          <Link href="/products" className="hover:text-ink transition-colors">{t.nav.products}</Link>
          <span>·</span>
          <span className="text-ink">{lang === 'pt' && product.namePt ? product.namePt : product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Image + Gallery */}
          <div>
            <button
              onClick={() => openLightbox(0)}
              className="relative overflow-hidden aspect-[3/4] w-full block cursor-zoom-in"
            >
              <Image src={product.image} alt={product.name} fill className="object-cover object-center hover:scale-[1.02] transition-transform duration-500" priority />
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
            </button>

            {/* Gallery thumbnails */}
            {allPhotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {allPhotos.slice(1, 5).map((url, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i + 1)}
                    className="relative aspect-square overflow-hidden bg-linen cursor-zoom-in"
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${i + 2}`}
                      fill
                      className="object-cover object-center hover:scale-[1.05] transition-transform duration-300"
                      sizes="15vw"
                    />
                    <Watermark />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.species && (
              <p className="text-[15px] tracking-[0.25em] uppercase font-bold text-teal mb-2">
                {product.species}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight flex items-center gap-3">
              <BrandSymbol size={28} className="shrink-0 mt-0.5" />
              <span className="text-teal uppercase">{lang === 'pt' && product.namePt ? product.namePt : product.name}</span>
            </h1>
            {product.badge !== 'soldout' && !product.availableOnRequest && (
              <p className="mt-4 text-2xl font-medium text-ink">€{product.price}</p>
            )}

            {product.fact && (
              <div className="mt-6 border-l-2 border-teal pl-4">
                <p className="text-[15px] leading-relaxed text-stone italic">
                  {lang === 'pt' && product.factPt ? product.factPt : product.fact}
                </p>
              </div>
            )}

            {isSold ? (
              /* Sold state */
              <div className="mt-8 flex flex-col gap-4">
                <p className="text-[13px] text-stone leading-relaxed">{p.soldMessage}</p>
                <Link
                  href={commissionHref}
                  className="flex items-center justify-center gap-3 py-4 bg-rose text-white text-[11px] tracking-[0.2em] uppercase hover:bg-rose-dark transition-colors duration-200"
                >
                  {p.requestSimilar}
                </Link>
              </div>
            ) : isOnRequest ? (
              /* Available on request state */
              <div className="mt-8 flex flex-col gap-4">
                <p className="text-[13px] text-stone leading-relaxed">{p.onRequestMessage}</p>
                <Link
                  href={commissionHref}
                  className="flex items-center justify-center gap-3 py-4 bg-rose text-white text-[11px] tracking-[0.2em] uppercase hover:bg-rose-dark transition-colors duration-200"
                >
                  {p.commissionThis}
                </Link>
                <p className="text-[11px] text-stone text-center">{p.commissionNote}</p>
              </div>
            ) : (
              /* Available state */
              <>
                {SHOP_OPEN ? (
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
                ) : (
                  <div className="mt-8 border border-stone-light py-4 text-center">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-stone">{p.shopSoon}</p>
                    <p className="text-[11px] text-stone mt-1">
                      {p.wantThis}{' '}
                      <Link href={commissionHref} className="text-rose underline underline-offset-2 hover:text-rose-dark">
                        {p.commissionIt}
                      </Link>
                    </p>
                  </div>
                )}

                <p className="mt-4 text-[11px] text-stone text-center">
                  <Link href={commissionHref} className="text-rose underline underline-offset-2 hover:text-rose-dark">
                    {p.commissionLink}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Details & Care */}
        {(product.details || product.size || product.careTips) && (
          <div className="mt-16 border-t border-stone-light pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

              {product.details && (
                <div className="py-6 md:py-0 md:pr-12">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-semibold mb-3">{p.materials}</p>
                  <p className="text-[13px] leading-relaxed text-stone">
                    {lang === 'pt' && product.detailsPt ? product.detailsPt : product.details}
                  </p>
                </div>
              )}

              {product.size && (
                <div className="py-6 md:py-0 md:px-12">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-semibold mb-3">{p.size}</p>
                  <p className="text-[13px] leading-relaxed text-stone">
                    {lang === 'pt' && product.sizePt ? product.sizePt : product.size}
                  </p>
                </div>
              )}

              {product.careTips && (
                <div className="py-6 md:py-0 md:pl-12">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-teal font-semibold mb-3">{p.care}</p>
                  <p className="text-[13px] leading-relaxed text-stone">
                    {lang === 'pt' && product.careTipsPt ? product.careTipsPt : product.careTips}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-stone-light pt-12">
            <Eyebrow className="text-[12px] tracking-[0.3em] uppercase text-teal mb-8">{p.relatedEyebrow}</Eyebrow>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.id} href={`/products/${r.slug}`} className="group flex flex-col">
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <Image src={r.image} alt={r.name} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
                    {r.badge === 'soldout' && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <span className="text-[9px] tracking-[0.3em] uppercase text-ink border border-ink px-3 py-1">{p.soldOut}</span>
                      </div>
                    )}
                    <Watermark />
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-2">
                    <p className="text-[12px] font-medium text-teal flex items-center gap-1.5"><BrandSymbol size={10} />{lang === 'pt' && r.namePt ? r.namePt : r.name}</p>
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

    {/* Lightbox */}
    {lightbox && (
      <div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={closeLightbox}
      >
        <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white p-2">
          <X size={28} />
        </button>

        {lightbox.photos.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white/80 hover:text-white p-2"
          >
            <ChevronLeft size={36} />
          </button>
        )}

        <div
          className="relative w-full h-full max-w-4xl max-h-[90vh] mx-16"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={lightbox.photos[lightbox.index]}
            alt=""
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
          <Watermark />
        </div>

        {lightbox.photos.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white/80 hover:text-white p-2"
          >
            <ChevronRight size={36} />
          </button>
        )}

        {lightbox.photos.length > 1 && (
          <div className="absolute bottom-4 flex gap-2">
            {lightbox.photos.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightbox({ ...lightbox, index: i }) }}
                className={`w-2 h-2 rounded-full transition-colors ${i === lightbox.index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    )}
    </>
  )
}
