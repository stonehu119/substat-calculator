import { useState, useEffect } from 'react'
import CharacterDropdown from './components/CharacterDropdown'
import LightCone from './components/LightCone'
import RelicSets from './components/RelicSets'
import RelicMains from './components/RelicMains'
import StatsInputs from './components/StatsInputs'
import OutputStats from './components/OutputStats'
import type { FormState } from './types/formState'
import { createDefaultFormState } from './data/defaults'
import { characterPathMatchesLC, countTotalRolls, inputFormToRollCount } from './data/logic'

const STORAGE_KEY = 'sub-counter-state'

function App() {
  const [formState, setFormState] = useState<FormState>(createDefaultFormState())
  const [hydrated, setHydrated] = useState(false)

  // Try to load data from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved) as Partial<FormState>
        setFormState((prev) => ({
          ...prev,
          ...data,
          stats: data.stats ?? prev.stats,
        }))
      } catch (e) {
        console.error('Failed to load saved data:', e)
      }
    }
    setHydrated(true)
  }, [])

  // Save data to storage when fields update
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formState))
  }, [formState, hydrated])

  const updateFormField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // computation logic here
  const rollCounts = inputFormToRollCount(formState)
  const statRolls: Record<number, number> = rollCounts.convertFormat()
  const [low, mid, high] = countTotalRolls(rollCounts)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-2 pt-6 pb-4">
      <div className="flex flex-col items-center w-full gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 text-center mt-0 drop-shadow-lg tracking-wide">
          Star Rail Substat Counter
        </h1>
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <CharacterDropdown
              value={formState.character}
              onChange={(value) => updateFormField('character', value)}
            />
            <LightCone 
              lightCone={formState.lightCone} 
              onLightConeChange={(value) => updateFormField('lightCone', value)}
              superimposition={formState.superimposition}
              onSuperimpositionChange={(value) => updateFormField('superimposition', value)}
              pathMatches={characterPathMatchesLC(formState)}
            />
            <RelicSets 
              set1={formState.relicSet} 
              onSet1Change={(value) => updateFormField('relicSet', value)}
              set2={formState.planarSet}
              onSet2Change={(value) => updateFormField('planarSet', value)}
            />
            <RelicMains
              mainStat1={formState.relicBody}
              onMainStat1Change={(value) => updateFormField('relicBody', value)}
              mainStat2={formState.relicFeet}
              onMainStat2Change={(value) => updateFormField('relicFeet', value)}
              mainStat3={formState.relicOrb}
              onMainStat3Change={(value) => updateFormField('relicOrb', value)}
              mainStat4={formState.relicRope}
              onMainStat4Change={(value) => updateFormField('relicRope', value)}
            />
            <StatsInputs
              stats={formState.stats}
              onStatsChange={(stats) => updateFormField('stats', stats)}
              rolls={statRolls}
            />
          </div>
          <OutputStats low={low.toFixed(2)} mid={mid.toFixed(2)} high={high.toFixed(2)} />
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
