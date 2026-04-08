import ProductsClient from '@/components/products/ProductsClient'
import ProductsHeader from '@/components/products/ProductsHeader'
import { getProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'The Collection',
  description: 'Handmade crochet amigurumis, accessories and clothing from Portugal — each piece one of a kind, each inspired by a real animal.',
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ProductsHeader />
        <div className="mt-10">
          <ProductsClient products={products} />
        </div>
      </div>
    </main>
  )
}
