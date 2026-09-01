import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  initial[0] = { checked: false, value: '3292' }
  initial[1] = { checked: false, value: '1404' }
  initial[2] = { checked: true, value: '2140' }
  initial[3] = { checked: true, value: '176' }
  initial[4] = { checked: true, value: '5.0' }
  initial[5] = { checked: true, value: '108.3' }
  initial[6] = { checked: false, value: '10.0' }
  initial[7] = { checked: false, value: '10.0' }
  initial[8] = { checked: false, value: '10.0' }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: "Pearl",
  lightCone: "Mushy Shroomy's Adventures",
  superimposition: "S5",
  relicSet1: "Dreamlit Actor (2pc)",
  relicSet2: "Dreamlit Actor (4pc)",
  planarSet: "Broken Keel",
  relicBody: "Outgoing Healing",
  relicFeet: "SPD",
  relicOrb: "DEF%",
  relicRope: "Energy Regeneration Rate",
  stats: createDefaultStats(),
})
