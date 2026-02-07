type OutputStatsProps = {
  low: string
  mid: string
  high: string
  title?: string
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
          <div className="text-2xl font-semibold text-blue-300">{low}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Mid rolls</div>
          <div className="text-2xl font-semibold text-blue-300">{mid}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">High rolls</div>
          <div className="text-2xl font-semibold text-blue-300">{high}</div>
        </div>
      </div>
    </div>
  )
}
