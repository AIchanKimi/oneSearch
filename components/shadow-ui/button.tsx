import { Context } from '@/entrypoints/content/App'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { useContext } from 'react'
import styles from './button.module.css'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
} & React.ComponentProps<'button'>

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const { theme } = useContext(Context)
  const Comp = asChild ? Slot : 'button'

  const sizeClass = {
    default: styles.sizeDefault,
    sm: styles.sizeSm,
    lg: styles.sizeLg,
    icon: styles.sizeIcon,
  }[size]

  return (
    <Comp
      data-slot="button"
      className={cn(
        styles.button,
        styles[variant],
        sizeClass,
        theme === 'dark' && styles.buttonDark,
        className,
      )}
      {...props}
    />
  )
}

export { Button }
