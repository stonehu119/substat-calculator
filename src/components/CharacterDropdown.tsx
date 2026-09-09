import SearchableDropdown from './SearchableDropdown'
import FieldGroup from './FieldGroup'
import { CHARACTERS, CHARACTER_PATH, type Character } from '../data/data'
import { charIcon } from '../data/icons'

interface CharacterDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function CharacterDropdown({ value, onChange }: CharacterDropdownProps) {
  const path = CHARACTER_PATH[value as Character]

  return (
    <FieldGroup
      title="Character"
      trailing={path && <span className="text-[11px] leading-4 text-gray-400">{path}</span>}
    >
      <SearchableDropdown
        options={CHARACTERS}
        value={value}
        onChange={onChange}
        label="Character"
        placeholder="Select character"
        customHeight="15.25rem"
        getIconUrl={charIcon}
      />
    </FieldGroup>
  )
}
