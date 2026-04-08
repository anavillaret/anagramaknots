import Link from 'next/link'
import BrandSymbol from '@/components/ui/BrandSymbol'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-linen">

      {/* Symbol */}
      <div className="mb-8 opacity-30">
        <BrandSymbol size={48} />
      </div>

      {/* Headline */}
      <p className="text-[11px] tracking-[0.35em] uppercase text-teal mb-4">
        404 — Lost stitch
      </p>
      <h1 className="text-4xl md:text-5xl font-semibold text-ink tracking-tight leading-tight max-w-lg">
        We&rsquo;re still<br />
        <em className="font-normal not-italic text-teal">stitching this page.</em>
      </h1>
      <p className="mt-5 text-[14px] text-stone leading-relaxed max-w-sm">
        The page you&rsquo;re looking for doesn&rsquo;t exist — but every knot leads somewhere. Let&rsquo;s find yours.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/products"
          className="bg-teal text-white text-[11px] tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-teal-dark transition-colors"
        >
          Browse the collection
        </Link>
        <Link
          href="/"
          className="text-[11px] tracking-[0.15em] uppercase text-stone hover:text-ink transition-colors border-b border-stone-light pb-0.5"
        >
          Back to home
        </Link>
      </div>

    </main>
  )
}
