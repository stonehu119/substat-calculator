import { BODY_MAIN_STATS, FEET_MAIN_STATS, ORB_MAIN_STATS, ROPE_MAIN_STATS } from '../data/relics';
import SearchableDropdown from './SearchableDropdown';

interface RelicMainsProps {
  mainStat1: string;
  onMainStat1Change: (value: string) => void;
  mainStat2: string;
  onMainStat2Change: (value: string) => void;
  mainStat3: string;
  onMainStat3Change: (value: string) => void;
  mainStat4: string;
  onMainStat4Change: (value: string) => void;
}

export default function RelicMains({
  mainStat1,
  onMainStat1Change,
  mainStat2,
  onMainStat2Change,
  mainStat3,
  onMainStat3Change,
  mainStat4,
  onMainStat4Change,
}: RelicMainsProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300 font-semibold">Relic main stats</label>
      <div className="grid grid-cols-2 gap-2">
        <SearchableDropdown
          options={BODY_MAIN_STATS}
          value={mainStat1}
          onChange={onMainStat1Change}
          label="Chest"
          placeholder="Select main stat"
        />
        <SearchableDropdown
          options={FEET_MAIN_STATS}
          value={mainStat2}
          onChange={onMainStat2Change}
          label="Boots"
          placeholder="Select main stat"
        />
        <SearchableDropdown
          options={ORB_MAIN_STATS}
          value={mainStat3}
          onChange={onMainStat3Change}
          label="Orb"
          placeholder="Select main stat"
        />
        <SearchableDropdown
          options={ROPE_MAIN_STATS}
          value={mainStat4}
          onChange={onMainStat4Change}
          label="Rope"
          placeholder="Select main stat"
        />
      </div>
    </div>
  );
}