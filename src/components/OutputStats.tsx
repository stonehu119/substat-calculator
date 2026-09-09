type OutputStatsProps = {
  low: number | null
  mid: number | null
  high: number | null
  title?: string
  /** Some entered stat is below its expected value, so no total can be counted. */
  invalid?: boolean
  onShowDetails: () => void
}

function fmt(value: number | null): string {
  return value === null ? '—' : value.toFixed(2)
}

export default function OutputStats({
  low,
  mid,
  high,
  title = "Total Roll Counts",
  invalid = false,
  onShowDetails,
}: OutputStatsProps) {
  const columns: Array<[string, number | null]> = [
    ['Low rolls', low],
    ['Mid rolls', mid],
    ['High rolls', high],
  ]

  return (
    <button
      type="button"
      onClick={onShowDetails}
      aria-haspopup="dialog"
      className={`group mt-4 w-full block bg-gray-700 rounded p-4 cursor-pointer transition-shadow
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${invalid ? 'ring-1 ring-red-900 hover:ring-red-700' : 'hover:ring-1 hover:ring-blue-500/60'}`}
    >
      <span className="block text-2xl md:text-3xl font-bold text-blue-300 mb-4 text-center">
        {title}
      </span>

      <span className="grid grid-cols-3 gap-4">
        {columns.map(([label, value]) => (
          <span key={label} className="block text-center">
            <span className="block text-sm text-gray-400 mb-2">{label}</span>
            <span className={`block text-2xl font-semibold tabular-nums ${
              value === null ? 'text-gray-500' : 'text-blue-300'
            }`}>
              {fmt(value)}
            </span>
          </span>
        ))}
      </span>

      {invalid && (
        <span className="mt-3.5 flex items-start justify-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" className="text-red-400 shrink-0 mt-px" aria-hidden="true">
            <path d="M12 8v5" />
            <path d="M12 16.4v.2" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span className="text-xs leading-[17px] text-red-400">Some stats are invalid.</span>
        </span>
      )}

      <span className="mt-3.5 pt-3 border-t border-gray-600 flex items-center justify-center gap-2">
        <span className={`text-[13px] leading-[18px] ${
          invalid ? 'text-red-400 font-medium' : 'text-gray-300 group-hover:text-blue-300'
        }`}>
          Build details
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
            invalid ? 'text-red-400' : 'text-gray-300 group-hover:text-blue-300'
          }`}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  )
}
