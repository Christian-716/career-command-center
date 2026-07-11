import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]',
        secondary: 'bg-[hsl(var(--surface-2))] text-[hsl(var(--muted))]',
        success: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
        warning: 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]',
        destructive: 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
