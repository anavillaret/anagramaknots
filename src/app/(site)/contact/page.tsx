import ContactPageContent from '@/components/contact/ContactPageContent'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Anagrama Art in Knots.',
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactPage() {
  return <ContactPageContent />
}
