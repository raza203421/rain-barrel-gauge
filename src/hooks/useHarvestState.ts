import { useCallback } from 'react';
import {
  addStorm,
  selCapacity,
  selDays,
  selPerDay,
  selRoofArea,
  selRunoff,
  StormResult,
  useHarvest,
} from '../game/store';
import { fillRatio } from '../game/harvest';

/**
 * Narrow read model for the barrel screens. Every field is a primitive, so a
 * component that needs only `stored` re-renders on `stored` alone.
 */
export function useBarrel() {
  const stored = useHarvest(s => s.stored);
  const capacity = useHarvest(selCapacity);
  return { stored, capacity, ratio: fillRatio(stored, capacity) };
}

export function useRoof() {
  const roofArea = useHarvest(selRoofArea);
  const runoff = useHarvest(selRunoff);
  return { roofArea, runoff };
}

export function useWatering() {
  const perDay = useHarvest(selPerDay);
  const days = useHarvest(selDays);
  const gardenArea = useHarvest(s => s.gardenArea);
  return { perDay, days, gardenArea };
}

export function useLogStorm() {
  return useCallback(
    (rainMm: number, efficiency: number): StormResult => addStorm(rainMm, efficiency),
    [],
  );
}

export default useBarrel;
