import type { Metadata } from 'next'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'oneSearch - 一键搜索多个平台',
  description: 'OneSearch 是一个浏览器扩展，支持一键在多个平台搜索，支持社区共享和自定义搜索引擎。',
  keywords: ['OneSearch', '一键搜索', '多平台搜索', '浏览器扩展', '搜索引擎', '社区共享', '自定义搜索'],
  authors: [{ name: 'AIchanKimi', url: 'https://github.com/AIchanKimi' }],
  openGraph: {
    title: 'oneSearch - 一键搜索多个平台',
    description: 'OneSearch 是一个浏览器扩展，支持一键在多个平台搜索，支持社区共享和自定义搜索引擎。',
    url: 'https://onesearch.aichan.site',
    siteName: 'oneSearch',
    images: [
      {
        url: '/img/icon.svg',
        width: 120,
        height: 120,
        alt: 'oneSearch Logo',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'oneSearch - 一键搜索多个平台',
    description: 'OneSearch 是一个浏览器扩展，支持一键在多个平台搜索，支持社区共享和自定义搜索引擎。',
    images: ['/img/icon.svg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-4/5">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
