import type { Metadata } from 'next'
import TermsContent from '@/components/legal/TermsContent'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for purchasing from Anagrama Art in Knots.',
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return <TermsContent />
}
