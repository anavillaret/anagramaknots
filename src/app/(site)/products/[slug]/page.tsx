import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/lib/products'
import ProductDetail from '@/components/products/ProductDetail'

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.slug === slug)
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
  const product = PRODUCTS.find(p => p.slug === slug)
  if (!product) notFound()

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3)

  return <ProductDetail product={product} related={related} />
}
