import Nav from '@/components/nav/Nav'
import Footer from '@/components/footer/Footer'
import CookieBanner from '@/components/ui/CookieBanner'

const GA_ID = 'G-BD7HQX7XYG'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Google Analytics — public pages only; excluded from /admin */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
      <Nav />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
