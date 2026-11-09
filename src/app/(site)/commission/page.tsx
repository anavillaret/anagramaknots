import CommissionPageContent from '@/components/commission/CommissionPageContent'
import { getProducts } from '@/lib/products'
import type { Product } from '@/lib/products'
import { SITE_URL } from '@/lib/siteConfig'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Custom Crochet Commission | Made for You',
  description: 'Request a custom handmade crochet amigurumi — made just for you or as a one-of-a-kind gift. Tell us your animal, we bring it to life. Custom crochet orders from Portugal.',
  alternates: { canonical: `${SITE_URL}/commission` },
}

export default async function CommissionPage() {
  const all = await getProducts()
  const available = all.filter(
    p => p.badge !== 'soldout' && !p.availableOnRequest
  )
  return <CommissionPageContent availableProducts={available} />
}
