export const OCEAN_FRESH = {
  name: 'ocean-fresh',
  colors: {
    bg: {
      primary: '#E8F4F8',
      secondary: '#D1E7EE',
      tertiary: '#B8DBE5',
      accent: '#9DCEDB',
    },
    ocean: {
      deep: '#00558B',
      wave: '#00A6CB',
      foam: '#7DDDD3',
      seafoam: '#A8E6D9',
      coral: '#FF8C61',
      sun: '#FFD66B',
    },
    text: {
      primary: '#003547',
      secondary: '#00558B',
      accent: '#00A6CB',
      muted: '#5C8090',
    },
    ui: {
      border: '#B8DBE5',
      divider: '#D1E7EE',
      overlay: 'rgba(0, 53, 71, 0.55)',
      glass: 'rgba(232, 244, 248, 0.88)',
    },
  },
  gradients: {
    primary: ['#00A6CB', '#00558B'],
    surface: ['#E8F4F8', '#D1E7EE'],
    button: ['#00558B', '#00A6CB'],
    reward: ['#FFD66B', '#FF8C61'],
    header: ['#D1E7EE', '#E8F4F8'],
  },
  typography: {
    hero: { fontSize: 40, fontWeight: '300' as const, letterSpacing: -0.5 },
    title: { fontSize: 22, fontWeight: '600' as const, letterSpacing: 0 },
    subtitle: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 1 },
    body: { fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.2 },
    caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 1.5, textTransform: 'uppercase' as const },
    button: { fontSize: 14, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
  },
  radius: { sm: 6, md: 14, lg: 22, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
};

// ============================================================
// PRESET MAP — for quick lookup by keyword
// ============================================================
