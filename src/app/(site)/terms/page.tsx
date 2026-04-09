import type { Metadata } from 'next'
import TermsContent from '@/components/legal/TermsContent'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for purchasing from Anagrama Art in Knots.',
  robots: { index: false },
}

export default function TermsPage() {
  return <TermsContent />
}
