import RollTotals from './RollTotals'

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

export default function OutputStats({
  low,
  mid,
  high,
  title,
  invalid = false,
  onShowDetails,
}: OutputStatsProps) {
  return (
    <button
      type="button"
      onClick={onShowDetails}
      aria-haspopup="dialog"
      className={`group w-full block bg-gray-700 rounded-md px-4 py-3.5 text-left cursor-pointer transition-shadow
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${invalid ? 'ring-1 ring-red-900 hover:ring-red-700' : 'hover:ring-1 hover:ring-blue-500/60'}`}
    >
      <RollTotals low={low} mid={mid} high={high} title={title} muted={invalid} />

      <span className="mt-3.5 pt-3 border-t border-gray-600 flex items-center gap-2">
        <span className="text-[13px] leading-[18px] text-gray-300 group-hover:text-blue-300">
          Build details
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
