/**
 * RainBarrelGauge theme — OCEAN_FRESH preset.
 * `name` is copied verbatim from the preset file (rule #11b).
 * Only the accent hexes are overridden to the brief palette.
 */

export const theme = {
  name: 'ocean-fresh',

  colors: {
    bg: {
      top: '#F4FAFC',
      mid: '#E3F1F6',
      deep: '#C9E2EA',
      storm: '#0A222C',
    },
    surface: {
      base: '#FFFFFF',
      alt: '#F6FBFC',
      sunk: '#EAF4F7',
      glass: 'rgba(255,255,255,0.78)',
      header: 'rgba(255,255,255,0.72)',
    },
    line: {
      border: '#DCEDF2',
      strong: '#C4DEE6',
      hoop: 'rgba(29,111,140,0.10)',
      divider: '#D4E8EF',
    },
    water: {
      primary: '#1D6F8C',
      deep: '#12506B',
      light: '#3E93B0',
      wave: '#7FD4E8',
      foam: '#B8E6F2',
      shell: '#9DCEDB',
    },
    accent: {
      base: '#F4A259',
      deep: '#B8652A',
      soft: 'rgba(244,162,89,0.14)',
    },
    success: '#2E9E7A',
    text: {
      primary: '#12303B',
      muted: '#4A6B78',
      faint: '#80A0AC',
      onDark: '#EAF4F7',
      onDarkMuted: 'rgba(196,222,230,0.78)',
    },
  },

  gradients: {
    menuBg: ['#F4FAFC', '#E3F1F6', '#C9E2EA'],
    gameBg: ['#F4FAFC', '#E6F2F7', '#CFE6ED'],
    stormBg: ['rgba(10,34,44,0.92)', 'rgba(18,48,59,0.95)', 'rgba(29,111,140,0.88)'],
    resultBg: ['rgba(29,111,140,0.90)', 'rgba(18,48,59,0.94)'],
    button: ['#1D6F8C', '#2E86A6'],
    tile: ['#1D6F8C', '#2E86A6', '#3E93B0'],
    water: ['#3E93B0', '#1D6F8C', '#12506B'],
    slider: ['#3E93B0', '#1D6F8C'],
    progress: ['#3E93B0', '#7FD4E8', '#F4A259'],
    bar: ['#3E93B0', '#1D6F8C'],
  },

  radius: { chip: 14, card: 20, button: 20, panel: 26, tank: 28, pill: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  type: {
    hero: { fontSize: 46, fontWeight: '800' as const, letterSpacing: -0.5 },
    display: { fontSize: 38, fontWeight: '800' as const, letterSpacing: 0 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 0.4 },
    section: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 2.2 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    strong: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 1.2 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.4 },
    micro: { fontSize: 9, fontWeight: '700' as const, letterSpacing: 2 },
  },

  shadow: {
    card: {
      shadowColor: '#1D6F8C',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    tile: {
      shadowColor: '#1D6F8C',
      shadowOpacity: 0.32,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    tank: {
      shadowColor: '#1D6F8C',
      shadowOpacity: 0.16,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    panel: {
      shadowColor: '#1D6F8C',
      shadowOpacity: 0.14,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: -6 },
      elevation: 12,
    },
    button: {
      shadowColor: '#1D6F8C',
      shadowOpacity: 0.34,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 9,
    },
    result: {
      shadowColor: '#0A222C',
      shadowOpacity: 0.3,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 14,
    },
  },

  anim: {
    press: { tension: 300, friction: 10 },
    enter: { tension: 60, friction: 9 },
    slosh: { tension: 120, friction: 5 },
    fadeIn: 260,
    fadeOut: 320,
    water: 400,
  },
} as const;

export type Theme = typeof theme;
export default theme;
