import { NONE, PLANAR_SETS, RELIC_SETS_2PC, RELIC_SETS_4PC, type PlanarSet, type RelicSet } from '../data/relics'
import SearchableDropdown from './SearchableDropdown'
import { PLANAR_SET_ICONS, RELIC_SET_ICONS } from '../data/icons'

const getRelicIconUrl = (displayValue: string): string | undefined => {
  const baseName = displayValue.replace(/ \([24]pc\)$/, '') as RelicSet
  return RELIC_SET_ICONS[baseName]
}

const getPlanarIconUrl = (displayValue: string): string | undefined =>
  PLANAR_SET_ICONS[displayValue as PlanarSet]

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
  const relic4pcOptions = structuredClone(RELIC_SETS_2PC)
  const index = relic4pcOptions.indexOf(set1)
  relic4pcOptions.splice(index, 1)
  relic4pcOptions.unshift(RELIC_SETS_4PC[index])
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Relic sets</label>
      <div className="flex flex-col gap-2">
        <SearchableDropdown
          options={RELIC_SETS_2PC}
          value={set1}
          onChange={onSet1Change}
          label="Relic set 1"
          placeholder="Select relic set 1"
          getIconUrl={getRelicIconUrl}
        />
        <SearchableDropdown
          options={relic4pcOptions}
          value={set2}
          onChange={onSet2Change}
          label="Relic set 2"
          placeholder="Select relic set 2"
          getIconUrl={getRelicIconUrl}
        />
        <SearchableDropdown
          options={PLANAR_SETS}
          value={planarSet}
          onChange={onPlanarChange}
          label="Planar set"
          placeholder="Select planar set"
          getIconUrl={getPlanarIconUrl}
        />
      </div>
    </div>
  )
}
