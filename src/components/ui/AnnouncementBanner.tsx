import Link from 'next/link'

export default function AnnouncementBanner() {
  return (
    <div className="bg-ink text-white px-4 py-3 flex items-center justify-center">
      <p className="text-[11px] tracking-[0.12em] text-center leading-relaxed">
        ※ The shop is coming soon — browse freely and{' '}
        <Link href="/commission" className="underline underline-offset-2 hover:text-teal transition-colors">
          commission a piece
        </Link>
        . Purchases will open shortly.
      </p>
    </div>
  )
}
