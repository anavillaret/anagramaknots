import ShippingContent from '@/components/shipping/ShippingContent'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata = {
  title: 'How it Ships',
  description: 'Shipping info for Anagrama orders — packaging, delivery times, and worldwide delivery.',
  alternates: { canonical: `${SITE_URL}/shipping` },
}

export default function ShippingPage() {
  return <ShippingContent />
}
