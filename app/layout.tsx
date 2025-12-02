import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NotaAi Next MVP',
  description: 'MVP implemented with Next.js 16, React 19 and Framer Motion',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
