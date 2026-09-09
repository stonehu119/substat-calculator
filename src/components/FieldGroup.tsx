import type { ReactNode } from 'react'

interface FieldGroupProps {
  /** Rendered as the eyebrow. Uppercased by CSS, so write it in sentence case. */
  title: string
  /** Sits opposite the title — a badge, a count, anything short. */
  trailing?: ReactNode
  note?: string
  children: ReactNode
}

/**
 * A recessed well with an eyebrow, matching SectionCard in the build details
 * dialog. The form and the dialog describe the same six objects, so they use the
 * same container.
 */
export default function FieldGroup({ title, trailing, note, children }: FieldGroupProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 lg:p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 min-h-4">
        <span className="text-[10px] leading-3.5 uppercase tracking-[0.09em] text-gray-500">
          {title}
        </span>
        {trailing}
      </div>

      {children}

      {note && <p className="m-0 text-[11px] leading-4 text-gray-500">{note}</p>}
    </div>
  )
}

/** Inline label sitting to the left of a control, or above it on narrow screens. */
export function FieldRow({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:items-center sm:gap-2.5">
      <span className="text-[11px] leading-4 text-gray-400">{label}</span>
      {children}
    </div>
  )
}
