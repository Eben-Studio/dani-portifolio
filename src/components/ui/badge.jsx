import { cn } from '../../lib/utils'

function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/20 bg-white/70 px-4 py-1 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.3em] text-ink/70",
        className
      )}
      {...props}
    />
  )
}

export default Badge
