import StoryContent from '@/components/story/StoryContent'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata = {
  title: 'Our Story | Anagrama Art in Knots',
  description: 'The story behind Anagrama — a Portuguese maker handcrafting unique crochet amigurumis inspired by real animals. One artist, one knot, one creature at a time.',
  alternates: { canonical: `${SITE_URL}/story` },
}

export default function StoryPage() {
  return <StoryContent />
}
