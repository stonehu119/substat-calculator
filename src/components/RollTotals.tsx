interface RollTotalsProps {
  low: number | null
  mid: number | null
  high: number | null
  title?: string
  /** No total could be counted, so the figures render dashed and unaccented. */
  muted?: boolean
}

function fmt(value: number | null): string {
  return value === null ? '—' : value.toFixed(2)
}

/**
 * The roll count, shown wherever it appears. Low, mid and high are one estimate
 * and its bounds rather than three separate results, so mid carries the headline
 * and the other two read as a range beneath it. Note that "low" is the larger
 * figure: low rolls mean more of them were needed to reach the same stat.
 *
 * Built entirely from spans so it stays valid inside a <button> — OutputStats
 * wraps it in one.
 */
export default function RollTotals({
  low,
  mid,
  high,
  title = 'Total roll counts',
  muted = false,
}: RollTotalsProps) {
  const boundValue = `text-[15px] font-semibold tabular-nums ${muted ? 'text-gray-500' : 'text-gray-200'}`
  const boundLabel = 'text-[11px] leading-4 text-gray-400'
  const boundRow = 'flex flex-row-reverse items-baseline justify-between gap-2 lg:flex-row lg:justify-start lg:gap-1.5'

  return (
    <>
      {/* gray-400, not the gray-500 used on gray-900 wells — this sits on gray-700 */}
      <span className="block text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-400">
        {title}
      </span>

      <span className="flex items-baseline gap-2 mt-2.5">
        <span className={`text-4xl leading-10 lg:text-[40px] lg:leading-[44px] font-semibold tabular-nums ${
          muted ? 'text-gray-500' : 'text-blue-300'
        }`}>
          {fmt(mid)}
        </span>
        <span className="text-[13px] text-gray-400">
          <span className="lg:hidden">mid rolls</span>
          <span className="hidden lg:inline">mid substat rolls</span>
        </span>
      </span>

      <span className="mt-2.5 flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3.5">
        <span className="hidden lg:inline text-xs text-gray-400">Range</span>

        <span className={boundRow}>
          <span className={boundValue}>{fmt(high)}</span>
          <span className={boundLabel}>if high rolls</span>
        </span>

        <span className="hidden lg:inline text-gray-600">–</span>

        <span className={boundRow}>
          <span className={boundValue}>{fmt(low)}</span>
          <span className={boundLabel}>if low rolls</span>
        </span>
      </span>
    </>
  )
}
