import { createContext, useContext } from 'react'
import { cn } from '../../lib/utils'

const TabsContext = createContext(null)

function Tabs({ className, value, onValueChange, ...props }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('space-y-4', className)} {...props} />
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/20 bg-white/70 p-1',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, value, ...props }) {
  const context = useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context?.onValueChange?.(value)}
      className={cn(
        "rounded-full px-4 py-2 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] transition",
        isActive
          ? 'bg-ink text-accent shadow-[0_10px_24px_rgba(34,24,4,0.18)]'
          : 'text-ink/50 hover:bg-ink/5',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, value, ...props }) {
  const context = useContext(TabsContext)
  if (!context || context.value !== value) return null

  return <div role="tabpanel" className={cn('space-y-4', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
