import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full flex items-center justify-center h-14 bg-background/50 backdrop-blur sticky top-0 z-50 border-b border-border/50">
      <div className="h-full py-2 container flex items-center justify-between">
        {/* 左侧只保留Logo且不可点击 */}
        <div className="flex items-center">
          <Image src="/icon.png" alt="OneSearch Logo" width={32} height={32} />
        </div>

        <Separator orientation="vertical" className="mx-4 h-8" />
        {/* 中间导航靠左 */}
        <div className="flex-1 flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/">
                  首页
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/providers">
                  搜索提供商
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Separator orientation="vertical" className="mx-4 h-8" />
        {/* 右侧操作按钮，Button中包裹Link跳转GitHub */}
        <div className="flex gap-4">
          <Button asChild size="icon" variant="secondary">
            <Link href="https://github.com/AIchanKimi/oneSearch" target="_blank" rel="noopener noreferrer">
              <Github />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
