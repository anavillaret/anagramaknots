import type { Metadata } from 'next'
import PrivacyContent from '@/components/legal/PrivacyContent'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Anagrama Art in Knots collects, uses and protects your personal data.',
  alternates: { canonical: `${SITE_URL}/privacy` },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
