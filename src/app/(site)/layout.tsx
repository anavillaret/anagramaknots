import Nav from '@/components/nav/Nav'
import Footer from '@/components/footer/Footer'
import Link from 'next/link'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '10px 16px', textAlign: 'center', fontSize: '11px', letterSpacing: '0.12em' }}>
        ※ The shop is coming soon — browse freely and{' '}
        <Link href="/commission" style={{ textDecoration: 'underline', color: 'inherit' }}>
          commission a piece
        </Link>
        . Purchases will open shortly.
      </div>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
