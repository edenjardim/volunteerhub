import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Syne } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800'],
})

export const metadata: Metadata = {
  title: { default: 'VolunteerHub', template: '%s | VolunteerHub' },
  description: 'Gestão de Voluntários para Igrejas — Escalas, Ministérios e Engajamento',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'VolunteerHub' },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} ${syne.variable}`}>
      <body className="font-sans bg-[#F8FAFC] text-[#020617] antialiased">
        {children}
        <Toaster
          position="bottom-right"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0F172A',
              color: '#F1F5F9',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              borderRadius: '10px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#0F172A' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#0F172A' } },
          }}
        />
      </body>
    </html>
  )
}
