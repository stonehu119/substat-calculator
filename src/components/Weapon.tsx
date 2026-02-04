export default function Weapon() {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Weapon</label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Weapon</label>
          <div className="bg-gray-700 rounded px-3 py-2">[Weapon Dropdown]</div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Refine</label>
          <div className="bg-gray-700 rounded px-3 py-2">[Refine Dropdown]</div>
        </div>
      </div>
    </div>
  )
}
