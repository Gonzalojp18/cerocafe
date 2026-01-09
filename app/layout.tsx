import type { Metadata } from 'next'
import { Inter, Abril_Fatface } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })
const abrilFatface = Abril_Fatface({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abril'
})

export const metadata: Metadata = {
  title: 'Juliette',
  description: 'Coffee & Pastry Shop',
  manifest: '/manifest.json',
  themeColor: '#1A3C34',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Juliette',
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
        </Providers>
      </body>
    </html>
  )
}