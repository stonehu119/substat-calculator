import { VERSION } from '../data/version'

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-gray-800 border-b border-gray-700">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center gap-3">
        <h1 className="m-0 text-base font-semibold text-gray-100 tracking-tight whitespace-nowrap">
          Substat Counter
        </h1>
        <span className="hidden sm:block w-px h-4 bg-gray-600 shrink-0" aria-hidden="true" />
        <span className="hidden sm:block text-[13px] text-gray-500 truncate">Honkai: Star Rail</span>
        <div className="flex-1" />
        <span className="text-[11px] text-gray-400 tabular-nums shrink-0">Data v{VERSION}</span>
      </div>
    </header>
  )
}
