
import { useState } from 'react'
import CharacterDropdown from './components/CharacterDropdown'
import LightCone from './components/LightCone'
import RelicSets from './components/RelicSets'
import StatsInputs from './components/StatsInputs'

type StatState = {
  checked: boolean
  value: string
}

function App() {
  const [character, setCharacter] = useState<string>('')
  const [lightCone, setLightCone] = useState<string>('')
  const [superimposition, setSuperimposition] = useState<string>('')
  const [relicSet1, setRelicSet1] = useState<string>('')
  const [relicSet2, setRelicSet2] = useState<string>('')
  const [stats, setStats] = useState<Record<number, StatState>>(() => {
    const initial: Record<number, StatState> = {}
    for (let i = 1; i <= 9; i++) initial[i] = { checked: true, value: '' }
    return initial
  })

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-2 pt-6 pb-4">
      <div className="flex flex-col items-center w-full gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 text-center mt-0 drop-shadow-lg tracking-wide">
          Star Rail<br />Substat Counter
        </h1>
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <CharacterDropdown value={character} onChange={setCharacter} />
            <LightCone 
              lightCone={lightCone} 
              onLightConeChange={setLightCone}
              superimposition={superimposition}
              onSuperimpositionChange={setSuperimposition}
            />
            <RelicSets 
              set1={relicSet1} 
              onSet1Change={setRelicSet1}
              set2={relicSet2}
              onSet2Change={setRelicSet2}
            />
            <StatsInputs stats={stats} onStatsChange={setStats} />
          </div>
          {/* Output Placeholder */}
          <div className="mt-4 bg-gray-700 rounded p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Low</div>
                <div className="text-2xl font-semibold text-blue-300">45</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Mid</div>
                <div className="text-2xl font-semibold text-blue-300">40</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">High</div>
                <div className="text-2xl font-semibold text-blue-300">35</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-8 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Substat Counter
      </footer>
    </div>
  );
}

export default App;
