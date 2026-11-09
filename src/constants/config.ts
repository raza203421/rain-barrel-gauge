import { Dimensions } from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/** Loader must outlive the MCP screenshot window (rule #13). EXACTLY 8000. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7600;
export const LOADER_FADE_MS = 320;
export const LOADER_BAR_W = 212;

/** Header: 44px status-bar inset + 28px of content (rule #6). */
export const HEADER_PAD_TOP = 44;
export const HEADER_H = 72;

/** Result hand-off delay after ADD STORM (water + droplets settle first). */
export const RESULT_DELAY_MS = 900;

/* ----------------------------------------------------------------
 * Barrel tank geometry — parent padding + border accounted for (rule #4/#5)
 * ---------------------------------------------------------------- */
export const TANK_MAX_W = Math.min(SCREEN_W - 32, 380);
export const TANK_PAD = 10;
export const TANK_BORDER = 3;
export const TANK_FRAME = TANK_PAD + TANK_BORDER; // 13
export const TANK_W = TANK_MAX_W - 2 * TANK_FRAME;

const CONTROLS_H = 268;
const STAT_STRIP_H = 76;
export const TANK_H = Math.max(
  150,
  Math.min(250, SCREEN_H - HEADER_H - STAT_STRIP_H - CONTROLS_H - 56),
);
export const TANK_SHELL_H = TANK_H + 2 * TANK_FRAME;

/* ----------------------------------------------------------------
 * Season chart geometry — same BOARD_FRAME formula, overflow 0 (rule #4)
 * ---------------------------------------------------------------- */
export const CHART_COLS = 12;
export const CHART_MAX_W = Math.min(SCREEN_W - 32, 380);
export const CHART_PAD = 10;
export const CHART_BORDER = 2;
export const CHART_FRAME = CHART_PAD + CHART_BORDER; // 12
export const CHART_SLOT = Math.floor((CHART_MAX_W - 2 * CHART_FRAME) / CHART_COLS);
export const CHART_BAR_W = CHART_SLOT - 6;
export const CHART_BOARD_W = CHART_SLOT * CHART_COLS + 2 * CHART_FRAME;
export const CHART_PLOT_H = 190;

/** Sizing compare bar shares the board width. */
export const COMPARE_W = CHART_MAX_W - 2 * CHART_FRAME;

/* ---------------------------------------------------------------- */

export type SurfaceId = 'METAL' | 'SHINGLE' | 'TILE' | 'GREEN';

export const SURFACES: ReadonlyArray<{ id: SurfaceId; label: string; coeff: number }> = [
  { id: 'METAL', label: 'METAL 0.95', coeff: 0.95 },
  { id: 'SHINGLE', label: 'SHINGLE 0.85', coeff: 0.85 },
  { id: 'TILE', label: 'TILE 0.80', coeff: 0.8 },
  { id: 'GREEN', label: 'GREEN 0.45', coeff: 0.45 },
];

export const surfaceCoeff = (id: SurfaceId): number =>
  SURFACES.find(s => s.id === id)?.coeff ?? 0.85;

export const RAIN_MIN = 0;
export const RAIN_MAX = 250;
export const RAIN_STEP = 1;
export const RAIN_FAST_STEP = 5;
export const LONG_PRESS_MS = 200;

export const EFF_MIN = 50;
export const EFF_MAX = 100;

export const AREA_MIN = 1;
export const AREA_MAX = 400;

export const BARREL_L_MIN = 50;
export const BARREL_L_MAX = 1000;
export const BARREL_L_STEP = 10;

export const BARREL_COUNT_MIN = 1;
export const BARREL_COUNT_MAX = 6;

export const GARDEN_MIN = 1;
export const GARDEN_MAX = 500;

export const DEMAND_MIN = 1;
export const DEMAND_MAX = 10;
export const DEMAND_STEP = 0.5;

export const DEFAULTS = {
  roofArea: 60,
  surface: 'METAL' as SurfaceId,
  barrelCount: 2,
  barrelL: 200,
  stored: 0,
  efficiency: 85,
  gardenArea: 25,
  dailyDemandMm: 4,
  rainMm: 18,
};

export const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export const DROP_COUNT = 6;
export const DROP_FALL_MS = 520;
export const DROP_STAGGER_MS = 60;
