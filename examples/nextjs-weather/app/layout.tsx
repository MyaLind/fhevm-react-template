import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Confidential Weather Aggregator - FHEVM SDK Demo',
  description: 'Privacy-preserving weather data aggregation using Fully Homomorphic Encryption',
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
