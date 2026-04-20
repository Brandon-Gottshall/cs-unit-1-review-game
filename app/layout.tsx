import React from "react"
import type { Metadata, Viewport } from 'next'
import { buildGameMetadata } from '@brandon-gottshall/review-game-core'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-heading'
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = buildGameMetadata({
  course: 'CS 1301',
  subject: 'Introduction to Java',
})

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  )
}
