import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { ArrowRight, Chrome, Download, Github, Globe, Search, Share2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '首页 - oneSearch 一键搜索多个平台',
  description: 'OneSearch 是一个浏览器扩展，支持一键在多个平台搜索，支持社区共享和自定义搜索引擎。',
  keywords: ['OneSearch', '一键搜索', '多平台搜索', '浏览器扩展', '搜索引擎', '社区共享', '自定义搜索'],
  openGraph: {
    title: '首页 - oneSearch 一键搜索多个平台',
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
    title: '首页 - oneSearch 一键搜索多个平台',
    description: 'OneSearch 是一个浏览器扩展，支持一键在多个平台搜索，支持社区共享和自定义搜索引擎。',
    images: ['/img/icon.svg'],
  },
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="flex justify-center mb-8">
          <Image
            src="/img/icon.svg"
            alt="OneSearch Logo"
            width={120}
            height={120}
            className="rounded-3xl shadow-lg"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-foreground">
          OneSearch
        </h1>

        <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">
          一键搜索多个平台
        </h2>

        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          OneSearch 是一个强大的浏览器扩展，让您能够在选择文本后，通过简单的点击快速在多个搜索引擎和平台上搜索该内容。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button size="lg" asChild className="min-w-[200px]">
            <Link href="#download">
              <Download className="mr-2 h-5 w-5" />
              立即下载
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[200px]">
            <Link href="/providers">
              <Globe className="mr-2 h-5 w-5" />
              浏览提供商
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center">✨ 功能特点</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">便捷搜索</h3>
            <p className="text-muted-foreground">
              选择任意文本，即时在多个搜索引擎上搜索
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">社区共享</h3>
            <p className="text-muted-foreground">
              上传和分享自定义搜索提供商到云端
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">云端同步</h3>
            <p className="text-muted-foreground">
              从社区获取其他用户分享的搜索提供商
            </p>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center">🖼️ 功能预览</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">选择文本后的气泡菜单</h3>
            <div className="rounded-lg border overflow-hidden bg-muted/30">
              <Image
                src="/img/bubble.jpg"
                alt="气泡功能演示"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">自定义搜索引擎设置</h3>
            <div className="rounded-lg border overflow-hidden bg-muted/30">
              <Image
                src="/img/options.jpg"
                alt="设置页面"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="space-y-12">
        <h2 className="text-3xl font-bold text-center">📦 安装</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-4">
            <Link href="https://chromewebstore.google.com/detail/onesearch/gbmfnogamgapnaadfjaaingffdloekce" target="_blank">
              <Chrome className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Chrome</div>
                <div className="text-sm text-muted-foreground">网上应用店</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-4">
            <Link href="https://addons.mozilla.org/zh-CN/firefox/addon/onesearch-%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2%E5%A4%9A%E4%B8%AA%E5%B9%B3%E5%8F%B0/" target="_blank">
              <Globe className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Firefox</div>
                <div className="text-sm text-muted-foreground">Add-ons</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-4">
            <Link href="https://microsoftedge.microsoft.com/addons/detail/onesearch-%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2%E5%A4%9A%E4%B8%AA%E5%B9%B3%E5%8F%B0/fmfeincfdmdagjilohgbfepfplhbhkaj" target="_blank">
              <Globe className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Edge</div>
                <div className="text-sm text-muted-foreground">Add-ons</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-4">
            <Link href="https://github.com/AIchanKimi/oneSearch/releases" target="_blank">
              <Github className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Releases</div>
                <div className="text-sm text-muted-foreground">最新版本</div>
              </div>
            </Link>
          </Button>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>注意：</strong>
            {' '}
            商店中的版本可能会因为审核延迟而不是最新版本。如需最新版本，请访问
            <Link href="https://github.com/AIchanKimi/oneSearch/releases" className="underline ml-1" target="_blank">
              GitHub Releases
            </Link>
            。
          </p>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center">🚀 使用方法</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">1</div>
            <h3 className="text-lg font-semibold">安装扩展</h3>
            <p className="text-muted-foreground">从上方链接安装扩展到您的浏览器</p>
          </div>

          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">2</div>
            <h3 className="text-lg font-semibold">选择文本</h3>
            <p className="text-muted-foreground">在任何网页上选择您想要搜索的文本</p>
          </div>

          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">3</div>
            <h3 className="text-lg font-semibold">点击搜索</h3>
            <p className="text-muted-foreground">点击气泡中的搜索引擎图标开始搜索</p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center">🌐 社区共享功能</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <h3 className="text-xl font-semibold">上传分享</h3>
            <p className="text-muted-foreground">
              将自定义的搜索提供商上传到云端，分享给其他用户使用
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <h3 className="text-xl font-semibold">浏览获取</h3>
            <p className="text-muted-foreground">
              浏览社区中所有共享的提供商，一键添加到您的扩展中
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <h3 className="text-xl font-semibold">统计反馈</h3>
            <p className="text-muted-foreground">
              查看提供商的使用统计，帮助发现最受欢迎的搜索资源
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/providers">
              <ArrowRight className="mr-2 h-5 w-5" />
              探索社区提供商
            </Link>
          </Button>
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">🔍 支持的搜索网站</h2>

        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            OneSearch 支持任意能通过URL传递搜索关键词的网站，包括但不限于：
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <strong>搜索引擎</strong>
              <br />
              百度、必应、谷歌等
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <strong>在线词典</strong>
              <br />
              有道词典、百度翻译等
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <strong>知识类网站</strong>
              <br />
              维基百科、知乎等
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <strong>开发者资源</strong>
              <br />
              GitHub、StackOverflow等
            </div>
          </div>

          <p className="text-muted-foreground">
            只要网站支持通过URL参数传递搜索关键词，您都可以在设置中添加并自定义其URL模板。
          </p>
        </div>
      </section>
    </div>
  )
}
