import { cn } from '../../lib/utils'

function Label({ className, ...props }) {
  return (
    <label
      className={cn("block font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] text-ink/55", className)}
      {...props}
    />
  )
}

export default Label
