import { cn } from '../../lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-[24px] border border-border/15 bg-surface-1', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('px-6 pt-6', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-['Intel_One_Mono'] text-[20px] text-ink", className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <p className={cn("mt-2 font-['Inter'] text-[12.5px] text-ink-muted/70", className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn('px-6 pb-6', className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return <div className={cn('px-6 pb-6', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
