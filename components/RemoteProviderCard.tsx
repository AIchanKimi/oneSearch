import type { RemoteProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'

type RemoteProviderCardProps = {
  provider: RemoteProvider
  onSelect: (provider: RemoteProvider) => void
  isAdded: boolean // 新增属性，用于判断是否已添加
}

export function RemoteProviderCard({ provider, onSelect, isAdded }: RemoteProviderCardProps) {
  return (
    <div className="relative flex flex-col justify-between border rounded-md p-4 h-48 hover:shadow-lg transition-shadow duration-200">
      {provider.tag && (
        <div className="absolute top-2 right-2 text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">{convertProviderTag(provider.tag)}</div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <img src={provider.icon} alt={provider.label} className="w-12 h-12 object-contain border rounded p-1" />
        <div className="overflow-hidden">
          <div className="font-semibold text-lg text-foreground">{provider.label}</div>
          <div className="text-sm text-muted-foreground truncate">{provider.homepage}</div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-2 break-all overflow-hidden">{provider.link}</div>
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs text-muted-foreground flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="w-4 h-4 text-muted-foreground" />
            <span>{provider.usageCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowBigDown className="w-4 h-4 text-muted-foreground" />
            <span>{provider.obsoleteCount ?? 0}</span>
          </div>
        </div>
        <Button
          onClick={() => onSelect(provider)}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isAdded} // 根据是否已添加禁用按钮
        >
          {isAdded ? '已添加' : '添加'}
        </Button>
      </div>
    </div>
  )
}
