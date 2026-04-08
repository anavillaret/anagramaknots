import CommissionPageContent from '@/components/commission/CommissionPageContent'
import { getProducts } from '@/lib/products'
import type { Product } from '@/lib/products'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Made for You',
  description: 'Request a custom handmade piece, made just for you.',
}

export default async function CommissionPage() {
  const all = await getProducts()
  const available = all.filter(
    p => p.badge !== 'soldout' && !p.availableOnRequest
  )
  return <CommissionPageContent availableProducts={available} />
}
