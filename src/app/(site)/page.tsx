import Hero from '@/components/home/Hero'
import ProductMosaic from '@/components/home/ProductMosaic'
import StoryTeaser from '@/components/home/StoryTeaser'
import MadeForYouTeaser from '@/components/home/MadeForYouTeaser'
import InstagramStrip from '@/components/home/InstagramStrip'
import { getProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <Hero />
      <ProductMosaic products={products} />
      <StoryTeaser />
      <MadeForYouTeaser />
      <InstagramStrip />
    </>
  )
}
