import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'

// ── Dropdown Portal — escapa de qualquer overflow/clip ───────────
function DropdownPortal({ triggerRef, dropRef, options, value, onChange, setOpen, displayMap }) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 140) })
  }, [triggerRef])

  useEffect(() => {
    if (!dropRef.current) return
    gsap.fromTo(dropRef.current,
      { opacity: 0, y: -6, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
    )
  }, [dropRef])

  return createPortal(
    <div
      ref={dropRef}
      style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 9999 }}
      className="overflow-hidden rounded-[14px] border border-border/18 bg-canvas shadow-[0_12px_36px_rgba(var(--color-ink),0.16)]"
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { onChange(opt); setOpen(false) }}
          className={[
            'flex w-full items-center justify-between gap-4 px-4 py-2.5 transition-colors duration-150',
            value === opt
              ? 'bg-ink text-accent'
              : 'text-ink/70 hover:bg-surface-4 hover:text-ink',
          ].join(' ')}
        >
          <span className="font-['Intel_One_Mono'] text-[10.5px] uppercase tracking-[0.14em]">
            {displayMap?.[opt] || opt}
          </span>
          {value === opt && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      ))}
    </div>,
    document.body
  )
}

// ── Custom Select ───────────────────────────────────────────────
export default function CustomSelect({ label, value, options, onChange, active, displayMap = {} }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200',
          active
            ? 'border-ink/40 bg-ink text-accent shadow-[0_2px_10px_rgba(var(--color-ink),0.18)]'
            : 'border-border/25 bg-canvas/70 text-ink hover:border-border/45 hover:bg-canvas',
        ].join(' ')}
      >
        <span className={`font-['Intel_One_Mono'] text-[8.5px] uppercase tracking-[0.2em] ${active ? 'text-accent/60' : 'text-ink/40'}`}>
          {label}
        </span>
        <span className={`font-['Intel_One_Mono'] text-[11px] uppercase tracking-[0.12em] ${active ? 'text-accent' : 'text-ink/75'}`}>
          {value === 'Todos' ? 'Todos' : (displayMap[value] || value)}
        </span>
        <svg
          width="8" height="5" viewBox="0 0 8 5" fill="none"
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-accent' : 'text-ink'}`}
        >
          <path d="M0 0l4 5 4-5H0z" fill="currentColor" opacity="0.45" />
        </svg>
      </button>

      {/* Dropdown — posicionado via fixed para escapar de qualquer overflow/clip */}
      {open && (
        <DropdownPortal
          triggerRef={ref}
          dropRef={dropRef}
          options={options}
          value={value}
          onChange={onChange}
          setOpen={setOpen}
          displayMap={displayMap}
        />
      )}
    </div>
  )
}
