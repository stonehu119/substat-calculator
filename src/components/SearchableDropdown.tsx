import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import unknownIconUrl from '../assets/unknown-icon.svg'

function LazyImg({ src, alt, className, rootRef }: {
  src: string | undefined
  alt: string
  className: string
  rootRef: React.RefObject<HTMLUListElement | null>
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    setActiveSrc(undefined)
    if (!src) return
    const el = imgRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src)
          observer.disconnect()
        }
      },
      { root: rootRef.current, threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [src, rootRef])

  return (
    <img
      ref={imgRef}
      src={activeSrc ?? (src ? undefined : unknownIconUrl)}
      alt={alt}
      className={className}
      onError={() => setActiveSrc(unknownIconUrl)}
    />
  )
}

const LIST_MAX_HEIGHT_PX = 204 // max-h-51 = 12.75rem
const SPACE_BUFFER_PX = 16

export interface SearchableDropdownProps {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  customHeight?: string
  getIconUrl?: (value: string) => string | undefined
  showIcons?: boolean
  iconSize?: 'sm' | 'lg'
  noMobileKeyboard?: boolean
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  label,
  placeholder,
  customHeight,
  getIconUrl,
  showIcons = true,
  iconSize = 'sm',
  noMobileKeyboard = false,
}: SearchableDropdownProps) {
  // left + size must sum to ≤ pl-12 (48px) so the input text start doesn't shift
  const icon = iconSize === 'lg'
    ? { size: 'w-10 h-10', left: 'left-1' }       // 4px + 40px = 44px
    : { size: 'w-8 h-8 rounded-md', left: 'left-2.5' } // 10px + 32px = 42px
  const [isOpen, setIsOpen] = useState(false)
  const [openAbove, setOpenAbove] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const ulRef = useRef<HTMLUListElement>(null)

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

  const iconsActive = showIcons && !!getIconUrl
  const showSelectedIcon = iconsActive && !!value && !isOpen
  const selectedIconUrl = showSelectedIcon ? getIconUrl!(value) : undefined

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
        {showSelectedIcon && (
          <img
            src={selectedIconUrl ?? unknownIconUrl}
            alt=""
            className={`absolute ${icon.left} top-1/2 -translate-y-1/2 ${icon.size} object-cover pointer-events-none z-[1]`}
            onError={(e) => { e.currentTarget.src = unknownIconUrl }}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode={noMobileKeyboard ? 'none' : undefined}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full rounded py-2.5 focus:outline-none focus:ring-2 ${
            showSelectedIcon ? 'pl-12 pr-3' : 'px-3'
          } ${
            value && !isValid && !isOpen
              ? 'bg-red-900 text-red-100 placeholder-red-400 focus:ring-red-500'
              : 'bg-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500'
          }`}
        />
      </div>
      {value && !isValid && !isOpen && (
        <p className="mt-1 text-xs text-red-400">Invalid selection</p>
      )}

      {isOpen && filtered.length > 0 && (
        <ul
          ref={ulRef}
          className={`absolute left-0 right-0 bg-gray-700 border border-gray-600 rounded overflow-y-auto z-10 ${
            openAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{
            maxHeight: customHeight ?? "12.75rem"
          }}
        >
          {filtered.map((item) => {
            const itemIconUrl = iconsActive ? getIconUrl!(item) : undefined
            return (
              <li key={item}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 text-gray-100 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer flex items-center gap-2"
                >
                  {iconsActive && (
                    <LazyImg src={itemIconUrl} alt="" className={`${icon.size} object-cover flex-shrink-0`} rootRef={ulRef} />
                  )}
                  {item}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
