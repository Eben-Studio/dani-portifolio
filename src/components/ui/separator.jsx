import { cn } from '../../lib/utils'

function Separator({ className, ...props }) {
  return <div className={cn('h-px w-full bg-[#7F6A34]/15', className)} {...props} />
}

export default Separator
