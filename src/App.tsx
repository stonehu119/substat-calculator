
import { useState, useEffect, useRef } from 'react'
import CharacterDropdown from './components/CharacterDropdown'
import LightCone from './components/LightCone'
import RelicSets from './components/RelicSets'
import StatsInputs from './components/StatsInputs'
import OutputStats from './components/OutputStats'

type StatState = {
  checked: boolean
  value: string
}

const STORAGE_KEY = 'substats-calculator-state'

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
  const isInitialMount = useRef(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCharacter(data.character || '')
        setLightCone(data.lightCone || '')
        setSuperimposition(data.superimposition || '')
        setRelicSet1(data.relicSet1 || '')
        setRelicSet2(data.relicSet2 || '')
        setStats(data.stats || {})
      } catch (e) {
        console.error('Failed to load saved data:', e)
        // TODO: ignore errors and load default values
      }
    }
    return () => { isInitialMount.current = false }
  }, [])

  
  useEffect(() => {
    if (isInitialMount.current) return
    const data = {
      character,
      lightCone,
      superimposition,
      relicSet1,
      relicSet2,
      stats,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [character, lightCone, superimposition, relicSet1, relicSet2, stats])

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
          <OutputStats low={45} mid={40} high={35} />
        </div>
      </div>
      <footer className="mt-8 text-xs text-gray-500 text-center">
        This is a fan-made tool for Honkai: Star Rail players.<br />
        Website is not affiliated with HoYoverse.
      </footer>
    </div>
  );
}

export default App;
