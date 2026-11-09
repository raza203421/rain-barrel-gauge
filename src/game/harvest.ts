import { surfaceCoeff, SurfaceId } from '../constants/config';

export type RoofSection = {
  id: string;
  name: string;
  area: number;
  surface: SurfaceId;
};

export type HarvestInput = {
  roofArea: number;
  runoff: number;
  rainMm: number;
  efficiency: number;
};

export type HarvestResult = {
  collected: number;
  stored: number;
  overflow: number;
};

/** Total roof footprint in m2. */
export function totalRoofArea(sections: ReadonlyArray<RoofSection>): number {
  let sum = 0;
  for (let i = 0; i < sections.length; i++) {
    sum += sections[i].area;
  }
  return sum;
}

/** Area-weighted runoff coefficient k = sum(area_i * coeff_i) / sum(area_i). */
export function weightedRunoff(sections: ReadonlyArray<RoofSection>): number {
  const area = totalRoofArea(sections);
  if (area <= 0) {
    return 0;
  }
  let weighted = 0;
  for (let i = 0; i < sections.length; i++) {
    weighted += sections[i].area * surfaceCoeff(sections[i].surface);
  }
  return weighted / area;
}

/** 1 mm of rain over 1 m2 == 1 litre. */
export function collectedLitres(input: HarvestInput): number {
  const { roofArea, runoff, rainMm, efficiency } = input;
  return Math.round((roofArea * rainMm * runoff * efficiency) / 100);
}

export function capacityLitres(barrelCount: number, barrelL: number): number {
  return barrelCount * barrelL;
}

export function applyHarvest(
  storedNow: number,
  collected: number,
  capacity: number,
): HarvestResult {
  const raw = storedNow + collected;
  const stored = Math.min(capacity, raw);
  const overflow = Math.max(0, raw - capacity);
  return { collected, stored, overflow };
}

/** litresPerDay = gardenArea * dailyDemandMm (1 mm over 1 m2 == 1 L). */
export function litresPerDay(gardenArea: number, dailyDemandMm: number): number {
  return Math.round(gardenArea * dailyDemandMm);
}

export function daysCovered(stored: number, perDay: number): number {
  if (perDay <= 0) {
    return 0;
  }
  return Math.floor(stored / perDay);
}

export function fillRatio(stored: number, capacity: number): number {
  if (capacity <= 0) {
    return 0;
  }
  const r = stored / capacity;
  return r < 0 ? 0 : r > 1 ? 1 : r;
}
