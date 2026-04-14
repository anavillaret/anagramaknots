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

  // Prioritise available-for-purchase pieces in the "You might also like" section
  const sameCategory = products.filter(p => p.id !== product.id && p.category === product.category)
  const availableFirst = sameCategory.filter(p => p.badge !== 'soldout' && !p.availableOnRequest)
  const others = sameCategory.filter(p => p.badge === 'soldout' || p.availableOnRequest)
  const related = [...availableFirst, ...others].slice(0, 3)

  const isSold = product.badge === 'soldout'
  const isOnRequest = product.availableOnRequest === true

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.fact
      ? `${product.fact} One of a kind, handmade in Portugal by Anagrama Art in Knots.`
      : `Handmade ${product.name} crochet amigurumi by Anagrama — one of a kind, made in Portugal.`,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'Anagrama',
      url: 'https://anagramaknots.com',
    },
    url: `https://anagramaknots.com/products/${product.slug}`,
    ...(product.category === 'amigurumis' && { category: 'Toys & Games > Stuffed Animals & Plush Toys' }),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: isSold || isOnRequest ? undefined : product.price,
      availability: isSold
        ? 'https://schema.org/SoldOut'
        : isOnRequest
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Anagrama',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  )
}
