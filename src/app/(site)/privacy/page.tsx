import type { Metadata } from 'next'
import PrivacyContent from '@/components/legal/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Anagrama Art in Knots collects, uses and protects your personal data.',
  robots: { index: false },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
