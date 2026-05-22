import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sharp font-sans font-medium ' +
    'transition-colors duration-200 ease-editorial ' +
    'focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-crimson',
        accent: 'bg-crimson text-paper hover:bg-crimson-dark',
        outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
        ghost: 'text-ink hover:text-crimson',
      },
      size: {
        sm: 'h-9 px-4 text-xs tracking-wide',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

/** Editorial button. For links styled as buttons, apply `buttonVariants()` to a `<Link>`. */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
