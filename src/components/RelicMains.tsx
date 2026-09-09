import { BODY_MAIN_STATS, FEET_MAIN_STATS, ORB_MAIN_STATS, ROPE_MAIN_STATS } from '../data/data';
import SearchableDropdown from './SearchableDropdown';
import FieldGroup from './FieldGroup';

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

/** Label above the control on narrow screens, beside it once there is room. */
function SlotRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:items-center sm:gap-2.5">
      <span className="text-[11px] leading-4 text-gray-400">{label}</span>
      {children}
    </div>
  )
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
    <FieldGroup
      title="Relic main stats"
      note="Head/Hands are always flat HP/ATK, so they are not listed."
    >
      {/* Slot names match the dialog and the game: Body, Feet, Sphere, Rope */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-4">
        <SlotRow label="Body">
          <SearchableDropdown
            options={BODY_MAIN_STATS}
            value={mainStat1}
            onChange={onMainStat1Change}
            label="Body main stat"
            placeholder="Select"
            noMobileKeyboard
          />
        </SlotRow>
        <SlotRow label="Feet">
          <SearchableDropdown
            options={FEET_MAIN_STATS}
            value={mainStat2}
            onChange={onMainStat2Change}
            label="Feet main stat"
            placeholder="Select"
            noMobileKeyboard
          />
        </SlotRow>
        <SlotRow label="Sphere">
          <SearchableDropdown
            options={ORB_MAIN_STATS}
            value={mainStat3}
            onChange={onMainStat3Change}
            label="Planar sphere main stat"
            placeholder="Select"
            noMobileKeyboard
          />
        </SlotRow>
        <SlotRow label="Rope">
          <SearchableDropdown
            options={ROPE_MAIN_STATS}
            value={mainStat4}
            onChange={onMainStat4Change}
            label="Link rope main stat"
            placeholder="Select"
            noMobileKeyboard
          />
        </SlotRow>
      </div>
    </FieldGroup>
  );
}
