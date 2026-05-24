import { LIGHT_CONES, SUPERIMPOSITION_LEVELS, type LightCone as LightConeType } from '../data/lightcones'
import SearchableDropdown from './SearchableDropdown'
import { LIGHT_CONE_ICONS } from '../data/icons'

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
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Light cone</label>
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_7rem] gap-2">
        <SearchableDropdown
          options={LIGHT_CONES}
          value={lightCone}
          onChange={onLightConeChange}
          label="Name"
          placeholder="Select light cone"
          getIconUrl={(v) => LIGHT_CONE_ICONS[v as LightConeType]}
          iconSize="lg"
          priorityItems={priorityLightCones}
        />
        <SearchableDropdown
          options={SUPERIMPOSITION_LEVELS}
          value={superimposition}
          onChange={onSuperimpositionChange}
          label="Superimposition"
          placeholder="Select level"
          noMobileKeyboard
        />
      </div>
      {lightCone && !pathMatches && (
        <p className="text-[10px] text-gray-500">
          Path doesn't match character - passive won't apply
        </p>
      )}
    </div>
  )
}
