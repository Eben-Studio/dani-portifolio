import { cn } from '../../lib/utils'

function Alert({ className, ...props }) {
  return (
    <div
      role="alert"
      className={cn('rounded-[16px] border border-red-400/30 bg-red-100/60 px-4 py-3 text-[12px] text-red-700', className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }) {
  return <h5 className={cn("font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.2em]", className)} {...props} />
}

function AlertDescription({ className, ...props }) {
  return <div className={cn('mt-1 text-[12px]', className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
