import { notFound } from 'next/navigation'
import { getProducts } from '@/lib/products'
import { supabaseAdmin } from '@/lib/supabase'
import ProductDetail from '@/components/products/ProductDetail'
import { SITE_URL } from '@/lib/siteConfig'

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
    alternates: { canonical: `${SITE_URL}/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${slug}`,
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

const EU_COUNTRIES = ['FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'CH', 'PL', 'SE', 'NO', 'DK', 'FI', 'IE', 'GR', 'CZ', 'HU', 'RO', 'LU', 'SK', 'SI', 'HR', 'BG', 'LT', 'LV', 'EE', 'MT', 'CY']
const WORLD_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'BR', 'JP', 'MX', 'AE', 'SG', 'HK', 'NZ', 'ZA', 'IN', 'KR', 'IL', 'TR']

function makeShipping(price: number, currency: string, country: string, minTransit: number, maxTransit: number) {
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value: price.toFixed(2), currency },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: country },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: minTransit, maxValue: maxTransit, unitCode: 'DAY' },
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  type TestimonialRow = { id: string; name: string; text: string; created_at: string }
  const fetchTestimonials = async (): Promise<TestimonialRow[]> => {
    try {
      const { data } = await supabaseAdmin()
        .from('testimonials')
        .select('id, name, text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10)
      return (data ?? []) as TestimonialRow[]
    } catch {
      return []
    }
  }

  const [products, testimonials] = await Promise.all([getProducts(), fetchTestimonials()])

  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  // Related products: scored by ecosystem + animal group match, available-first within each score tier
  const others = products.filter(p => p.id !== product.id && p.category === product.category)
  const isAvailable = (p: typeof product) => p.badge !== 'soldout' && !p.availableOnRequest
  const score = (p: typeof product) => {
    let s = 0
    if (product.ecosystem && p.ecosystem && p.ecosystem === product.ecosystem) s += 2
    if (product.animalGroup && p.animalGroup && p.animalGroup === product.animalGroup) s += 1
    return s
  }
  const related = [...others]
    .sort((a, b) => {
      const diff = score(b) - score(a)
      if (diff !== 0) return diff
      // Within same score: available products first
      return (isAvailable(b) ? 1 : 0) - (isAvailable(a) ? 1 : 0)
    })
    .slice(0, 3)

  const isSold = product.badge === 'soldout'
  const isOnRequest = product.availableOnRequest === true

  // priceValidUntil: 1 year from build time — required by Google Merchant listings
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

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
      url: SITE_URL,
    },
    url: `${SITE_URL}/products/${product.slug}`,
    ...(product.category === 'amigurumis' && { category: 'Toys & Games > Stuffed Animals & Plush Toys' }),
    ...(testimonials.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        bestRating: '5',
        worstRating: '1',
        ratingCount: testimonials.length,
      },
      review: testimonials.slice(0, 5).map(t => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: t.name },
        datePublished: t.created_at.split('T')[0],
        reviewBody: t.text,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
      })),
    }),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      priceValidUntil,
      validFrom: product.updatedAt ?? new Date().toISOString().split('T')[0],
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
      shippingDetails: [
        makeShipping(6, 'EUR', 'PT', 1, 3),
        makeShipping(9, 'EUR', 'ES', 2, 5),
        ...EU_COUNTRIES.map(c => makeShipping(14, 'EUR', c, 5, 7)),
        ...WORLD_COUNTRIES.map(c => makeShipping(21, 'EUR', c, 5, 9)),
      ],
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PT',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
        refundType: 'https://schema.org/FullRefund',
        merchantReturnLink: `${SITE_URL}/returns`,
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
