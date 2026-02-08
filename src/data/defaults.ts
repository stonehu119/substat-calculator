import type { FormState, StatState } from '../types/formState'

export const createDefaultStats = (): Record<number, StatState> => {
  const initial: Record<number, StatState> = {}
  initial[0] = { checked: false, value: '3410' }
  initial[1] = { checked: true, value: '2868' }
  initial[2] = { checked: false, value: '1191' }
  initial[3] = { checked: true, value: '132.0' }
  initial[4] = { checked: true, value: '81.4' }
  initial[5] = { checked: true, value: '165.2' }
  initial[6] = { checked: false, value: '0.0' }
  initial[7] = { checked: false, value: '0.0' }
  initial[8] = { checked: false, value: '0.0' }
  return initial
}

export const createDefaultFormState = (): FormState => ({
  character: "Sparxie",
  lightCone: "Mushy Shroomy's Adventures",
  superimposition: "S1",
  relicSet1: "Ever-Glorious Magical Girl (2pc)",
  relicSet2: "Ever-Glorious Magical Girl (4pc)",
  planarSet: "Tengoku@Livestream",
  relicBody: "Crit Rate",
  relicFeet: "SPD",
  relicOrb: "ATK%",
  relicRope: "ATK%",
  stats: createDefaultStats(),
})
