import { useEffect, useState } from 'react'

export interface SearchableDropdownProps {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  label,
  placeholder,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const isValid = value && options.includes(value)

  const filtered = options.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  )

  const onFocus = () => {
    setIsOpen(true)
    setInputValue('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsOpen(true)
  }

  const handleSelect = (item: string) => {
    setInputValue(item)
    onChange(item)
    setIsOpen(false)
  }

  const handleBlur = () => {
    if (options.includes(inputValue)) {
      onChange(inputValue)
    } else {
      setInputValue(value) // revert to last valid value
    }
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col relative">
      <label className="mb-1 text-sm text-gray-300">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
            value && !isValid && !isOpen
              ? 'bg-red-900 text-red-100 placeholder-red-400 focus:ring-red-500'
              : 'bg-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500'
          }`}
        />
        {value && !isValid && !isOpen && (
          <p className="mt-1 text-xs text-red-400">Invalid selection. Please choose from the list.</p>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded max-h-40 overflow-y-auto z-10">
          {filtered.map((item) => (
            <li key={item}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 text-gray-100 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
