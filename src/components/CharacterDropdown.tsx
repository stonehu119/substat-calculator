import SearchableDropdown from './SearchableDropdown'
import { CHARACTERS, type Character } from '../data/characters'
import { CHARACTER_ICONS } from '../data/icons'

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
        label=""
        placeholder="Select character"
        customHeight="15.25rem"
        getIconUrl={(v) => CHARACTER_ICONS[v as Character]}
      />
    </div>
  )
}
