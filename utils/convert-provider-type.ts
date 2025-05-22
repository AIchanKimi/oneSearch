import { ProviderTagEnum } from '@/types'

// 类型级映射，ProviderTag 返回 enum 值，否则返回原字面量
export type ConvertProviderType<T extends string> =
  T extends keyof typeof ProviderTagEnum ? (typeof ProviderTagEnum)[T] : T

export function convertProviderType<T extends string>(type: T): ConvertProviderType<T>
export function convertProviderType(type: string) {
  if (type in ProviderTagEnum) {
    return ProviderTagEnum[type as keyof typeof ProviderTagEnum]
  }
  return type
}
