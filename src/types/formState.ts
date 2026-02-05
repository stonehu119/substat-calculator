export type StatState = {
  checked: boolean
  value: string
}

export interface FormState {
  character: string;
  lightCone: string;
  superimposition: string;
  relicSet1: string;
  relicSet2: string;
  relicMainStat1: string;
  relicMainStat2: string;
  relicMainStat3: string;
  relicMainStat4: string;
  stats: Record<number, StatState>;
}
