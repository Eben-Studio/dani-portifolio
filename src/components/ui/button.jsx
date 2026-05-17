import { cn } from '../../lib/utils'

const baseStyles =
  'inline-flex items-center justify-center rounded-full text-[11px] uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 disabled:pointer-events-none disabled:opacity-60'

const variantStyles = {
  default: 'bg-ink text-accent hover:bg-accent-deep',
  outline: 'border border-ink/30 text-ink/80 hover:bg-ink/5',
  secondary: 'bg-surface-1 text-ink hover:bg-surface-7',
  ghost: 'text-ink/70 hover:bg-ink/5',
  destructive: 'border border-red-400/40 text-red-700 hover:bg-red-100/40',
}

const sizeStyles = {
  default: 'px-6 py-3',
  sm: 'px-4 py-2 text-[10px]',
  lg: 'px-7 py-3.5 text-[12px]',
  icon: 'h-9 w-9 rounded-full',
}

function Button({ className, variant = 'default', size = 'default', ...props }) {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  )
}

export default Button
