type OutputStatsProps = {
  low: number | null
  mid: number | null
  high: number | null
  title?: string
  /**
   * Some entered stat is below its default value, so no total can be counted.
   * Shown as the red ring alone; the figures are already dashed out by null
   * low/mid/high, and nothing here changes the card's height.
   */
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

      {/* Stays neutral in both states: red is reserved for the result being wrong,
          not for the action that explains it. */}
      <span className="mt-3.5 pt-3 border-t border-gray-600 flex items-center justify-center gap-2">
        <span className="text-[13px] leading-[18px] text-gray-300 group-hover:text-blue-300">
          View details
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-300">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  )
}
