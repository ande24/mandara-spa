'use client'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'
import { PT_Sans } from 'next/font/google'

const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700']})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
      <body className={ptSans.className}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}