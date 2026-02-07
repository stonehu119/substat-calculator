import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const LIST_MAX_HEIGHT_PX = 204 // max-h-51 = 12.75rem
const SPACE_BUFFER_PX = 16

export interface SearchableDropdownProps {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  customHeight?: string
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  label,
  placeholder,
  customHeight,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openAbove, setOpenAbove] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const minNeeded = LIST_MAX_HEIGHT_PX + SPACE_BUFFER_PX
    setOpenAbove(spaceBelow < minNeeded)
  }, [isOpen])

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
    inputRef.current?.blur()
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
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
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
        <ul
          className={`absolute left-0 right-0 bg-gray-700 border border-gray-600 rounded overflow-y-auto z-10 ${
            openAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{
            maxHeight: customHeight ?? "12.75rem"
          }}
        >
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
