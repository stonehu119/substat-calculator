type OutputStatsProps = {
  low: string
  mid: string
  high: string
}

export default function OutputStats({ low, mid, high }: OutputStatsProps) {
  return (
    <div className="mt-4 bg-gray-700 rounded p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Low</div>
          <div className="text-2xl font-semibold text-blue-300">{low}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Mid</div>
          <div className="text-2xl font-semibold text-blue-300">{mid}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">High</div>
          <div className="text-2xl font-semibold text-blue-300">{high}</div>
        </div>
      </div>
    </div>
  )
}
