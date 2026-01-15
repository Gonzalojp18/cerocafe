import type { Metadata } from 'next'
import { Inter, Abril_Fatface } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import NavWrapper from '@/components/NavWrapper'

const inter = Inter({ subsets: ['latin'] })
const abrilFatface = Abril_Fatface({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abril'
})

export const metadata: Metadata = {
  title: 'Cero Cafe de Origen',
  description: 'cafe de origen',
  manifest: '/manifest.json',
  themeColor: '#1A3C34',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cero Cafe de Origen',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} ${abrilFatface.variable}`}>
        <Providers>
          {children}
          <NavWrapper />
        </Providers>
      </body>
    </html>
  )
}