import Footer from '@/components/footer'
import Header from '@/components/header'
import Menu from '@/components/menu'
import { siteConfig } from '@/config/site'
import { fontMono } from '@/lib/fonts'
import { AppProvider } from '@/providers/app-provider'
import { IsClientProvider } from '@/providers/is-client-provider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={`overflow-x-hidden bg-slate-100 font-mono text-slate-900 antialiased ${fontMono.variable}`}
      >
        <IsClientProvider>
          <AppProvider>
            <Header />
            <main className="mt-24 flex h-[calc(100vh-8.5rem)] w-full flex-col items-center px-11">
              <Menu />
              <div className="flex w-full flex-1 items-center justify-center">
                {children}
              </div>
            </main>
            <Footer />
          </AppProvider>
        </IsClientProvider>
      </body>
    </html>
  )
}
