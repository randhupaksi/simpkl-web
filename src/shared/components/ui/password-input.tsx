import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'

import { Button } from './button'
import { Input, type InputProps } from './input'

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ endAdornment, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <Input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        endAdornment={
          endAdornment ?? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={
                isVisible ? 'Sembunyikan password' : 'Tampilkan password'
              }
              aria-pressed={isVisible}
              onClick={() => setIsVisible((current) => !current)}
            >
              {isVisible ? <EyeOff /> : <Eye />}
            </Button>
          )
        }
        {...props}
      />
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
