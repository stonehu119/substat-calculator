import SearchableDropdown from './SearchableDropdown'
import { CHARACTERS } from '../data/characters'

interface CharacterDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function CharacterDropdown({ value, onChange }: CharacterDropdownProps) {
  return (
    <SearchableDropdown
      options={CHARACTERS}
      value={value}
      onChange={onChange}
      label="Character"
      placeholder="Select character"
    />
  )
}
