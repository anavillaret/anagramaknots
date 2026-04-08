import Nav from '@/components/nav/Nav'
import Footer from '@/components/footer/Footer'
import AnnouncementBanner from '@/components/ui/AnnouncementBanner'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBanner />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
