type OutputStatsProps = {
  low: number | null
  mid: number | null
  high: number | null
  title?: string
}

function fmt(value: number | null): string {
  return value === null ? '—' : value.toFixed(2)
}

export default function OutputStats({
  low,
  mid,
  high,
  title = "Total Roll Counts",
}: OutputStatsProps) {
  return (
    <div className="mt-4 bg-gray-700 rounded p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-300 mb-4 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Low rolls</div>
          <div className="text-2xl font-semibold text-blue-300">{fmt(low)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Mid rolls</div>
          <div className="text-2xl font-semibold text-blue-300">{fmt(mid)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">High rolls</div>
          <div className="text-2xl font-semibold text-blue-300">{fmt(high)}</div>
        </div>
      </div>
    </div>
  )
}
