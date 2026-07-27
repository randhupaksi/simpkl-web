import type { ButtonProps } from './button'
import { Button } from './button'

type IconButtonProps = Omit<ButtonProps, 'size'> & {
  'aria-label': string
  size?: 'sm' | 'md'
}

export function IconButton({
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      size="icon"
      className={size === 'sm' ? `size-9 ${className ?? ''}` : className}
      {...props}
    />
  )
}
