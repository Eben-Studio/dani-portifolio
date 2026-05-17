import { cn } from '../../lib/utils'

function Select({ className, value, onChange, options = [], placeholder, ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-[16px] border border-border/25 bg-white/80 px-4 py-3 text-[13px] text-ink outline-none transition focus:border-ink/40",
        className,
      )}
      value={value}
      onChange={onChange}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => {
        const normalized =
          typeof option === 'string' ? { value: option, label: option } : option
        return (
          <option key={normalized.value} value={normalized.value}>
            {normalized.label}
          </option>
        )
      })}
    </select>
  )
}

export default Select
