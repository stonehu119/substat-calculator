import { STAT_NAMES } from "../data/substats"
import Checkbox from "./Checkbox"
import type { StatState } from "../types/formState"

interface StatsInputsProps {
  stats: Record<number, StatState>
  onStatsChange: (stats: Record<number, StatState>) => void
  rolls: Record<number, number>
}

const COLS = 'grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_4.5rem] gap-2.5 items-center'

export default function StatsInputs({ stats, onStatsChange, rolls }: StatsInputsProps) {
  const toggleChecked = (i: number) => {
    onStatsChange({ ...stats, [i]: { ...stats[i], checked: !stats[i].checked } })
  }

  const setValue = (i: number, v: string) => {
    // allow empty or numeric strings; validation can be added later
    onStatsChange({ ...stats, [i]: { ...stats[i], value: v } })
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 lg:p-3.5 flex flex-col gap-2">
      <div className={`${COLS} px-0.5 pb-2 border-b border-gray-800`}>
        <span className="text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-500">Stat</span>
        <span className="text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-500">In-game value</span>
        <span className="text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-500 text-right">Rolls</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {Object.keys(stats).map((key) => {
          const i = Number(key)
          const s = stats[i]
          const negative = s.checked && rolls[i] < 0
          // Dims the cells the checkbox switches off, but never the checkbox
          // itself — greying the control you use to turn the row back on is
          // what made an unchecked row look disabled rather than empty.
          const dimmed = s.checked ? '' : 'opacity-55'

          return (
            <div key={i} className={COLS}>
              <Checkbox
                id={`stat-${i}`}
                checked={s.checked}
                onChange={() => toggleChecked(i)}
                label={STAT_NAMES[i]}
                className={s.checked ? 'text-gray-100' : 'text-gray-400'}
              />

              {/* text-base below lg keeps iOS from zooming the page on focus.
                  The ring branches are exclusive so a red field never picks up
                  the blue hover, and transition-shadow fades it in the way the
                  result card does; Tailwind scopes hover: to pointer devices,
                  so none of it lingers after a tap on mobile. */}
              <input
                type="number"
                placeholder="0"
                className={`w-full h-9 rounded-md px-2.5 text-base lg:text-sm tabular-nums placeholder-gray-500
                  transition-shadow focus:outline-none focus:ring-2 ${dimmed} ${
                  s.checked
                    ? 'bg-gray-700 text-gray-100 cursor-text'
                    : 'bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed'
                } ${
                  negative
                    ? 'ring-1 ring-red-800 hover:ring-red-700 focus:ring-red-500'
                    : s.checked
                      ? 'hover:ring-1 hover:ring-blue-500/60 focus:ring-blue-500'
                      : 'focus:ring-blue-500'
                }`}
                disabled={!s.checked}
                value={s.value}
                onChange={(e) => setValue(i, e.target.value)}
              />

              <div className={`text-right text-[13px] tabular-nums ${dimmed} ${
                negative ? 'text-red-400 font-semibold' : s.checked ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {s.checked ? `${rolls[i] > 0 ? '+' : ''}${rolls[i].toFixed(2)}` : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
