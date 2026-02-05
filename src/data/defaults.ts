import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  for (let i = 1; i <= 9; i++) {
    initial[i] = { checked: true, value: '0' }
  }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: 'Cyrene',
  lightCone: 'This Love, Forever',
  superimposition: 'S1',
  relicSet1: "World-Remaking Deliverer",
  relicSet2: "Bone Collection's Serene Demesne",
  relicMainStat1: 'Crit Rate',
  relicMainStat2: 'SPD',
  relicMainStat3: 'DMG Bonus',
  relicMainStat4: 'HP%',
  stats: createDefaultStats(),
})

