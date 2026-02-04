interface CharacterDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function CharacterDropdown({ value, onChange }: CharacterDropdownProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm text-gray-300">Character</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select character"
        className="bg-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
