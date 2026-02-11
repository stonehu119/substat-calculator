import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  initial[0] = { checked: false, value: '2857' }
  initial[1] = { checked: true, value: '3473' }
  initial[2] = { checked: false, value: '1105' }
  initial[3] = { checked: false, value: '105.0' }
  initial[4] = { checked: true, value: '86.2' }
  initial[5] = { checked: true, value: '192.9' }
  initial[6] = { checked: false, value: '0.0' }
  initial[7] = { checked: false, value: '0.0' }
  initial[8] = { checked: false, value: '0.0' }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: "Ashveil",
  lightCone: "Cruising in the Stellar Sea",
  superimposition: "S5",
  relicSet1: "Pioneer Diver of Dead Waters (2pc)",
  relicSet2: "Pioneer Diver of Dead Waters (4pc)",
  planarSet: "Duran, Dynasty of Running Wolves",
  relicBody: "Crit Rate",
  relicFeet: "ATK%",
  relicOrb: "ATK%",
  relicRope: "ATK%",
  stats: createDefaultStats(),
})
