import CommissionForm from '@/components/commission/CommissionForm'

export const metadata = {
  title: 'Made for You',
  description: 'Request a custom handmade piece, made just for you.',
}

export default function CommissionPage() {
  return (
    <main className="pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <p className="text-[12px] tracking-[0.3em] uppercase text-teal mb-4">
          ※ Made for You
        </p>
        <h1 className="text-4xl font-semibold text-ink tracking-tight leading-tight">
          Your idea,<br />
          <em className="font-normal not-italic text-teal">knot by knot.</em>
        </h1>
        <p className="mt-5 text-[14px] leading-relaxed text-stone max-w-md">
          Half of everything Ana makes is born from a conversation. Tell her what you have in mind — a specific animal, a colour, a memory — and she will bring it to life.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-stone max-w-md">
          Ana will review your request and reply within <strong className="text-ink font-medium">3–5 working days</strong> with a price and timeline estimate. No commitment required.
        </p>

        <div className="mt-12 border-t border-stone-light pt-10">
          <CommissionForm />
        </div>
      </div>
    </main>
  )
}
