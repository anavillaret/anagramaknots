import type { Metadata } from 'next'
import ReturnsContent from '@/components/legal/ReturnsContent'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Returns and refund policy for Anagrama Art in Knots orders.',
  robots: { index: false },
}

export default function ReturnsPage() {
  return <ReturnsContent />
}
