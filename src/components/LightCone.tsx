import { LIGHT_CONES, SUPERIMPOSITION_LEVELS } from '../data/lightcones'
import SearchableDropdown from './SearchableDropdown'

interface LightConeProps {
  lightCone: string
  onLightConeChange: (value: string) => void
  superimposition: string
  onSuperimpositionChange: (value: string) => void
  pathMatches?: boolean
}

export default function LightCone({
  lightCone,
  onLightConeChange,
  superimposition,
  onSuperimpositionChange,
  pathMatches = true,
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
        />
        <SearchableDropdown
          options={SUPERIMPOSITION_LEVELS}
          value={superimposition}
          onChange={onSuperimpositionChange}
          label="Superimposition"
          placeholder="Select level"
        />
      </div>
      {lightCone && !pathMatches && (
        <p className="text-[10px] text-gray-500">
          Path doesn't match character - passive won't apply.
        </p>
      )}
    </div>
  )
}
