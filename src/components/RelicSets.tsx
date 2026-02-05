import SearchableDropdown from './SearchableDropdown'

const RELIC_SETS = [
  'Placeholder Relic Set A',
  'Placeholder Relic Set B',
  'Placeholder Relic Set C',
  'Placeholder Relic Set D',
]

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
        <SearchableDropdown
          options={RELIC_SETS}
          value={set1}
          onChange={onSet1Change}
          label="Set 1"
          placeholder="Select relic set"
        />
        <SearchableDropdown
          options={RELIC_SETS}
          value={set2}
          onChange={onSet2Change}
          label="Set 2"
          placeholder="Select relic set"
        />
      </div>
    </div>
  )
}
