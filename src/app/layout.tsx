import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/context'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = 'https://anagramaknots.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Anagrama — Art in Knots',
    template: '%s — Anagrama',
  },
  description:
    'Shop unique handmade crochet amigurumis from Portugal. Each piece is one of a kind — named after a real animal, carrying its story. Artisan gifts, custom crochet commissions.',
  keywords: [
    'amigurumi', 'crochet amigurumi', 'handmade crochet', 'crochet animals',
    'buy amigurumi', 'amigurumi shop', 'handmade gifts', 'unique gifts Portugal',
    'custom crochet', 'crochet toys', 'stuffed animals handmade',
    'peluche crochet', 'amigurumi Portugal', 'artisan crochet',
    'Art in Knots', 'Anagrama',
  ],
  authors: [{ name: 'Ana', url: BASE_URL }],
  creator: 'Anagrama',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: BASE_URL,
    siteName: 'Anagrama',
    title: 'Anagrama — Art in Knots',
    description:
      'Shop unique handmade crochet amigurumis from Portugal. Each piece is one of a kind — artisan gifts and custom commissions.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anagrama — Art in Knots',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anagrama — Art in Knots',
    description: 'Handcrafted crochet amigurumis and accessories from Portugal.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Anagrama',
  alternateName: 'Anagrama Art in Knots',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    'Handcrafted crochet amigurumis and accessories from Portugal. Each piece is one of a kind, named after a real animal, carrying its story.',
  foundingLocation: {
    '@type': 'Place',
    address: { '@type': 'PostalAddress', addressCountry: 'PT' },
  },
  sameAs: [
    'https://www.instagram.com/anagramaknots',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BD7HQX7XYG" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BD7HQX7XYG');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
