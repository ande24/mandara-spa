'use client'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}