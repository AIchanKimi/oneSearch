import type { ReactNode } from 'react'

type PageTitleProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
