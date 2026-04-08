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
    'Handcrafted crochet amigurumis and accessories from Portugal. Each piece is one of a kind, named after a real animal, carrying its story.',
  keywords: ['crochet', 'amigurumi', 'handmade', 'Portugal', 'Art in Knots', 'crochet animals', 'unique handmade gifts'],
  authors: [{ name: 'Ana', url: BASE_URL }],
  creator: 'Anagrama',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: BASE_URL,
    siteName: 'Anagrama',
    title: 'Anagrama — Art in Knots',
    description:
      'Handcrafted crochet amigurumis and accessories from Portugal. Each piece is one of a kind.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
