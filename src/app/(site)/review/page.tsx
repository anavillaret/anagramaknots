import type { Metadata } from 'next'
import TestimonialForm from '@/components/testimonials/TestimonialForm'

export const metadata: Metadata = {
  title: 'Share your experience · Anagrama',
  description: 'Tell us about your Anagrama piece — your words help others discover handmade art.',
  robots: { index: false },
}

export default function ReviewPage() {
  return (
    <main className="pt-36 pb-24">
      <div className="max-w-lg mx-auto px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-teal mb-3">Your experience</p>
        <h1 className="text-3xl font-semibold text-ink mb-3">Share your thoughts</h1>
        <p className="text-[14px] text-stone leading-relaxed mb-10">
          Your words help others discover Anagrama — and they mean the world to Ana.
        </p>
        <TestimonialForm />
      </div>
    </main>
  )
}
