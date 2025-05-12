import type { RemoteProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'

type RemoteProviderCardProps = {
  provider: RemoteProvider
  onSelect: (provider: RemoteProvider) => void
}

export function RemoteProviderCard({ provider, onSelect }: RemoteProviderCardProps) {
  return (
    <div className="relative flex flex-col justify-between border rounded-md p-4 h-48 shadow-md hover:shadow-lg transition-shadow duration-200">
      {provider.tag && (
        <div className="absolute top-2 right-2 text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">{provider.tag}</div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <img src={provider.icon} alt={provider.label} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-semibold text-lg">{provider.label}</div>
          <div className="text-sm text-gray-500 truncate">{provider.homepage}</div>
        </div>
      </div>
      <div className="text-sm text-gray-700 mb-2 break-all">{provider.link}</div>
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs text-gray-600 flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="w-4 h-4 text-gray-500" />
            <span>{provider.usageCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowBigDown className="w-4 h-4 text-gray-500" />
            <span>{provider.obsoleteCount ?? 0}</span>
          </div>
        </div>
        <Button onClick={() => onSelect(provider)} className="bg-green-500 hover:bg-green-600 text-white">添加</Button>
      </div>
    </div>
  )
}
