import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
// import Image from 'next/image'
// import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full flex items-center justify-center h-14 bg-background/50 backdrop-blur sticky top-0 z-50 border-b border-border/50">
      <div className="container flex items-center justify-between">
        {/* 左侧 Logo+品牌名 */}
        <div className="flex items-center gap-3">
          {/* <Image src="/icon.svg" alt="OneSearch Logo" width={36} height={36} /> */}
          {/* <Link href="/" className="text-3xl font-extrabold text-gray-900 tracking-wide select-none">OneSearch</Link> */}
        </div>
        {/* 中间导航 - 使用NavigationMenu */}
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
        {/* 右侧操作按钮 */}
        <div className="flex gap-4">
          213
        </div>
      </div>
    </header>
  )
}
