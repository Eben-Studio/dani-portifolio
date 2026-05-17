import { cn } from '../../lib/utils'
import Button from './button'

function Pagination({ className, page, pageCount, onPageChange }) {
  if (!pageCount || pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <div className="flex flex-wrap items-center gap-1">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "inline-flex h-8 min-w-[32px] items-center justify-center rounded-full border px-3 font-['Intel_One_Mono'] text-[10px] uppercase tracking-[0.2em] transition",
              pageNumber === page
                ? 'border-ink bg-ink text-accent'
                : 'border-ink/20 text-ink/60 hover:bg-ink/5',
            )}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Proxima
      </Button>
    </div>
  )
}

export default Pagination
