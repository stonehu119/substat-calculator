export type StatState = {
  checked: boolean
  value: string
}

export interface FormState {
  character: string;
  lightCone: string;
  superimposition: string;
  relicSet: string;
  planarSet: string;
  relicBody: string;
  relicFeet: string;
  relicOrb: string;
  relicRope: string;
  stats: Record<number, StatState>;
}
