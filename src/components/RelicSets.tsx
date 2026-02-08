import { PLANAR_SETS, RELIC_SETS } from '../data/relics'
import SearchableDropdown from './SearchableDropdown'

interface RelicSetsProps {
  set1: string
  onSet1Change: (value: string) => void
  set2: string
  onSet2Change: (value: string) => void
  planarSet: string
  onPlanarChange: (value: string) => void
}

export default function RelicSets({
  set1,
  onSet1Change,
  set2,
  onSet2Change,
  planarSet,
  onPlanarChange,
}: RelicSetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Relic sets</label>
      <div className="flex flex-col gap-2">
        <SearchableDropdown
          options={RELIC_SETS}
          value={set1}
          onChange={onSet1Change}
          label="Relic set 1"
          placeholder="Select relic set 1"
        />
        <SearchableDropdown
          options={RELIC_SETS}
          value={set2}
          onChange={onSet2Change}
          label="Relic set 2"
          placeholder="Select relic set 2"
        />
        <SearchableDropdown
          options={PLANAR_SETS}
          value={planarSet}
          onChange={onPlanarChange}
          label="Planar set"
          placeholder="Select planar set"
        />
      </div>
    </div>
  )
}
