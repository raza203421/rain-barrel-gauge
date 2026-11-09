import { MONTH_NAMES } from '../constants/config';

export type Units = 'LITRES' | 'GALLONS';

const LITRES_PER_GALLON = 3.78541;

/** 1 240 -> "1 240" (plain ASCII space, no exotic separators - rule #15). */
export function groupNumber(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded).toString();
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    const fromEnd = digits.length - i;
    out += digits[i];
    if (fromEnd > 1 && fromEnd % 3 === 1) {
      out += ' ';
    }
  }
  return sign + out;
}

export function toUnits(litres: number, units: Units): number {
  return units === 'GALLONS' ? litres / LITRES_PER_GALLON : litres;
}

export function unitLabel(units: Units): string {
  return units === 'GALLONS' ? 'gal' : 'L';
}

/** "1 240 L" / "327 gal" */
export function formatVolume(litres: number, units: Units): string {
  return groupNumber(toUnits(litres, units)) + ' ' + unitLabel(units);
}

/** Bare number in the active unit, no suffix (for big readouts). */
export function formatVolumeValue(litres: number, units: Units): string {
  return groupNumber(toUnits(litres, units));
}

export function formatMm(mm: number): string {
  return Math.round(mm) + ' mm';
}

export function formatPercent(p: number): string {
  return Math.round(p) + '%';
}

export function formatDemand(mm: number): string {
  return (Math.round(mm * 2) / 2).toFixed(1) + ' mm';
}

/** "07 NOV" */
export function formatDate(day: number, month: number): string {
  const d = day < 10 ? '0' + day : String(day);
  return d + ' ' + (MONTH_NAMES[month] ?? 'JAN');
}

/** RN 0.76+ types percentages as `${number}%`, so a plain string will not do. */
export function pct(n: number): `${number}%` {
  return (n + '%') as `${number}%`;
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
