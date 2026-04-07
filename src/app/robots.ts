import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/cart', '/success', '/cancel'],
    },
    sitemap: 'https://anagramaknots.com/sitemap.xml',
  }
}
