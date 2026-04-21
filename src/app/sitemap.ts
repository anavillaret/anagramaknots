import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

// Force dynamic so the sitemap always includes the latest products.
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://anagramaknots.com'

// Site launch date — used as lastModified for static pages that rarely change.
// Update this if a page gets a significant content overhaul.
const LAUNCH_DATE = new Date('2026-04-07')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => [])

  const productUrls = products.map(product => ({
    url: `${BASE_URL}/products/${product.slug}`,
    // Use the real DB timestamp so Google knows exactly when each product changed.
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      // Products listing changes whenever a product is added/updated.
      lastModified: productUrls.length > 0
        ? new Date(Math.max(...productUrls.map(p => p.lastModified.getTime())))
        : LAUNCH_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...productUrls,
    {
      url: `${BASE_URL}/story`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/commission`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ]
}
