import ProductsClient from '@/components/products/ProductsClient'
import ProductsHeader from '@/components/products/ProductsHeader'

export const metadata = {
  title: 'The Collection',
  description: 'Handmade crochet amigurumis, accessories and clothing from Portugal — each piece one of a kind, each inspired by a real animal.',
}

export default function ProductsPage() {
  return (
    <main className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ProductsHeader />
        <div className="mt-10">
          <ProductsClient />
        </div>
      </div>
    </main>
  )
}
