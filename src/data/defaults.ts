import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  initial[0] = { checked: false, value: '2857' }
  initial[1] = { checked: true, value: '4625' }
  initial[2] = { checked: false, value: '1105' }
  initial[3] = { checked: false, value: '105.0' }
  initial[4] = { checked: true, value: '86.2' }
  initial[5] = { checked: true, value: '112.9' }
  initial[6] = { checked: false, value: '0.0' }
  initial[7] = { checked: false, value: '0.0' }
  initial[8] = { checked: false, value: '0.0' }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: "Himeko • Nova",
  lightCone: "A Star That Lights the Night",
  superimposition: "S1",
  relicSet1: "As Navigator Isee Sees it (2pc)",
  relicSet2: "As Navigator Isee Sees it (4pc)",
  planarSet: "Fallen Star Anchorage",
  relicBody: "Crit Rate",
  relicFeet: "ATK%",
  relicOrb: "DMG Bonus",
  relicRope: "ATK%",
  stats: createDefaultStats(),
})
