import Hero from '@/components/home/Hero'
import ProductMosaic from '@/components/home/ProductMosaic'
import StoryTeaser from '@/components/home/StoryTeaser'
import MadeForYouTeaser from '@/components/home/MadeForYouTeaser'
import InstagramStrip from '@/components/home/InstagramStrip'
import PartnersStrip from '@/components/home/PartnersStrip'
import TestimonialsStrip from '@/components/home/TestimonialsStrip'
import { getProducts } from '@/lib/products'
import { getHeroProducts } from '@/lib/heroConfig'
import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/siteConfig'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Anagrama — Art in Knots | Handmade Crochet Amigurumis from Portugal',
  description:
    'Shop unique handmade crochet amigurumis from Portugal. Each piece is one of a kind — named after a real animal, carrying its story. Custom commissions open year-round. Amigurumi Portugal · Peluche crochet artesanal · Regalo artesanal único.',
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: 'Anagrama — Art in Knots | Handmade Crochet Amigurumis',
    description:
      'Unique handmade crochet amigurumis from Portugal. Each piece named after a real animal. Custom commissions welcome.',
    url: `${SITE_URL}/`,
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
      <TestimonialsStrip />
      <InstagramStrip />
    </>
  )
}
