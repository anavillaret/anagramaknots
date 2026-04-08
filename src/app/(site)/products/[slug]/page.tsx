import { notFound } from 'next/navigation'
import { getProducts } from '@/lib/products'
import ProductDetail from '@/components/products/ProductDetail'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find(p => p.slug === slug)
  if (!product) return {}

  const title = product.name
  const description = product.fact
    ? `${product.fact} One of a kind, handmade in Portugal by Anagrama Art in Knots.`
    : `Handmade ${product.name} crochet amigurumi by Anagrama — one of a kind, made in Portugal.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  const related = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  return <ProductDetail product={product} related={related} />
}
