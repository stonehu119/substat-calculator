import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  initial[0] = { checked: true, value: '5530' }
  initial[1] = { checked: false, value: '1776' }
  initial[2] = { checked: false, value: '1176' }
  initial[3] = { checked: true, value: '192' }
  initial[4] = { checked: true, value: '22.6' }
  initial[5] = { checked: true, value: '80.4' }
  initial[6] = { checked: false, value: '0.0' }
  initial[7] = { checked: false, value: '0.0' }
  initial[8] = { checked: false, value: '0.0' }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: "Robin • Summeretto",
  lightCone: "Memory's Curtain Never Falls",
  superimposition: "S5",
  relicSet1: "World-Remaking Deliverer (2pc)",
  relicSet2: "World-Remaking Deliverer (4pc)",
  planarSet: "Sprightly Vonwacq",
  relicBody: "HP%",
  relicFeet: "SPD",
  relicOrb: "HP%",
  relicRope: "Energy Regeneration Rate",
  stats: createDefaultStats(),
})
