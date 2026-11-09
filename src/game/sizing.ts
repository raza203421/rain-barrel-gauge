import { applyHarvest } from './harvest';

export type SizingOption = {
  count: number;
  capacity: number;
  captured: number;
  spilled: number;
  spillShare: number;
  recommended: boolean;
};

export type SizingInput = {
  history: ReadonlyArray<number>; // collected litres per logged storm
  barrelL: number;
  maxCount: number;
  dailyDraw: number; // litres drawn between storms
};

/**
 * Replays the whole rainfall history against each barrel count and
 * accumulates captured vs spilled litres. The smallest count whose
 * spill share stays under 10% is tagged RECOMMENDED.
 */
export function compareSizes(input: SizingInput): SizingOption[] {
  const { history, barrelL, maxCount, dailyDraw } = input;
  const options: SizingOption[] = [];

  for (let count = 1; count <= maxCount; count++) {
    const capacity = count * barrelL;
    let stored = 0;
    let captured = 0;
    let spilled = 0;

    for (let i = 0; i < history.length; i++) {
      const res = applyHarvest(stored, history[i], capacity);
      captured += res.stored - stored;
      spilled += res.overflow;
      stored = Math.max(0, res.stored - dailyDraw);
    }

    const total = captured + spilled;
    options.push({
      count,
      capacity,
      captured,
      spilled,
      spillShare: total > 0 ? spilled / total : 0,
      recommended: false,
    });
  }

  for (let i = 0; i < options.length; i++) {
    if (options[i].spillShare < 0.1) {
      options[i].recommended = true;
      break;
    }
  }

  return options;
}
