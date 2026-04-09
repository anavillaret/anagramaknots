import Hero from '@/components/home/Hero'
import ProductMosaic from '@/components/home/ProductMosaic'
import StoryTeaser from '@/components/home/StoryTeaser'
import MadeForYouTeaser from '@/components/home/MadeForYouTeaser'
import InstagramStrip from '@/components/home/InstagramStrip'
import PartnersStrip from '@/components/home/PartnersStrip'
import { getProducts } from '@/lib/products'
import { getHeroProducts } from '@/lib/heroConfig'

export const dynamic = 'force-dynamic'

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
