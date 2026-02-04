interface LightConeProps {
  lightCone: string
  onLightConeChange: (value: string) => void
  superimposition: string
  onSuperimpositionChange: (value: string) => void
}

export default function LightCone({
  lightCone,
  onLightConeChange,
  superimposition,
  onSuperimpositionChange,
}: LightConeProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Light Cone</label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Light Cone</label>
          <input
            type="text"
            value={lightCone}
            onChange={(e) => onLightConeChange(e.target.value)}
            placeholder="Select light cone"
            className="bg-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Superimposition</label>
          <input
            type="text"
            value={superimposition}
            onChange={(e) => onSuperimpositionChange(e.target.value)}
            placeholder="Select level"
            className="bg-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
