import type { Metadata } from 'next'
import ReturnsContent from '@/components/legal/ReturnsContent'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Returns and refund policy for Anagrama Art in Knots orders.',
  alternates: { canonical: `${SITE_URL}/returns` },
}

export default function ReturnsPage() {
  return <ReturnsContent />
}
