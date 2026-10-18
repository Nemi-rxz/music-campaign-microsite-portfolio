import { Manrope } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Header from '@/app/components/Layout/Header'
import Footer from '@/app/components/Layout/Footer'
import ScrollToTop from '@/app/components/ScrollToTop'
import Aoscompo from '@/utils/aos'

const font = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://futuresoundafrobeats.example'),
  title: {
    default: 'Future Sound Afrobeats',
    template: '%s | Future Sound Afrobeats',
  },
  description:
    'Future Sound Afrobeats is a premium digital campaign microsite concept focused on artist discovery, fan engagement, and community participation.',
  icons: {
    icon: '/favicon.ico?v=2',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className} bg-[#050816] text-white antialiased`}>
        <Aoscompo>
          <Header />
          {children}
          <Footer />
        </Aoscompo>
        <ScrollToTop />
      </body>
    </html>
  )
}
