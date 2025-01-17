import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SeedScout - Find the Perfect Corn Seed Variety',
  description: 'SeedScout helps farmers find the ideal corn seed variety for their farms using advanced technology and data analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

