import { useEffect, useRef, useState } from 'react'
import type { Breakdown, BreakdownRow, BreakdownSection, StatLine, TotalRow } from '../data/logic'
import { charIcon, lcIcon, planarIcon, relicIcon } from '../data/icons'
import unknownIconUrl from '../assets/unknown-icon.svg'
import RollTotals from './RollTotals'

// A quick flick dismisses even when it did not travel far.
const FLICK_PX_PER_MS = 0.5
const ANIM_MS = 200
// The sheet opens to SHEET_HEIGHT_VH. Dragging it up past EXPAND_THRESHOLD_VH
// commits it to the taller SHEET_EXPANDED_HEIGHT_VH; dragging it down past
// CLOSE_THRESHOLD_VH closes it — the same distance whichever height it started
// from, so an expanded sheet never snaps back down to SHEET_HEIGHT_VH, only
// closed or left expanded. Thresholds are in dvh rather than px so they scale
// with the viewport instead of feeling different on a short vs. tall phone.
const SHEET_HEIGHT_VH = 80
const SHEET_EXPANDED_HEIGHT_VH = 100
const EXPAND_THRESHOLD_VH = 5
const CLOSE_THRESHOLD_VH = 12

// 7 columns: stat, base, bonus, flat, default, in-game, rolls
const TOTALS_COLS =
  'grid grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.95fr)_minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)] gap-2'

function fmtNumber(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  })
}

function fmtLine(line: StatLine, signed?: boolean): string {
  const sign = signed && line.value > 0 ? '+' : ''
  return line.unit === 'pct'
    ? `${sign}${line.value.toFixed(1)}%`
    : `${sign}${fmtNumber(line.value)}`
}

function fmtStat(value: number, unit: 'raw' | 'pct'): string {
  return unit === 'pct' ? `${value.toFixed(1)}%` : fmtNumber(value)
}

// The maths carries percentage bonuses as a multiplier (1.06), but the game shows
// them the way players read them (+6.0%), so that is what the table shows.
function fmtBonus(multiplier: number): string {
  const pct = (multiplier - 1) * 100
  return `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`
}

function fmtBonusTerm(multiplier: number): string {
  const pct = (multiplier - 1) * 100
  return `(1 ${pct < 0 ? '−' : '+'} ${Math.abs(pct).toFixed(1)}%)`
}

function sectionIcon(section: BreakdownSection): string | undefined {
  if (!section.iconKey) return undefined
  switch (section.kind) {
    case 'character': return charIcon(section.iconKey)
    case 'lightCone': return lcIcon(section.iconKey)
    case 'relic': return relicIcon(section.iconKey)
    case 'planar': return planarIcon(section.iconKey)
    default: return undefined
  }
}

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function RelicGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9L12 3z" />
      <path d="M12 8.2l3.4 2v4l-3.4 2-3.4-2v-4l3.4-2z" />
    </svg>
  )
}

function StatChip({ line, signed, inactive }: { line: StatLine, signed?: boolean, inactive?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 px-2 py-0.5 rounded bg-gray-800 border border-gray-700 ${
      inactive ? 'opacity-45' : ''
    }`}>
      <span className="text-[11px] leading-4 text-gray-400">{line.stat}</span>
      <span className={`text-xs leading-4 text-gray-100 tabular-nums ${inactive ? 'line-through' : ''}`}>
        {fmtLine(line, signed)}
      </span>
    </span>
  )
}

function ModifierRow({ row }: { row: BreakdownRow }) {
  return (
    <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[4.75rem_minmax(0,1fr)] sm:gap-3 sm:items-start">
      <span className="text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-500 sm:pt-1.5">
        {row.label}
      </span>
      {row.lines.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {row.lines.map((line) => (
            <StatChip
              key={`${row.label}-${line.stat}-${line.unit}`}
              line={line}
              signed={row.signed}
              inactive={row.inactive}
            />
          ))}
          {row.inactive && (
            <span className="text-[11px] leading-4 text-amber-400">Not counted</span>
          )}
        </div>
      ) : (
        <span className="text-[11px] leading-4 text-gray-500 sm:pt-1">No substat effect</span>
      )}
    </div>
  )
}

function SectionCard({ section }: { section: BreakdownSection }) {
  const iconUrl = sectionIcon(section)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3.5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="w-9 h-9 rounded-md object-cover bg-gray-800 shrink-0"
            onError={(e) => { e.currentTarget.src = unknownIconUrl }}
          />
        ) : (
          <div className="w-9 h-9 rounded-md bg-gray-800 shrink-0 flex items-center justify-center text-gray-500">
            <RelicGlyph />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-100 break-words">{section.title}</div>
          {section.subtitle && (
            <div className="text-[11px] leading-4 text-gray-400 mt-px break-words">{section.subtitle}</div>
          )}
        </div>

        {section.badge ? (
          <span className={`text-[10px] leading-3.5 font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
            section.badge.tone === 'ok'
              ? 'bg-green-950 text-green-400'
              : 'bg-amber-950 text-amber-400'
          }`}>
            {section.badge.text}
          </span>
        ) : section.kicker ? (
          <span className="text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-500 shrink-0">
            {section.kicker}
          </span>
        ) : null}
      </div>

      {section.empty ? (
        <span className="text-[11px] leading-4 text-gray-500">Nothing selected, so this contributes no stats.</span>
      ) : (
        <div className="flex flex-col gap-2">
          {section.rows.map((row) => <ModifierRow key={row.label} row={row} />)}
        </div>
      )}

      {section.note && !section.empty && (
        <p className="m-0 text-[11px] leading-4 text-gray-500">{section.note}</p>
      )}
    </div>
  )
}

function TotalsTable({ totals }: { totals: TotalRow[] }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
      {/* Desktop: full 7-column table */}
      <div className="hidden lg:block">
        <div className={`${TOTALS_COLS} px-1 pb-2 border-b border-gray-700`}>
          {['Stat', 'Base', 'Bonus', '+ Flat', '= Default', 'In-game', 'Rolls'].map((head, i) => (
            <span
              key={head}
              className={`text-[10px] leading-3.5 uppercase tracking-[0.09em] ${
                i >= 4 && i <= 5 ? 'text-gray-400' : 'text-gray-500'
              } ${i === 0 ? '' : 'text-right'}`}
            >
              {head}
            </span>
          ))}
        </div>

        {totals.map((row) => {
          const entered = row.entered !== null
          return (
            <div
              key={row.stat}
              className={`${TOTALS_COLS} px-1 py-1.5 items-center border-b border-white/4 last:border-b-0`}
            >
              <span className={`text-xs ${entered ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
                {row.stat}
              </span>
              <span className={`text-xs text-right tabular-nums ${entered ? 'text-gray-300' : 'text-gray-500'}`}>
                {row.base === null ? '—' : fmtNumber(row.base)}
              </span>
              <span className={`text-xs text-right tabular-nums ${entered ? 'text-gray-300' : 'text-gray-500'}`}>
                {row.percent === null ? '—' : fmtBonus(row.percent)}
              </span>
              <span className={`text-xs text-right tabular-nums ${entered ? 'text-gray-300' : 'text-gray-500'}`}>
                {fmtStat(row.flat, row.unit)}
              </span>
              <span className={`text-xs text-right tabular-nums ${entered ? 'text-gray-100 font-semibold' : 'text-gray-400'}`}>
                {fmtStat(row.defaultValue, row.unit)}
              </span>
              {entered ? (
                <span className="text-xs text-right tabular-nums text-blue-300 font-semibold">
                  {fmtStat(row.entered!, row.unit)}
                </span>
              ) : (
                <span className="text-[11px] text-right text-gray-600">not entered</span>
              )}
              <span className={`text-xs text-right tabular-nums ${
                row.rolls === null ? 'text-gray-600' : row.rolls < 0 ? 'text-red-400 font-semibold' : 'text-gray-200'
              }`}>
                {row.rolls === null ? '—' : `${row.rolls > 0 ? '+' : ''}${row.rolls.toFixed(2)}`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile: one card per entered stat, the rest collapsed */}
      <div className="flex flex-col gap-1.5 lg:hidden">
        {totals.filter((row) => row.entered !== null).map((row) => (
          <div key={row.stat} className="bg-gray-800/60 border border-gray-700 rounded-lg px-2.5 py-2 flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] leading-4.5 font-semibold text-gray-100">{row.stat}</span>
              <span className={`text-xs leading-4.5 tabular-nums shrink-0 ${
                row.rolls !== null && row.rolls < 0 ? 'text-red-400 font-semibold' : 'text-gray-300'
              }`}>
                {row.rolls === null ? '—' : `${row.rolls > 0 ? '+' : ''}${row.rolls.toFixed(2)} rolls`}
              </span>
            </div>
            <div className="text-[11px] leading-4 text-gray-500 tabular-nums">
              {row.base === null
                ? fmtStat(row.flat, row.unit)
                : `${fmtNumber(row.base)} × ${fmtBonusTerm(row.percent!)} + ${fmtStat(row.flat, row.unit)}`}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-400">Default</span>
              <span className="text-xs text-gray-100 font-semibold tabular-nums">{fmtStat(row.defaultValue, row.unit)}</span>
              <ChevronRight className="text-gray-600 shrink-0" />
              <span className="text-[11px] text-gray-400">In-game</span>
              <span className={`text-xs font-semibold tabular-nums ${
                row.rolls !== null && row.rolls < 0 ? 'text-red-400' : 'text-blue-300'
              }`}>
                {fmtStat(row.entered!, row.unit)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="m-0 mt-2.5 px-1 text-[11px] leading-4 text-gray-500">
        "Default" = statline without any substats. Your sub count is calculated using the difference between
        this value and the value you inputted ("In-Game").
      </p>
    </div>
  )
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Matches the lg: breakpoint, where the sheet becomes a centred modal.
function isDesktopLayout(): boolean {
  return window.matchMedia('(min-width: 64rem)').matches
}

interface BuildDetailsDialogProps {
  open: boolean
  breakdown: Breakdown | null
  characterName: string
  characterIconUrl?: string
  onClose: () => void
}

/**
 * Holds the panel on screen through its exit transition. Everything that reaches
 * outside the component — the scroll lock, focus, key handling — lives in
 * DialogPanel, so none of it runs while the dialog is closed.
 */
export default function BuildDetailsDialog({ open, ...panelProps }: BuildDetailsDialogProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)

  // Adjusting state while rendering, rather than in an effect, so opening and
  // closing do not cost an extra commit each.
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setMounted(true)
    else setVisible(false)
  }

  // Enter: flip to the open styles, but only once the closed ones have painted —
  // without that there is nothing to animate from.
  useEffect(() => {
    if (!open || !mounted || visible) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [open, mounted, visible])

  // Exit: drop the panel once its transition has run. Reopening midway cancels this.
  useEffect(() => {
    if (open || !mounted) return
    const timer = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : ANIM_MS)
    return () => clearTimeout(timer)
  }, [open, mounted])

  if (!mounted) return null
  return <DialogPanel visible={visible} {...panelProps} />
}

type DialogPanelProps = Omit<BuildDetailsDialogProps, 'open'> & { visible: boolean }

function DialogPanel({
  visible,
  breakdown,
  characterName,
  characterIconUrl,
  onClose,
}: DialogPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dragOrigin = useRef<number | null>(null)
  const lastSample = useRef<{ y: number, t: number } | null>(null)
  const velocity = useRef(0)
  const rawDelta = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  // Committed sheet height on mobile: false = SHEET_HEIGHT_VH, true = SHEET_EXPANDED_HEIGHT_VH.
  const [expanded, setExpanded] = useState(false)
  // Live max-height while pulling the sheet taller, overriding the committed one during the drag.
  const [dragHeightVh, setDragHeightVh] = useState<number | null>(null)

  // Lock the page behind the dialog. Padding compensates for the scrollbar the
  // lock removes, so the page underneath does not jump sideways.
  useEffect(() => {
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [])

  // Escape to close, Tab kept inside the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Move focus in, and hand it back to whatever opened the dialog.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  // While a sheet drag is in flight, stop the browser treating it as a scroll as
  // well. A flick that reaches the browser leaves inertia running for a second or
  // two afterwards, and the first tap in that window is spent stopping the scroll
  // instead of hitting whatever was tapped. Has to be non-passive to be preventable,
  // which rules out onTouchMove in JSX.
  useEffect(() => {
    if (!dragging) return
    const block = (e: TouchEvent) => e.preventDefault()
    document.addEventListener('touchmove', block, { passive: false })
    return () => document.removeEventListener('touchmove', block)
  }, [dragging])

  const onDragStart = (e: React.PointerEvent) => {
    // Sheet gesture only; the desktop modal does not drag, and controls keep their taps.
    if (isDesktopLayout()) return
    if ((e.target as HTMLElement).closest('button')) return
    dragOrigin.current = e.clientY
    lastSample.current = { y: e.clientY, t: e.timeStamp }
    velocity.current = 0
    rawDelta.current = 0
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onDragMove = (e: React.PointerEvent) => {
    if (dragOrigin.current === null) return
    const previous = lastSample.current
    if (previous && e.timeStamp > previous.t) {
      velocity.current = (e.clientY - previous.y) / (e.timeStamp - previous.t)
    }
    lastSample.current = { y: e.clientY, t: e.timeStamp }

    const delta = e.clientY - dragOrigin.current
    rawDelta.current = delta

    if (delta < 0) {
      // Pulling up grows the sheet live, capped at the expanded height.
      const baselineVh = expanded ? SHEET_EXPANDED_HEIGHT_VH : SHEET_HEIGHT_VH
      const pulledVh = (-delta / window.innerHeight) * 100
      setDragHeightVh(Math.min(SHEET_EXPANDED_HEIGHT_VH, baselineVh + pulledVh))
      setDragY(0)
    } else {
      setDragHeightVh(null)
      setDragY(delta)
    }
  }

  const onDragEnd = () => {
    if (dragOrigin.current === null) return
    dragOrigin.current = null
    setDragging(false)
    setDragHeightVh(null)

    const delta = rawDelta.current
    const deltaVh = (Math.abs(delta) / window.innerHeight) * 100

    if (delta < 0) {
      // Pulled up far enough: commit to the taller sheet. Otherwise snap back.
      if (deltaVh > EXPAND_THRESHOLD_VH) setExpanded(true)
      setDragY(0)
      return
    }

    // Dragging down is the same gesture whether the sheet is at SHEET_HEIGHT_VH
    // or expanded: past the threshold (or a flick) it closes, otherwise it
    // springs back to whatever height it was already committed to — an
    // expanded sheet never snaps down to SHEET_HEIGHT_VH along the way.
    const flicked = velocity.current > FLICK_PX_PER_MS && dragY > 8
    if (deltaVh > CLOSE_THRESHOLD_VH || flicked) {
      // Carry the sheet the rest of the way down rather than letting it vanish mid-gesture.
      setDragY(panelRef.current?.offsetHeight ?? window.innerHeight)
      onClose()
    } else {
      setDragY(0)
    }
  }

  const dragHandlers = {
    onPointerDown: onDragStart,
    onPointerMove: onDragMove,
    onPointerUp: onDragEnd,
    onPointerCancel: onDragEnd,
  }

  const panelStyle: React.CSSProperties | undefined =
    dragY || dragHeightVh !== null
      ? {
          ...(dragY ? { translate: `0 ${dragY}px` } : null),
          ...(dragHeightVh !== null ? { maxHeight: `${dragHeightVh}dvh` } : null),
        }
      : undefined

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6">
      <div
        onMouseDown={onClose}
        className={`absolute inset-0 bg-black/75 touch-none transition-opacity duration-200 ease-out
          motion-reduce:transition-none ${visible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Tailwind drives translate/scale through the standalone CSS properties, so the
          drag offset uses translate too rather than a competing transform. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="build-details-title"
        style={panelStyle}
        className={`relative w-full ${expanded ? 'max-h-[100dvh]' : 'max-h-[80dvh]'} bg-gray-800 border-t border-gray-700 rounded-t-2xl shadow-2xl
          flex flex-col overflow-hidden touch-none lg:touch-auto
          lg:max-w-4xl lg:max-h-[88vh] lg:rounded-xl lg:border
          ${dragging ? '' : 'transition-[translate,scale,opacity,max-height] duration-200 ease-out motion-reduce:transition-none'}
          ${visible
            ? 'translate-y-0 lg:scale-100 lg:opacity-100'
            : 'translate-y-full lg:translate-y-0 lg:scale-95 lg:opacity-0'}`}
      >
        {/* Drag handle, touch only */}
        <div
          className="flex justify-center pt-2.5 pb-1.5 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none lg:hidden"
          {...dragHandlers}
        >
          <div className="w-10 h-1 rounded-full bg-gray-500" />
        </div>

        {/* Header — doubles as a drag surface on the sheet */}
        <div
          {...dragHandlers}
          className="flex items-start justify-between gap-3 px-4 pt-1.5 pb-3 border-b border-gray-700 shrink-0
            touch-none select-none lg:touch-auto lg:select-auto lg:px-6 lg:pt-5 lg:pb-4"
        >
          <div className="flex items-center gap-2.5 min-w-0 lg:items-start lg:gap-0 lg:flex-col">
            {characterIconUrl && (
              <img
                src={characterIconUrl}
                alt=""
                className="w-8 h-8 rounded-md object-cover shrink-0 lg:hidden"
                onError={(e) => { e.currentTarget.src = unknownIconUrl }}
              />
            )}
            <div className="min-w-0">
              <h2 id="build-details-title" className="m-0 text-base font-semibold text-gray-200 lg:text-lg">
                Build Details
              </h2>
              <p className="m-0 mt-0.5 text-[11px] leading-4 text-gray-400 lg:text-xs">
                <span className="lg:hidden">{characterName} · stat modifiers</span>
                <span className="hidden lg:inline">
                  Breakdown of every individual stat modifier applied on this build.
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-700">
              {characterIconUrl && (
                <img
                  src={characterIconUrl}
                  alt=""
                  className="w-5 h-5 rounded object-cover"
                  onError={(e) => { e.currentTarget.src = unknownIconUrl }}
                />
              )}
              <span className="text-xs font-medium text-gray-200">{characterName}</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="w-12 h-12 lg:w-9 lg:h-9 rounded-md text-gray-400 flex items-center justify-center cursor-pointer
                hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                aria-hidden="true" className="w-[22px] h-[22px] lg:w-5 lg:h-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll body — the only scrollable region while the dialog is open */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y px-3 py-3.5 flex flex-col gap-2.5 lg:px-6 lg:py-4">
          {breakdown === null ? (
            <p className="m-0 py-8 text-center text-sm text-gray-400">
              This build could not be read. Try reselecting the character.
            </p>
          ) : (
            <>
              {breakdown.sections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}

              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] leading-3.5 uppercase tracking-[0.11em] text-blue-300 shrink-0">
                  Full Calculation
                </span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              <TotalsTable totals={breakdown.totals} />

              {/* Same component the result card uses, so the two cannot drift apart */}
              <div className="bg-gray-700 rounded-md px-4 py-3.5">
                <RollTotals
                  low={breakdown.rolls?.low ?? null}
                  mid={breakdown.rolls?.mid ?? null}
                  high={breakdown.rolls?.high ?? null}
                  muted={breakdown.hasNegativeRoll}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
