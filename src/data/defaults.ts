import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  initial[0] = { checked: true, value: '5401' }
  initial[1] = { checked: false, value: '1347' }
  initial[2] = { checked: false, value: '1184' }
  initial[3] = { checked: true, value: '193.8' }
  initial[4] = { checked: true, value: '59.2' }
  initial[5] = { checked: true, value: '130.0' }
  initial[6] = { checked: false, value: '12.9' }
  initial[7] = { checked: false, value: '0.0' }
  initial[8] = { checked: false, value: '8.2' }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: 'Cyrene',
  lightCone: 'This Love, Forever',
  superimposition: 'S1',
  relicSet1: "World-Remaking Deliverer",
  relicSet2: "World-Remaking Deliverer",
  planarSet: "Bone Collection's Serene Demesne",
  relicBody: 'Crit Rate',
  relicFeet: 'SPD',
  relicOrb: 'DMG Bonus',
  relicRope: 'HP%',
  stats: createDefaultStats(),
})
