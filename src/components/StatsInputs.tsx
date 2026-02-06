import { STAT_NAMES } from "../types/stats"
import type { StatState } from "../types/formState"

interface StatsInputsProps {
  stats: Record<number, StatState>
  onStatsChange: (stats: Record<number, StatState>) => void
  rolls: Record<number, number>
}

export default function StatsInputs({ stats, onStatsChange, rolls }: StatsInputsProps) {
  const toggleChecked = (i: number) => {
    onStatsChange({ ...stats, [i]: { ...stats[i], checked: !stats[i].checked } })
  }

  const setValue = (i: number, v: string) => {
    // allow empty or numeric strings; validation can be added later
    onStatsChange({ ...stats, [i]: { ...stats[i], value: v } })
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Stats</label>

      {/* Header row */}
      <div className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)_4rem] text-xs text-gray-400 px-1">
        <span className="text-left">Stat</span>
        <span className="text-left">Value</span>
        <span className="text-center"># Mid rolls</span>
      </div>

      <div className="flex flex-col gap-1">
        {Object.keys(stats).map((key) => {
          const i = Number(key)
          const s = stats[i]

          return (
            <div
              key={i}
              className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_4rem] items-center gap-2 px-1 py-1 rounded-md hover:bg-gray-800/60"
            >
              {/* Stat label + checkbox */}
              <label
                htmlFor={`stat-${i}`}
                className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`stat-${i}`}
                  className="w-4 h-4 rounded cursor-pointer flex-shrink-0"
                  checked={s.checked}
                  onChange={() => toggleChecked(i)}
                />
                <span className="truncate">{STAT_NAMES[i]}</span>
              </label>

              {/* Numeric input */}
              <input
                type="number"
                placeholder="0"
                className={`w-full rounded px-2 py-1 text-sm text-left placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  s.checked
                    ? 'bg-gray-700 text-gray-100 focus:ring-blue-500 cursor-text'
                    : 'bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!s.checked}
                value={s.value}
                onChange={(e) => setValue(i, e.target.value)}
              />

              {/* Rolls output (placeholder) */}
              <div className="text-center text-xs text-gray-300 tabular-nums min-w-[3rem]">
                {stats[i].checked && rolls[i] ? rolls[i] : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
