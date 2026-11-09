import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { DbTestimonial } from '@/lib/supabase'
import ReviewsClient from './ReviewsClient'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Customer Reviews · Anagrama Art in Knots',
  description: 'Real words from real people — what customers say about their Anagrama pieces.',
  alternates: { canonical: `${SITE_URL}/reviews` },
}

export const revalidate = 60

export default async function ReviewsPage() {
  const db = supabaseAdmin()
  const { data } = await db
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const testimonials: DbTestimonial[] = data ?? []

  return <ReviewsClient testimonials={testimonials} />
}
