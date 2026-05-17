import { cn } from '../../lib/utils'

function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'w-full rounded-[16px] border border-border/25 bg-white/80 px-4 py-3 text-[14px] text-ink outline-none transition focus:border-ink/40',
        className
      )}
      {...props}
    />
  )
}

export default Input
