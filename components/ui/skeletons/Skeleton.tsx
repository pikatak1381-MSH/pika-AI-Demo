import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SkeletonProps {
  className?: string
  children?: ReactNode
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton = ({
  className,
  children,
  animation = 'pulse',
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        {
          'animate-pulse': animation === 'pulse',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}