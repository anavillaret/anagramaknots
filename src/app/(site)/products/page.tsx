import ProductsClient from '@/components/products/ProductsClient'
import ProductsHeader from '@/components/products/ProductsHeader'
import { getProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shop Handmade Crochet Amigurumis | The Collection',
  description: 'Browse our full collection of handmade crochet amigurumis from Portugal. Each piece is unique and one of a kind — crochet animals, artisan stuffed toys, and handmade gifts.',
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
