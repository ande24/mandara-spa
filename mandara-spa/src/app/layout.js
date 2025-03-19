'use client'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'

export default function RootLayout({ children }) {

  return (
    <html lang="en">
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </head>
      <body className="font-serif">
        <AuthContextProvider>
            {children} 
        </AuthContextProvider>
      </body>
    </html>
  )
}