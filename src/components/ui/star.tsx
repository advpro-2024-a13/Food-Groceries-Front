import * as React from 'react'
import { FaStar as StarIcon } from 'react-icons/fa'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/utils'

const starVariants = cva('inline-flex items-center justify-center text-lg', {
  variants: {
    variant: {
      default: 'text-gray-400',
      filled: 'text-yellow-400',
    },
    size: {
      default: 'h-5 w-5',
      sm: 'h-4 w-4',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface StarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof starVariants> {
  filled?: boolean
  size?: 'default' | 'sm' | 'lg'
}

const FaStar = React.forwardRef<HTMLSpanElement, StarProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      filled = false,
      ...props
    },
    ref
  ) => {
    return (
      <span
        className={cn(
          starVariants({
            variant: filled ? 'filled' : variant,
            size,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        <StarIcon />
      </span>
    )
  }
)
FaStar.displayName = 'FaStar'

export { FaStar, starVariants }
