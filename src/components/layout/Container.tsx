import { cn } from '@/lib/utils'

type ContainerProps = {
  children: React.ReactNode
  /** default = standard page width, wide = full-bleed grids, prose = reading measure */
  width?: 'default' | 'wide' | 'prose'
  className?: string
  as?: React.ElementType
}

const widths: Record<NonNullable<ContainerProps['width']>, string> = {
  default: 'max-w-[1180px]',
  wide: 'max-w-[1400px]',
  prose: 'max-w-[var(--container-prose)]',
}

/** Centered page container with responsive gutters. */
export function Container({
  children,
  width = 'default',
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8', widths[width], className)}>
      {children}
    </Tag>
  )
}
