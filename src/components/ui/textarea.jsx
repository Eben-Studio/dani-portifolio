import { cn } from '../../lib/utils'

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-[14px] border border-border/25 bg-white/80 px-4 py-2.5 text-[13px] text-ink outline-none transition focus:border-ink/40',
        className
      )}
      {...props}
    />
  )
}

export default Textarea
