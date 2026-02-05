import { useState, useEffect } from 'react'
import CharacterDropdown from './components/CharacterDropdown'
import LightCone from './components/LightCone'
import RelicSets from './components/RelicSets'
import RelicMains from './components/RelicMains' // Import the new component
import StatsInputs from './components/StatsInputs'
import OutputStats from './components/OutputStats'

type StatState = {
  checked: boolean
  value: string
}

const STORAGE_KEY = 'sub-counter-state'

function App() {
  const [character, setCharacter] = useState<string>('')
  const [lightCone, setLightCone] = useState<string>('')
  const [superimposition, setSuperimposition] = useState<string>('')
  const [relicSet1, setRelicSet1] = useState<string>('')
  const [relicSet2, setRelicSet2] = useState<string>('')
  const [relicMainStat1, setRelicMainStat1] = useState<string>('')
  const [relicMainStat2, setRelicMainStat2] = useState<string>('')
  const [relicMainStat3, setRelicMainStat3] = useState<string>('')
  const [relicMainStat4, setRelicMainStat4] = useState<string>('')
  const [stats, setStats] = useState<Record<number, StatState>>(() => {
    const initial: Record<number, StatState> = {}
    for (let i = 1; i <= 9; i++) initial[i] = { checked: true, value: '' }
    return initial
  })
  const [hydrated, setHydrated] = useState(false)

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
        setRelicMainStat1(data.relicMainStat1 || '')
        setRelicMainStat2(data.relicMainStat2 || '')
        setRelicMainStat3(data.relicMainStat3 || '')
        setRelicMainStat4(data.relicMainStat4 || '')
        setStats(data.stats || {})
      } catch (e) {
        console.error('Failed to load saved data:', e)
        // TODO: ignore errors and load default values
      }
    }
    setHydrated(true)
  }, [])

  
  useEffect(() => {
    if (!hydrated) return
    const data = {
      character,
      lightCone,
      superimposition,
      relicSet1,
      relicSet2,
      relicMainStat1,
      relicMainStat2,
      relicMainStat3,
      relicMainStat4,
      stats,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [character, lightCone, superimposition, relicSet1, relicSet2, relicMainStat1, relicMainStat2, relicMainStat3, relicMainStat4, stats])

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
            <RelicMains
              mainStat1={relicMainStat1}
              onMainStat1Change={setRelicMainStat1}
              mainStat2={relicMainStat2}
              onMainStat2Change={setRelicMainStat2}
              mainStat3={relicMainStat3}
              onMainStat3Change={setRelicMainStat3}
              mainStat4={relicMainStat4}
              onMainStat4Change={setRelicMainStat4}
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
