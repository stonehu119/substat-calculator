import { useState, useEffect, useCallback } from 'react'
import CharacterDropdown from './components/CharacterDropdown'
import LightCone from './components/LightCone'
import RelicSets from './components/RelicSets'
import RelicMains from './components/RelicMains'
import StatsInputs from './components/StatsInputs'
import OutputStats from './components/OutputStats'
import type { FormState } from './types/formState'
import { createDefaultFormState } from './data/defaults'
import { characterPathMatchesLC, countTotalRolls, inputFormToRollCount } from './data/logic'
import type { Character } from './data/characters'

const OLD_STORAGE_KEY = 'sub-counter-state'
const STORAGE_KEY = 'sub-counter-data'

type SaveData = Partial<Record<Character, Partial<FormState>>>

function App() {
  const [formState, setFormState] = useState<FormState>(createDefaultFormState())

  const saveFormData = useCallback((newFormState: FormState) => {
    const saved = localStorage.getItem(STORAGE_KEY)
    try {
      const saveData = saved ? JSON.parse(saved) as SaveData : {}
      saveData[newFormState.character as Character] = newFormState
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData))
    } catch (e) {
      console.error('Failed to save data', e)
      localStorage.clear()
    }
  }, [formState])

  const loadFormData = useCallback((character: string) => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const saveData = JSON.parse(saved) as SaveData
      const charData = saveData[character as Character] ?? {}

      setFormState((prev) => ({
        ...prev,
        ...charData,
        stats: charData.stats ?? prev.stats,
      }))
    } catch (e) {
      console.error('Failed to load saved data:', e)
      localStorage.clear()
    }
  }, [])

  // Try to load data from storage
  useEffect(() => {
    localStorage.removeItem(OLD_STORAGE_KEY) // remove old data in case of conflicts with new data
    loadFormData(formState.character)
  }, [])

  const updateFormField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const newState = {
      ...formState,
      [key]: value
    }
    setFormState(newState)
    if (key == "character") {
      loadFormData(value as Character)
    } else {
      saveFormData(newState)
    }
  }

  // computation logic here
  const rollCounts = inputFormToRollCount(formState)
  const statRolls: Record<number, number> = rollCounts.convertFormat()
  const [low, mid, high] = countTotalRolls(rollCounts)

  const buildSection = (
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
        set1={formState.relicSet1}
        onSet1Change={(value) => updateFormField('relicSet1', value)}
        set2={formState.relicSet2}
        onSet2Change={(value) => updateFormField('relicSet2', value)}
        planarSet={formState.planarSet}
        onPlanarChange={(value) => updateFormField('planarSet', value)}
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
    </div>
  )

  const statsSectionMobile = (
    <div className="flex flex-col gap-6">
      <StatsInputs
        stats={formState.stats}
        onStatsChange={(stats) => updateFormField('stats', stats)}
        rolls={statRolls}
      />
      <OutputStats low={low.toFixed(2)} mid={mid.toFixed(2)} high={high.toFixed(2)} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center px-2 pt-6 pb-4">
      <div className="flex flex-col items-center w-full gap-8 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 text-center mt-0 drop-shadow-lg tracking-wide">
          Star Rail Substat Counter
        </h1>

        {/* Mobile: single stacked layout */}
        <div className="w-full max-w-md lg:hidden bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6">
          {buildSection}
          {statsSectionMobile}
        </div>

        {/* Desktop: two columns, build left, stats + result right */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr] lg:gap-6 lg:w-full lg:items-stretch">
          <section
            className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-4"
            aria-label="Character and build"
          >
            <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 -mt-1">
              Build
            </h2>
            {buildSection}
          </section>
          <section
            className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-4 min-h-0"
            aria-label="Stats input and result"
          >
            <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 -mt-1 ">
              Stats Input & Result
            </h2>
            <StatsInputs
              stats={formState.stats}
              onStatsChange={(stats) => updateFormField('stats', stats)}
              rolls={statRolls}
            />
            <div className="flex-1 min-h-4" />
            <OutputStats low={low.toFixed(2)} mid={mid.toFixed(2)} high={high.toFixed(2)} />
          </section>
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
