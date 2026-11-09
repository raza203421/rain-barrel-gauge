/**
 * In-memory offline store. No network, no accounts, no persistence layer.
 * Components subscribe with a SELECTOR (never to the whole state) so a
 * stepper tap does not re-render the barrel - react-state-minimize.
 */
import { useSyncExternalStore } from 'react';
import { DEFAULTS, SurfaceId, BARREL_COUNT_MAX } from '../constants/config';
import {
  RoofSection,
  applyHarvest,
  capacityLitres,
  collectedLitres,
  daysCovered,
  litresPerDay,
  totalRoofArea,
  weightedRunoff,
} from './harvest';
import { compareSizes, SizingOption } from './sizing';
import { Units } from '../utils/format';

export type LogSource = 'STORM' | 'MANUAL' | 'USE';

export type LogEntry = {
  id: string;
  day: number;
  month: number;
  reading: number;
  delta: number;
  source: LogSource;
};

export type StormResult = {
  collected: number;
  overflow: number;
  rainMm: number;
  efficiency: number;
  stored: number;
};

export type HarvestState = {
  sections: RoofSection[];
  barrelCount: number;
  barrelL: number;
  stored: number;
  efficiency: number;
  gardenArea: number;
  dailyDemandMm: number;
  units: Units;
  haptics: boolean;
  stormTheme: boolean;
  entries: LogEntry[];
  history: number[];
  monthlyCollected: number[];
  monthlyUsed: number[];
  seasonLitres: number;
  lastResult: StormResult;
  pourTick: number;
};

const clock = new Date();

function seed(): HarvestState {
  return {
    sections: [
      { id: 's1', name: 'MAIN ROOF', area: DEFAULTS.roofArea, surface: DEFAULTS.surface },
    ],
    barrelCount: DEFAULTS.barrelCount,
    barrelL: DEFAULTS.barrelL,
    stored: DEFAULTS.stored,
    efficiency: DEFAULTS.efficiency,
    gardenArea: DEFAULTS.gardenArea,
    dailyDemandMm: DEFAULTS.dailyDemandMm,
    units: 'LITRES',
    haptics: true,
    stormTheme: false,
    entries: [],
    history: [],
    monthlyCollected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthlyUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    seasonLitres: 0,
    lastResult: {
      collected: 0,
      overflow: 0,
      rainMm: 0,
      efficiency: DEFAULTS.efficiency,
      stored: 0,
    },
    pourTick: 0,
  };
}

let state: HarvestState = seed();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

function patch(next: Partial<HarvestState>) {
  state = { ...state, ...next };
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getState(): HarvestState {
  return state;
}

/**
 * Selector hook. The selector MUST return a primitive or a reference that is
 * stable between emits (state arrays are replaced immutably), otherwise
 * useSyncExternalStore would loop.
 */
export function useHarvest<T>(selector: (s: HarvestState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

/* ------------------------------ selectors ------------------------------ */

export const selRoofArea = (s: HarvestState) => Math.round(totalRoofArea(s.sections));
export const selRunoff = (s: HarvestState) => weightedRunoff(s.sections);
export const selCapacity = (s: HarvestState) => capacityLitres(s.barrelCount, s.barrelL);
export const selPerDay = (s: HarvestState) => litresPerDay(s.gardenArea, s.dailyDemandMm);
export const selDays = (s: HarvestState) =>
  daysCovered(s.stored, litresPerDay(s.gardenArea, s.dailyDemandMm));
export const selSections = (s: HarvestState) => s.sections;
export const selEntries = (s: HarvestState) => s.entries;

export function sizingOptions(): SizingOption[] {
  const history = state.history.length > 0 ? state.history : [state.barrelL, state.barrelL];
  return compareSizes({
    history,
    barrelL: state.barrelL,
    maxCount: BARREL_COUNT_MAX,
    dailyDraw: litresPerDay(state.gardenArea, state.dailyDemandMm),
  });
}

/* ------------------------------ actions ------------------------------ */

let seq = 0;

function nextId(): string {
  seq += 1;
  return 'e' + seq;
}

export function addStorm(rainMm: number, efficiency: number): StormResult {
  const roofArea = totalRoofArea(state.sections);
  const runoff = weightedRunoff(state.sections);
  const collected = collectedLitres({ roofArea, runoff, rainMm, efficiency });
  const capacity = capacityLitres(state.barrelCount, state.barrelL);
  const res = applyHarvest(state.stored, collected, capacity);
  const gained = res.stored - state.stored;

  const month = clock.getMonth();
  const monthlyCollected = state.monthlyCollected.slice();
  monthlyCollected[month] = monthlyCollected[month] + gained;

  const entry: LogEntry = {
    id: nextId(),
    day: clock.getDate(),
    month,
    reading: res.stored,
    delta: gained,
    source: 'STORM',
  };

  const result: StormResult = {
    collected,
    overflow: res.overflow,
    rainMm,
    efficiency,
    stored: res.stored,
  };

  patch({
    stored: res.stored,
    entries: [entry].concat(state.entries),
    history: state.history.concat(collected),
    monthlyCollected,
    seasonLitres: state.seasonLitres + gained,
    lastResult: result,
    pourTick: state.pourTick + 1,
  });

  return result;
}

export function saveReading(reading: number) {
  const entry: LogEntry = {
    id: nextId(),
    day: clock.getDate(),
    month: clock.getMonth(),
    reading,
    delta: reading - state.stored,
    source: 'MANUAL',
  };
  patch({ stored: reading, entries: [entry].concat(state.entries) });
}

export function waterGarden() {
  const draw = Math.min(state.stored, litresPerDay(state.gardenArea, state.dailyDemandMm));
  if (draw <= 0) {
    return;
  }
  const month = clock.getMonth();
  const monthlyUsed = state.monthlyUsed.slice();
  monthlyUsed[month] = monthlyUsed[month] + draw;
  const entry: LogEntry = {
    id: nextId(),
    day: clock.getDate(),
    month,
    reading: state.stored - draw,
    delta: -draw,
    source: 'USE',
  };
  patch({
    stored: state.stored - draw,
    monthlyUsed,
    entries: [entry].concat(state.entries),
  });
}

export function addSection(area: number, surface: SurfaceId) {
  const section: RoofSection = {
    id: nextId(),
    name: 'SECTION ' + (state.sections.length + 1),
    area,
    surface,
  };
  patch({ sections: state.sections.concat(section) });
}

export function removeSection(id: string) {
  patch({ sections: state.sections.filter(s => s.id !== id) });
}

export function setBarrelCount(barrelCount: number) {
  const capacity = capacityLitres(barrelCount, state.barrelL);
  patch({ barrelCount, stored: Math.min(state.stored, capacity) });
}

export function setBarrelL(barrelL: number) {
  const capacity = capacityLitres(state.barrelCount, barrelL);
  patch({ barrelL, stored: Math.min(state.stored, capacity) });
}

export function setEfficiency(efficiency: number) {
  patch({ efficiency });
}

export function setGardenArea(gardenArea: number) {
  patch({ gardenArea });
}

export function setDailyDemand(dailyDemandMm: number) {
  patch({ dailyDemandMm });
}

export function setUnits(units: Units) {
  patch({ units });
}

export function toggleHaptics() {
  patch({ haptics: !state.haptics });
}

export function toggleStormTheme() {
  patch({ stormTheme: !state.stormTheme });
}

export function resetSeason() {
  const fresh = seed();
  state = {
    ...fresh,
    sections: state.sections,
    barrelCount: state.barrelCount,
    barrelL: state.barrelL,
    efficiency: state.efficiency,
    gardenArea: state.gardenArea,
    dailyDemandMm: state.dailyDemandMm,
    units: state.units,
    haptics: state.haptics,
    stormTheme: state.stormTheme,
  };
  emit();
}
