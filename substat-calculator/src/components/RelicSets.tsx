export default function RelicSets() {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Relic Sets</label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Set 1</label>
          <div className="bg-gray-700 rounded px-3 py-2">[Relic Set 1 Dropdown]</div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Set 2</label>
          <div className="bg-gray-700 rounded px-3 py-2">[Relic Set 2 Dropdown]</div>
        </div>
      </div>
    </div>
  )
}
