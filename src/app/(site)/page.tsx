import Hero from '@/components/home/Hero'
import ProductMosaic from '@/components/home/ProductMosaic'
import StoryTeaser from '@/components/home/StoryTeaser'
import MadeForYouTeaser from '@/components/home/MadeForYouTeaser'
import InstagramStrip from '@/components/home/InstagramStrip'
import PartnersStrip from '@/components/home/PartnersStrip'
import { getProducts } from '@/lib/products'
import { getHeroProducts } from '@/lib/heroConfig'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Anagrama — Art in Knots | Handmade Crochet Amigurumis from Portugal',
  description:
    'Shop unique handmade crochet amigurumis from Portugal. Each piece is one of a kind — named after a real animal, carrying its story. Artisan gifts and custom crochet commissions.',
  openGraph: {
    title: 'Anagrama — Art in Knots',
    description:
      'Unique handmade crochet amigurumis from Portugal. Each piece named after a real animal.',
  },
}

export default async function HomePage() {
  const [products, heroProducts] = await Promise.all([getProducts(), getHeroProducts()])

  return (
    <>
      <Hero heroProducts={heroProducts} />
      <ProductMosaic products={products} />
      <StoryTeaser />
      <MadeForYouTeaser />
      <PartnersStrip />
      <InstagramStrip />
    </>
  )
}
