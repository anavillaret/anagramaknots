import { supabaseAdmin } from '@/lib/supabase'
import type { DbTestimonial } from '@/lib/supabase'
import TestimonialsCarousel from './TestimonialsCarousel'

async function getTestimonials(): Promise<DbTestimonial[]> {
  try {
    const db = supabaseAdmin()
    const { data } = await db
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(9)
    return data ?? []
  } catch {
    return []
  }
}

export default async function TestimonialsStrip() {
  const testimonials = await getTestimonials()
  if (testimonials.length === 0) return null
  return <TestimonialsCarousel testimonials={testimonials} />
}
