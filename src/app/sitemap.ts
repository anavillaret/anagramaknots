import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

// Force dynamic so the sitemap is always generated at request time,
// ensuring it can reach Supabase and include the latest products.
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://anagramaknots.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch live products from Supabase so new products appear automatically.
  // Gracefully falls back to an empty array if the DB is unreachable.
  const products = await getProducts().catch(() => [])

  const productUrls = products.map(product => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...productUrls,
    {
      url: `${BASE_URL}/story`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/commission`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ]
}
