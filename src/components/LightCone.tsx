import { LIGHT_CONES, SUPERIMPOSITION_LEVELS } from '../data/data'
import SearchableDropdown from './SearchableDropdown'
import FieldGroup from './FieldGroup'
import { lcIcon } from '../data/icons'

interface LightConeProps {
  lightCone: string
  onLightConeChange: (value: string) => void
  superimposition: string
  onSuperimpositionChange: (value: string) => void
  pathMatches?: boolean
  priorityLightCones?: readonly string[]
}

export default function LightCone({
  lightCone,
  onLightConeChange,
  superimposition,
  onSuperimpositionChange,
  pathMatches = true,
  priorityLightCones,
}: LightConeProps) {
  // Same badge vocabulary the dialog uses for this exact condition.
  const badge = lightCone && (
    <span className={`text-[10px] leading-3.5 font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
      pathMatches ? 'bg-green-950 text-green-400' : 'bg-amber-950 text-amber-400'
    }`}>
      {pathMatches ? 'Path matches' : 'Passive skipped'}
    </span>
  )

  return (
    <FieldGroup
      title="Light cone"
      trailing={badge}
      note={lightCone && !pathMatches
        ? "The path does not match the character's, so the passive is not counted."
        : undefined}
    >
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_6rem] sm:gap-2">
        <SearchableDropdown
          options={LIGHT_CONES}
          value={lightCone}
          onChange={onLightConeChange}
          label="Light cone"
          placeholder="Select light cone"
          getIconUrl={lcIcon}
          priorityItems={priorityLightCones}
        />
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] leading-4 text-gray-400 shrink-0 sm:hidden">
            Superimposition
          </span>
          <div className="flex-1 min-w-0">
            <SearchableDropdown
              options={SUPERIMPOSITION_LEVELS}
              value={superimposition}
              onChange={onSuperimpositionChange}
              label="Superimposition"
              placeholder="Level"
              noMobileKeyboard
            />
          </div>
        </div>
      </div>
    </FieldGroup>
  )
}
