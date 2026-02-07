import SearchableDropdown from './SearchableDropdown'
import { CHARACTERS } from '../data/characters'

interface CharacterDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function CharacterDropdown({ value, onChange }: CharacterDropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Character</label>
      <SearchableDropdown
        options={CHARACTERS}
        value={value}
        onChange={onChange}
        label="Name"
        placeholder="Select character"
        customHeight="15.25rem"
      />
    </div>
  )
}
