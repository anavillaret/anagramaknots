import Nav from '@/components/nav/Nav'
import Footer from '@/components/footer/Footer'
import CookieBanner from '@/components/ui/CookieBanner'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
