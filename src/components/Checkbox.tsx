type CheckboxProps = {
  id: string
  checked: boolean
  onChange: () => void
  label: string
  /** Merged onto the label — the caller owns the row's text color. */
  className?: string
}

/**
 * A checkbox drawn to match the form controls: the native input is still there
 * under appearance-none, so the label, the space key and form semantics keep
 * working, and the tick is a sibling SVG revealed by peer-checked.
 *
 * The hover ring hangs off the label rather than the box, so the whole click
 * target lights up instead of just the 20px square.
 */
export default function Checkbox({ id, checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`group flex items-center gap-2.5 text-[13px] cursor-pointer ${className}`}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="peer w-5 h-5 appearance-none rounded-[5px] cursor-pointer transition
            border border-gray-600 bg-gray-800
            checked:border-blue-500 checked:bg-blue-500
            group-hover:ring-1 group-hover:ring-blue-500/60
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto w-3.5 h-3.5 text-white
            opacity-0 scale-75 transition peer-checked:opacity-100 peer-checked:scale-100"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span className="truncate">{label}</span>
    </label>
  )
}
