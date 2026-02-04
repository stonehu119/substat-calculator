import { useState } from 'react'

type StatState = {
  checked: boolean
  value: string
}

export default function StatsInputs() {
  const initial: Record<number, StatState> = {}
  for (let i = 1; i <= 9; i++) initial[i] = { checked: true, value: '' }

  const [stats, setStats] = useState<Record<number, StatState>>(initial)

  const toggleChecked = (i: number) => {
    setStats(prev => ({ ...prev, [i]: { ...prev[i], checked: !prev[i].checked } }))
  }

  const setValue = (i: number, v: string) => {
    // allow empty or numeric strings; validation can be added later
    setStats(prev => ({ ...prev, [i]: { ...prev[i], value: v } }))
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Stats</label>
      <div className="grid grid-cols-3 gap-2">
        {Object.keys(stats).map((key) => {
          const i = Number(key)
          const s = stats[i]
          return (
            <div key={i} className="flex items-center gap-1">
              <input
                type="checkbox"
                id={`stat-${i}`}
                className="w-4 h-4 rounded cursor-pointer flex-shrink-0"
                checked={s.checked}
                onChange={() => toggleChecked(i)}
              />
              <label className="text-xs text-gray-400 truncate flex-shrink-0">CR</label>
              <input
                type="number"
                placeholder="0"
                className={`w-14 rounded px-2 py-1 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  s.checked
                    ? 'bg-gray-700 text-gray-100 focus:ring-blue-500 cursor-text'
                    : 'bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!s.checked}
                value={s.value}
                onChange={(e) => setValue(i, e.target.value)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
