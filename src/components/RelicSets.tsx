interface RelicSetsProps {
  set1: string
  onSet1Change: (value: string) => void
  set2: string
  onSet2Change: (value: string) => void
}

export default function RelicSets({
  set1,
  onSet1Change,
  set2,
  onSet2Change,
}: RelicSetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Relic Sets</label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Set 1</label>
          <input
            type="text"
            value={set1}
            onChange={(e) => onSet1Change(e.target.value)}
            placeholder="Select relic set"
            className="bg-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Set 2</label>
          <input
            type="text"
            value={set2}
            onChange={(e) => onSet2Change(e.target.value)}
            placeholder="Select relic set"
            className="bg-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
