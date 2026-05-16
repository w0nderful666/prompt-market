import type { ThemeTokens, Mode } from './builder'

export const THEMES: Record<string, { name: string; light: ThemeTokens; dark: ThemeTokens }> = {
  'tokyo-night': {
    name: 'Tokyo Night', light: {
      background: '220 23% 95%', foreground: '220 20% 20%', card: '220 20% 98%', cardForeground: '220 20% 20%',
      primary: '220 65% 55%', primaryForeground: '220 20% 98%', secondary: '220 15% 90%', secondaryForeground: '220 20% 30%',
      muted: '220 15% 90%', mutedForeground: '220 10% 50%', accent: '220 15% 88%', accentForeground: '220 20% 30%',
      border: '220 15% 85%', input: '220 15% 85%', ring: '220 65% 55%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 98%', success: '155 60% 45%', warning: '38 90% 55%', info: '220 65% 55%',
    }, dark: {
      background: '225 25% 10%', foreground: '220 20% 85%', card: '225 25% 13%', cardForeground: '220 20% 85%',
      primary: '220 65% 65%', primaryForeground: '225 25% 10%', secondary: '225 20% 18%', secondaryForeground: '220 20% 80%',
      muted: '225 20% 18%', mutedForeground: '220 15% 55%', accent: '225 20% 20%', accentForeground: '220 20% 80%',
      border: '225 20% 20%', input: '225 20% 20%', ring: '220 65% 65%',
      destructive: '0 60% 60%', destructiveForeground: '0 0% 98%', success: '155 55% 50%', warning: '38 85% 60%', info: '220 65% 65%',
    },
  },
  'catppuccin': {
    name: 'Catppuccin', light: {
      background: '220 23% 95%', foreground: '235 20% 25%', card: '220 20% 97%', cardForeground: '235 20% 25%',
      primary: '265 60% 60%', primaryForeground: '220 20% 98%', secondary: '220 18% 90%', secondaryForeground: '235 20% 35%',
      muted: '220 18% 90%', mutedForeground: '220 10% 55%', accent: '220 18% 88%', accentForeground: '235 20% 35%',
      border: '220 15% 85%', input: '220 15% 85%', ring: '265 60% 60%',
      destructive: '350 60% 60%', destructiveForeground: '0 0% 98%', success: '150 55% 50%', warning: '25 70% 60%', info: '210 60% 60%',
    }, dark: {
      background: '240 21% 12%', foreground: '226 64% 88%', card: '240 21% 15%', cardForeground: '226 64% 88%',
      primary: '265 60% 70%', primaryForeground: '240 21% 12%', secondary: '240 16% 22%', secondaryForeground: '226 50% 80%',
      muted: '240 16% 22%', mutedForeground: '226 25% 55%', accent: '240 16% 25%', accentForeground: '226 50% 80%',
      border: '240 16% 25%', input: '240 16% 25%', ring: '265 60% 70%',
      destructive: '350 60% 65%', destructiveForeground: '0 0% 98%', success: '150 50% 55%', warning: '25 65% 65%', info: '210 55% 65%',
    },
  },
  'dracula': {
    name: 'Dracula', light: {
      background: '60 30% 96%', foreground: '225 15% 25%', card: '60 20% 98%', cardForeground: '225 15% 25%',
      primary: '315 55% 55%', primaryForeground: '0 0% 98%', secondary: '60 15% 90%', secondaryForeground: '225 15% 35%',
      muted: '60 15% 90%', mutedForeground: '225 10% 50%', accent: '60 15% 88%', accentForeground: '225 15% 35%',
      border: '60 12% 85%', input: '60 12% 85%', ring: '315 55% 55%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 98%', success: '135 50% 45%', warning: '60 70% 50%', info: '210 55% 55%',
    }, dark: {
      background: '230 25% 13%', foreground: '60 30% 85%', card: '230 25% 16%', cardForeground: '60 30% 85%',
      primary: '315 55% 65%', primaryForeground: '230 25% 13%', secondary: '230 20% 22%', secondaryForeground: '60 25% 75%',
      muted: '230 20% 22%', mutedForeground: '60 15% 55%', accent: '230 20% 25%', accentForeground: '60 25% 75%',
      border: '230 20% 25%', input: '230 20% 25%', ring: '315 55% 65%',
      destructive: '0 60% 60%', destructiveForeground: '0 0% 98%', success: '135 45% 55%', warning: '60 65% 55%', info: '210 50% 60%',
    },
  },
  'nord': {
    name: 'Nord', light: {
      background: '220 25% 93%', foreground: '220 20% 25%', card: '220 20% 97%', cardForeground: '220 20% 25%',
      primary: '210 45% 50%', primaryForeground: '0 0% 98%', secondary: '220 18% 88%', secondaryForeground: '220 20% 35%',
      muted: '220 18% 88%', mutedForeground: '220 12% 55%', accent: '220 18% 86%', accentForeground: '220 20% 35%',
      border: '220 15% 82%', input: '220 15% 82%', ring: '210 45% 50%',
      destructive: '354 55% 55%', destructiveForeground: '0 0% 98%', success: '155 40% 45%', warning: '40 70% 55%', info: '210 45% 50%',
    }, dark: {
      background: '220 25% 14%', foreground: '218 30% 82%', card: '220 25% 17%', cardForeground: '218 30% 82%',
      primary: '210 50% 60%', primaryForeground: '220 25% 14%', secondary: '220 20% 22%', secondaryForeground: '218 25% 70%',
      muted: '220 20% 22%', mutedForeground: '218 18% 55%', accent: '220 20% 25%', accentForeground: '218 25% 70%',
      border: '220 20% 25%', input: '220 20% 25%', ring: '210 50% 60%',
      destructive: '354 50% 60%', destructiveForeground: '0 0% 98%', success: '155 35% 55%', warning: '40 65% 60%', info: '210 50% 60%',
    },
  },
  'gruvbox': {
    name: 'Gruvbox', light: {
      background: '40 30% 92%', foreground: '30 20% 25%', card: '40 25% 96%', cardForeground: '30 20% 25%',
      primary: '12 60% 45%', primaryForeground: '40 30% 95%', secondary: '40 18% 85%', secondaryForeground: '30 20% 35%',
      muted: '40 18% 85%', mutedForeground: '30 12% 50%', accent: '40 18% 83%', accentForeground: '30 20% 35%',
      border: '40 15% 80%', input: '40 15% 80%', ring: '12 60% 45%',
      destructive: '0 55% 45%', destructiveForeground: '40 30% 95%', success: '85 45% 40%', warning: '30 70% 50%', info: '190 45% 45%',
    }, dark: {
      background: '30 15% 12%', foreground: '40 20% 80%', card: '30 15% 15%', cardForeground: '40 20% 80%',
      primary: '12 60% 55%', primaryForeground: '30 15% 12%', secondary: '30 12% 20%', secondaryForeground: '40 18% 70%',
      muted: '30 12% 20%', mutedForeground: '40 10% 50%', accent: '30 12% 23%', accentForeground: '40 18% 70%',
      border: '30 12% 23%', input: '30 12% 23%', ring: '12 60% 55%',
      destructive: '0 50% 55%', destructiveForeground: '0 0% 98%', success: '85 40% 50%', warning: '30 65% 55%', info: '190 40% 55%',
    },
  },
  'rose-pine': {
    name: 'Rosé Pine', light: {
      background: '30 20% 94%', foreground: '345 10% 30%', card: '30 15% 97%', cardForeground: '345 10% 30%',
      primary: '345 40% 50%', primaryForeground: '0 0% 98%', secondary: '30 12% 88%', secondaryForeground: '345 10% 40%',
      muted: '30 12% 88%', mutedForeground: '345 8% 55%', accent: '30 12% 86%', accentForeground: '345 10% 40%',
      border: '30 10% 82%', input: '30 10% 82%', ring: '345 40% 50%',
      destructive: '0 50% 50%', destructiveForeground: '0 0% 98%', success: '150 35% 45%', warning: '30 60% 50%', info: '210 45% 50%',
    }, dark: {
      background: '250 20% 11%', foreground: '30 15% 80%', card: '250 20% 14%', cardForeground: '30 15% 80%',
      primary: '345 45% 60%', primaryForeground: '250 20% 11%', secondary: '250 15% 20%', secondaryForeground: '30 12% 70%',
      muted: '250 15% 20%', mutedForeground: '30 10% 50%', accent: '250 15% 23%', accentForeground: '30 12% 70%',
      border: '250 15% 23%', input: '250 15% 23%', ring: '345 45% 60%',
      destructive: '0 50% 55%', destructiveForeground: '0 0% 98%', success: '150 35% 50%', warning: '30 55% 55%', info: '210 45% 55%',
    },
  },
  'one-dark': {
    name: 'One Dark', light: {
      background: '220 15% 93%', foreground: '220 12% 25%', card: '220 12% 97%', cardForeground: '220 12% 25%',
      primary: '220 50% 55%', primaryForeground: '0 0% 98%', secondary: '220 12% 88%', secondaryForeground: '220 12% 35%',
      muted: '220 12% 88%', mutedForeground: '220 8% 50%', accent: '220 12% 86%', accentForeground: '220 12% 35%',
      border: '220 10% 82%', input: '220 10% 82%', ring: '220 50% 55%',
      destructive: '355 55% 55%', destructiveForeground: '0 0% 98%', success: '95 45% 45%', warning: '35 70% 50%', info: '200 50% 50%',
    }, dark: {
      background: '220 18% 14%', foreground: '220 15% 80%', card: '220 18% 17%', cardForeground: '220 15% 80%',
      primary: '220 55% 65%', primaryForeground: '220 18% 14%', secondary: '220 14% 22%', secondaryForeground: '220 12% 70%',
      muted: '220 14% 22%', mutedForeground: '220 10% 50%', accent: '220 14% 25%', accentForeground: '220 12% 70%',
      border: '220 14% 25%', input: '220 14% 25%', ring: '220 55% 65%',
      destructive: '355 50% 60%', destructiveForeground: '0 0% 98%', success: '95 40% 55%', warning: '35 65% 55%', info: '200 45% 55%',
    },
  },
  'solarized': {
    name: 'Solarized', light: {
      background: '44 30% 92%', foreground: '192 30% 25%', card: '44 25% 96%', cardForeground: '192 30% 25%',
      primary: '192 60% 45%', primaryForeground: '44 30% 95%', secondary: '44 18% 86%', secondaryForeground: '192 25% 35%',
      muted: '44 18% 86%', mutedForeground: '192 15% 50%', accent: '44 18% 84%', accentForeground: '192 25% 35%',
      border: '44 15% 80%', input: '44 15% 80%', ring: '192 60% 45%',
      destructive: '1 60% 50%', destructiveForeground: '0 0% 98%', success: '68 50% 45%', warning: '45 75% 50%', info: '192 60% 45%',
    }, dark: {
      background: '192 30% 12%', foreground: '44 20% 80%', card: '192 30% 15%', cardForeground: '44 20% 80%',
      primary: '192 60% 55%', primaryForeground: '192 30% 12%', secondary: '192 22% 20%', secondaryForeground: '44 18% 70%',
      muted: '192 22% 20%', mutedForeground: '44 12% 50%', accent: '192 22% 23%', accentForeground: '44 18% 70%',
      border: '192 22% 23%', input: '192 22% 23%', ring: '192 60% 55%',
      destructive: '1 55% 55%', destructiveForeground: '0 0% 98%', success: '68 45% 50%', warning: '45 70% 55%', info: '192 60% 55%',
    },
  },
  'monokai': {
    name: 'Monokai', light: {
      background: '50 15% 93%', foreground: '0 0% 22%', card: '50 10% 97%', cardForeground: '0 0% 22%',
      primary: '280 55% 50%', primaryForeground: '0 0% 98%', secondary: '50 10% 88%', secondaryForeground: '0 0% 35%',
      muted: '50 10% 88%', mutedForeground: '0 0% 50%', accent: '50 10% 86%', accentForeground: '0 0% 35%',
      border: '50 8% 82%', input: '50 8% 82%', ring: '280 55% 50%',
      destructive: '355 65% 50%', destructiveForeground: '0 0% 98%', success: '80 55% 45%', warning: '50 80% 50%', info: '195 60% 50%',
    }, dark: {
      background: '70 10% 14%', foreground: '50 10% 82%', card: '70 10% 17%', cardForeground: '50 10% 82%',
      primary: '280 55% 65%', primaryForeground: '70 10% 14%', secondary: '70 8% 22%', secondaryForeground: '50 8% 70%',
      muted: '70 8% 22%', mutedForeground: '50 5% 50%', accent: '70 8% 25%', accentForeground: '50 8% 70%',
      border: '70 8% 25%', input: '70 8% 25%', ring: '280 55% 65%',
      destructive: '355 60% 58%', destructiveForeground: '0 0% 98%', success: '80 50% 55%', warning: '50 75% 55%', info: '195 55% 55%',
    },
  },
  'github-light': {
    name: 'GitHub Light', light: {
      background: '0 0% 98%', foreground: '210 12% 18%', card: '0 0% 100%', cardForeground: '210 12% 18%',
      primary: '212 92% 45%', primaryForeground: '0 0% 98%', secondary: '210 12% 95%', secondaryForeground: '210 12% 30%',
      muted: '210 12% 95%', mutedForeground: '210 8% 50%', accent: '210 12% 93%', accentForeground: '210 12% 30%',
      border: '210 12% 90%', input: '210 12% 90%', ring: '212 92% 45%',
      destructive: '0 65% 50%', destructiveForeground: '0 0% 98%', success: '140 55% 40%', warning: '35 80% 50%', info: '212 92% 45%',
    }, dark: {
      background: '210 12% 14%', foreground: '210 12% 85%', card: '210 12% 17%', cardForeground: '210 12% 85%',
      primary: '212 90% 58%', primaryForeground: '210 12% 14%', secondary: '210 10% 22%', secondaryForeground: '210 10% 75%',
      muted: '210 10% 22%', mutedForeground: '210 8% 55%', accent: '210 10% 25%', accentForeground: '210 10% 75%',
      border: '210 10% 25%', input: '210 10% 25%', ring: '212 90% 58%',
      destructive: '0 60% 55%', destructiveForeground: '0 0% 98%', success: '140 50% 50%', warning: '35 75% 55%', info: '212 90% 58%',
    },
  },
  'vercel-geist': {
    name: 'Vercel Geist', light: {
      background: '0 0% 98%', foreground: '0 0% 10%', card: '0 0% 100%', cardForeground: '0 0% 10%',
      primary: '0 0% 10%', primaryForeground: '0 0% 98%', secondary: '0 0% 95%', secondaryForeground: '0 0% 20%',
      muted: '0 0% 95%', mutedForeground: '0 0% 50%', accent: '0 0% 93%', accentForeground: '0 0% 20%',
      border: '0 0% 90%', input: '0 0% 90%', ring: '0 0% 10%',
      destructive: '0 70% 50%', destructiveForeground: '0 0% 98%', success: '150 60% 40%', warning: '40 80% 50%', info: '210 70% 50%',
    }, dark: {
      background: '0 0% 7%', foreground: '0 0% 90%', card: '0 0% 10%', cardForeground: '0 0% 90%',
      primary: '0 0% 90%', primaryForeground: '0 0% 7%', secondary: '0 0% 15%', secondaryForeground: '0 0% 80%',
      muted: '0 0% 15%', mutedForeground: '0 0% 55%', accent: '0 0% 18%', accentForeground: '0 0% 80%',
      border: '0 0% 18%', input: '0 0% 18%', ring: '0 0% 90%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 98%', success: '150 55% 50%', warning: '40 75% 55%', info: '210 65% 55%',
    },
  },
  'linear-dark': {
    name: 'Linear Dark', light: {
      background: '240 10% 95%', foreground: '240 10% 20%', card: '240 8% 98%', cardForeground: '240 10% 20%',
      primary: '250 60% 55%', primaryForeground: '0 0% 98%', secondary: '240 8% 90%', secondaryForeground: '240 8% 35%',
      muted: '240 8% 90%', mutedForeground: '240 5% 50%', accent: '240 8% 88%', accentForeground: '240 8% 35%',
      border: '240 6% 85%', input: '240 6% 85%', ring: '250 60% 55%',
      destructive: '0 60% 50%', destructiveForeground: '0 0% 98%', success: '155 50% 45%', warning: '35 70% 50%', info: '220 60% 50%',
    }, dark: {
      background: '240 15% 9%', foreground: '240 10% 82%', card: '240 15% 12%', cardForeground: '240 10% 82%',
      primary: '250 60% 65%', primaryForeground: '240 15% 9%', secondary: '240 12% 18%', secondaryForeground: '240 8% 70%',
      muted: '240 12% 18%', mutedForeground: '240 8% 50%', accent: '240 12% 21%', accentForeground: '240 8% 70%',
      border: '240 12% 21%', input: '240 12% 21%', ring: '250 60% 65%',
      destructive: '0 55% 55%', destructiveForeground: '0 0% 98%', success: '155 45% 50%', warning: '35 65% 55%', info: '220 55% 55%',
    },
  },
  'raycast': {
    name: 'Raycast', light: {
      background: '0 0% 96%', foreground: '0 0% 15%', card: '0 0% 98%', cardForeground: '0 0% 15%',
      primary: '210 100% 55%', primaryForeground: '0 0% 98%', secondary: '0 0% 92%', secondaryForeground: '0 0% 25%',
      muted: '0 0% 92%', mutedForeground: '0 0% 50%', accent: '0 0% 90%', accentForeground: '0 0% 25%',
      border: '0 0% 88%', input: '0 0% 88%', ring: '210 100% 55%',
      destructive: '0 70% 50%', destructiveForeground: '0 0% 98%', success: '155 60% 40%', warning: '35 80% 50%', info: '210 100% 55%',
    }, dark: {
      background: '0 0% 10%', foreground: '0 0% 88%', card: '0 0% 13%', cardForeground: '0 0% 88%',
      primary: '210 100% 65%', primaryForeground: '0 0% 10%', secondary: '0 0% 18%', secondaryForeground: '0 0% 75%',
      muted: '0 0% 18%', mutedForeground: '0 0% 55%', accent: '0 0% 21%', accentForeground: '0 0% 75%',
      border: '0 0% 21%', input: '0 0% 21%', ring: '210 100% 65%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 98%', success: '155 55% 50%', warning: '35 75% 55%', info: '210 100% 65%',
    },
  },
  'cyber-neon': {
    name: 'Cyber Neon', light: {
      background: '240 15% 95%', foreground: '240 20% 20%', card: '240 12% 97%', cardForeground: '240 20% 20%',
      primary: '300 80% 50%', primaryForeground: '0 0% 98%', secondary: '240 12% 90%', secondaryForeground: '240 15% 35%',
      muted: '240 12% 90%', mutedForeground: '240 10% 50%', accent: '240 12% 88%', accentForeground: '240 15% 35%',
      border: '240 10% 85%', input: '240 10% 85%', ring: '300 80% 50%',
      destructive: '350 80% 50%', destructiveForeground: '0 0% 98%', success: '160 80% 40%', warning: '50 80% 50%', info: '200 80% 50%',
    }, dark: {
      background: '260 20% 8%', foreground: '180 20% 85%', card: '260 20% 11%', cardForeground: '180 20% 85%',
      primary: '300 80% 60%', primaryForeground: '260 20% 8%', secondary: '260 15% 18%', secondaryForeground: '180 15% 70%',
      muted: '260 15% 18%', mutedForeground: '180 10% 50%', accent: '260 15% 21%', accentForeground: '180 15% 70%',
      border: '260 15% 21%', input: '260 15% 21%', ring: '300 80% 60%',
      destructive: '350 75% 55%', destructiveForeground: '0 0% 98%', success: '160 75% 50%', warning: '50 75% 55%', info: '200 75% 55%',
    },
  },
  'frosted-glass': {
    name: 'Frosted Glass', light: {
      background: '210 20% 95%', foreground: '210 20% 20%', card: '210 15% 97%', cardForeground: '210 20% 20%',
      primary: '210 50% 50%', primaryForeground: '0 0% 98%', secondary: '210 15% 90%', secondaryForeground: '210 15% 35%',
      muted: '210 15% 90%', mutedForeground: '210 10% 50%', accent: '210 15% 88%', accentForeground: '210 15% 35%',
      border: '210 12% 85%', input: '210 12% 85%', ring: '210 50% 50%',
      destructive: '0 55% 50%', destructiveForeground: '0 0% 98%', success: '150 45% 45%', warning: '35 65% 50%', info: '210 50% 50%',
    }, dark: {
      background: '220 20% 10%', foreground: '210 15% 85%', card: '220 20% 13%', cardForeground: '210 15% 85%',
      primary: '210 55% 60%', primaryForeground: '220 20% 10%', secondary: '220 15% 20%', secondaryForeground: '210 12% 70%',
      muted: '220 15% 20%', mutedForeground: '210 10% 50%', accent: '220 15% 23%', accentForeground: '210 12% 70%',
      border: '220 15% 23%', input: '220 15% 23%', ring: '210 55% 60%',
      destructive: '0 50% 55%', destructiveForeground: '0 0% 98%', success: '150 40% 50%', warning: '35 60% 55%', info: '210 55% 60%',
    },
  },
  'mint-lab': {
    name: 'Mint Lab', light: {
      background: '160 15% 95%', foreground: '160 20% 20%', card: '160 12% 97%', cardForeground: '160 20% 20%',
      primary: '160 60% 40%', primaryForeground: '0 0% 98%', secondary: '160 12% 88%', secondaryForeground: '160 15% 35%',
      muted: '160 12% 88%', mutedForeground: '160 8% 50%', accent: '160 12% 86%', accentForeground: '160 15% 35%',
      border: '160 10% 82%', input: '160 10% 82%', ring: '160 60% 40%',
      destructive: '0 55% 50%', destructiveForeground: '0 0% 98%', success: '160 60% 40%', warning: '35 70% 50%', info: '200 55% 50%',
    }, dark: {
      background: '160 20% 10%', foreground: '160 15% 82%', card: '160 20% 13%', cardForeground: '160 15% 82%',
      primary: '160 60% 50%', primaryForeground: '160 20% 10%', secondary: '160 15% 20%', secondaryForeground: '160 12% 70%',
      muted: '160 15% 20%', mutedForeground: '160 10% 50%', accent: '160 15% 23%', accentForeground: '160 12% 70%',
      border: '160 15% 23%', input: '160 15% 23%', ring: '160 60% 50%',
      destructive: '0 50% 55%', destructiveForeground: '0 0% 98%', success: '160 55% 50%', warning: '35 65% 55%', info: '200 50% 55%',
    },
  },
  'amber-studio': {
    name: 'Amber Studio', light: {
      background: '35 20% 95%', foreground: '25 20% 20%', card: '35 15% 97%', cardForeground: '25 20% 20%',
      primary: '35 80% 45%', primaryForeground: '0 0% 98%', secondary: '35 12% 88%', secondaryForeground: '25 15% 35%',
      muted: '35 12% 88%', mutedForeground: '25 10% 50%', accent: '35 12% 86%', accentForeground: '25 15% 35%',
      border: '35 10% 82%', input: '35 10% 82%', ring: '35 80% 45%',
      destructive: '0 60% 50%', destructiveForeground: '0 0% 98%', success: '140 50% 40%', warning: '35 80% 50%', info: '200 55% 50%',
    }, dark: {
      background: '25 20% 10%', foreground: '35 15% 82%', card: '25 20% 13%', cardForeground: '35 15% 82%',
      primary: '35 80% 55%', primaryForeground: '25 20% 10%', secondary: '25 15% 20%', secondaryForeground: '35 12% 70%',
      muted: '25 15% 20%', mutedForeground: '35 10% 50%', accent: '25 15% 23%', accentForeground: '35 12% 70%',
      border: '25 15% 23%', input: '25 15% 23%', ring: '35 80% 55%',
      destructive: '0 55% 55%', destructiveForeground: '0 0% 98%', success: '140 45% 50%', warning: '35 75% 55%', info: '200 50% 55%',
    },
  },
  'rose-terminal': {
    name: 'Rose Terminal', light: {
      background: '350 10% 95%', foreground: '350 15% 20%', card: '350 8% 97%', cardForeground: '350 15% 20%',
      primary: '350 60% 50%', primaryForeground: '0 0% 98%', secondary: '350 8% 88%', secondaryForeground: '350 12% 35%',
      muted: '350 8% 88%', mutedForeground: '350 8% 50%', accent: '350 8% 86%', accentForeground: '350 12% 35%',
      border: '350 6% 82%', input: '350 6% 82%', ring: '350 60% 50%',
      destructive: '0 60% 50%', destructiveForeground: '0 0% 98%', success: '150 50% 40%', warning: '35 70% 50%', info: '210 55% 50%',
    }, dark: {
      background: '350 15% 10%', foreground: '350 12% 82%', card: '350 15% 13%', cardForeground: '350 12% 82%',
      primary: '350 60% 60%', primaryForeground: '350 15% 10%', secondary: '350 12% 20%', secondaryForeground: '350 10% 70%',
      muted: '350 12% 20%', mutedForeground: '350 8% 50%', accent: '350 12% 23%', accentForeground: '350 10% 70%',
      border: '350 12% 23%', input: '350 12% 23%', ring: '350 60% 60%',
      destructive: '0 55% 55%', destructiveForeground: '0 0% 98%', success: '150 45% 50%', warning: '35 65% 55%', info: '210 50% 55%',
    },
  },
  'slate-pro': {
    name: 'Slate Pro', light: {
      background: '215 15% 95%', foreground: '215 20% 20%', card: '215 12% 97%', cardForeground: '215 20% 20%',
      primary: '215 50% 50%', primaryForeground: '0 0% 98%', secondary: '215 12% 88%', secondaryForeground: '215 15% 35%',
      muted: '215 12% 88%', mutedForeground: '215 10% 50%', accent: '215 12% 86%', accentForeground: '215 15% 35%',
      border: '215 10% 82%', input: '215 10% 82%', ring: '215 50% 50%',
      destructive: '0 55% 50%', destructiveForeground: '0 0% 98%', success: '150 45% 40%', warning: '35 65% 50%', info: '215 50% 50%',
    }, dark: {
      background: '220 20% 10%', foreground: '215 15% 82%', card: '220 20% 13%', cardForeground: '215 15% 82%',
      primary: '215 55% 60%', primaryForeground: '220 20% 10%', secondary: '220 15% 20%', secondaryForeground: '215 12% 70%',
      muted: '220 15% 20%', mutedForeground: '215 10% 50%', accent: '220 15% 23%', accentForeground: '215 12% 70%',
      border: '220 15% 23%', input: '220 15% 23%', ring: '215 55% 60%',
      destructive: '0 50% 55%', destructiveForeground: '0 0% 98%', success: '150 40% 50%', warning: '35 60% 55%', info: '215 55% 60%',
    },
  },
  'oceanic': {
    name: 'Oceanic', light: {
      background: '200 20% 95%', foreground: '200 25% 20%', card: '200 15% 97%', cardForeground: '200 25% 20%',
      primary: '200 65% 45%', primaryForeground: '0 0% 98%', secondary: '200 12% 88%', secondaryForeground: '200 18% 35%',
      muted: '200 12% 88%', mutedForeground: '200 10% 50%', accent: '200 12% 86%', accentForeground: '200 18% 35%',
      border: '200 10% 82%', input: '200 10% 82%', ring: '200 65% 45%',
      destructive: '0 55% 50%', destructiveForeground: '0 0% 98%', success: '155 50% 40%', warning: '35 70% 50%', info: '200 65% 45%',
    }, dark: {
      background: '205 25% 10%', foreground: '200 18% 82%', card: '205 25% 13%', cardForeground: '200 18% 82%',
      primary: '200 65% 55%', primaryForeground: '205 25% 10%', secondary: '205 18% 20%', secondaryForeground: '200 15% 70%',
      muted: '205 18% 20%', mutedForeground: '200 12% 50%', accent: '205 18% 23%', accentForeground: '200 15% 70%',
      border: '205 18% 23%', input: '205 18% 23%', ring: '200 65% 55%',
      destructive: '0 50% 55%', destructiveForeground: '0 0% 98%', success: '155 45% 50%', warning: '35 65% 55%', info: '200 65% 55%',
    },
  },
  'windows-classic': {
    name: 'Windows Classic', light: {
      background: '210 20% 96%', foreground: '210 10% 15%', card: '0 0% 100%', cardForeground: '210 10% 15%',
      primary: '215 90% 45%', primaryForeground: '0 0% 100%', secondary: '210 10% 90%', secondaryForeground: '210 10% 30%',
      muted: '210 10% 90%', mutedForeground: '210 5% 45%', accent: '35 90% 50%', accentForeground: '0 0% 100%',
      border: '210 15% 80%', input: '210 15% 80%', ring: '215 90% 45%',
      destructive: '0 70% 50%', destructiveForeground: '0 0% 100%', success: '142 70% 35%', warning: '38 90% 50%', info: '200 80% 45%',
    }, dark: {
      background: '215 20% 10%', foreground: '0 0% 90%', card: '215 15% 12%', cardForeground: '0 0% 90%',
      primary: '215 80% 55%', primaryForeground: '0 0% 100%', secondary: '215 10% 20%', secondaryForeground: '0 0% 80%',
      muted: '215 10% 18%', mutedForeground: '215 5% 55%', accent: '35 80% 55%', accentForeground: '0 0% 100%',
      border: '215 15% 25%', input: '215 15% 25%', ring: '215 80% 55%',
      destructive: '0 70% 50%', destructiveForeground: '0 0% 100%', success: '142 70% 40%', warning: '38 90% 55%', info: '200 70% 50%',
    },
  },
  'windows-11': {
    name: 'Windows 11', light: {
      background: '220 10% 97%', foreground: '220 5% 15%', card: '0 0% 100%', cardForeground: '220 5% 15%',
      primary: '212 90% 48%', primaryForeground: '0 0% 100%', secondary: '220 5% 92%', secondaryForeground: '220 5% 35%',
      muted: '220 5% 92%', mutedForeground: '220 3% 50%', accent: '180 80% 45%', accentForeground: '0 0% 100%',
      border: '220 8% 85%', input: '220 8% 85%', ring: '212 90% 48%',
      destructive: '0 75% 55%', destructiveForeground: '0 0% 100%', success: '158 65% 40%', warning: '38 90% 55%', info: '197 85% 50%',
    }, dark: {
      background: '220 10% 8%', foreground: '0 0% 92%', card: '220 8% 10%', cardForeground: '0 0% 92%',
      primary: '212 85% 55%', primaryForeground: '0 0% 100%', secondary: '220 5% 15%', secondaryForeground: '0 0% 75%',
      muted: '220 5% 14%', mutedForeground: '220 3% 55%', accent: '180 75% 50%', accentForeground: '0 0% 100%',
      border: '220 8% 20%', input: '220 8% 20%', ring: '212 85% 55%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '158 60% 45%', warning: '38 90% 60%', info: '197 80% 55%',
    },
  },
  'ubuntu-aubergine': {
    name: 'Ubuntu', light: {
      background: '280 15% 96%', foreground: '280 10% 15%', card: '0 0% 100%', cardForeground: '280 10% 15%',
      primary: '280 50% 35%', primaryForeground: '0 0% 100%', secondary: '25 60% 55%', secondaryForeground: '0 0% 100%',
      muted: '280 10% 90%', mutedForeground: '280 5% 45%', accent: '25 70% 55%', accentForeground: '0 0% 100%',
      border: '280 15% 80%', input: '280 15% 80%', ring: '280 50% 35%',
      destructive: '0 60% 50%', destructiveForeground: '0 0% 100%', success: '145 50% 40%', warning: '35 80% 55%', info: '200 60% 45%',
    }, dark: {
      background: '280 20% 8%', foreground: '0 0% 90%', card: '280 15% 10%', cardForeground: '0 0% 90%',
      primary: '280 60% 45%', primaryForeground: '0 0% 100%', secondary: '25 65% 55%', secondaryForeground: '0 0% 100%',
      muted: '280 10% 15%', mutedForeground: '280 5% 60%', accent: '25 75% 60%', accentForeground: '0 0% 100%',
      border: '280 15% 22%', input: '280 15% 22%', ring: '280 60% 45%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '145 55% 45%', warning: '35 85% 60%', info: '200 65% 50%',
    },
  },
  'gnome-adwaita': {
    name: 'GNOME Adwaita', light: {
      background: '220 10% 96%', foreground: '220 5% 20%', card: '0 0% 100%', cardForeground: '220 5% 20%',
      primary: '212 80% 50%', primaryForeground: '0 0% 100%', secondary: '220 8% 92%', secondaryForeground: '220 5% 40%',
      muted: '220 8% 90%', mutedForeground: '220 3% 50%', accent: '160 55% 45%', accentForeground: '0 0% 100%',
      border: '220 10% 85%', input: '220 10% 85%', ring: '212 80% 50%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '145 55% 40%', warning: '35 85% 55%', info: '198 70% 50%',
    }, dark: {
      background: '220 10% 10%', foreground: '0 0% 90%', card: '220 8% 12%', cardForeground: '0 0% 90%',
      primary: '212 75% 55%', primaryForeground: '0 0% 100%', secondary: '220 5% 18%', secondaryForeground: '0 0% 75%',
      muted: '220 5% 15%', mutedForeground: '220 3% 60%', accent: '160 50% 50%', accentForeground: '0 0% 100%',
      border: '220 8% 22%', input: '220 8% 22%', ring: '212 75% 55%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '145 50% 45%', warning: '35 90% 55%', info: '198 65% 55%',
    },
  },
  'kali-dark': {
    name: 'Kali Linux', light: {
      background: '215 20% 94%', foreground: '215 10% 20%', card: '0 0% 100%', cardForeground: '215 10% 20%',
      primary: '210 80% 50%', primaryForeground: '0 0% 100%', secondary: '190 30% 70%', secondaryForeground: '215 10% 30%',
      muted: '215 10% 88%', mutedForeground: '215 5% 50%', accent: '190 60% 55%', accentForeground: '0 0% 100%',
      border: '215 12% 80%', input: '215 12% 80%', ring: '210 80% 50%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '160 55% 40%', warning: '38 85% 55%', info: '195 70% 50%',
    }, dark: {
      background: '215 30% 6%', foreground: '0 0% 92%', card: '215 20% 8%', cardForeground: '0 0% 92%',
      primary: '200 70% 55%', primaryForeground: '0 0% 100%', secondary: '195 35% 55%', secondaryForeground: '0 0% 85%',
      muted: '215 15% 12%', mutedForeground: '215 5% 60%', accent: '190 55% 60%', accentForeground: '0 0% 100%',
      border: '215 20% 18%', input: '215 20% 18%', ring: '200 70% 55%',
      destructive: '0 75% 55%', destructiveForeground: '0 0% 100%', success: '160 50% 45%', warning: '38 90% 60%', info: '195 65% 55%',
    },
  },
  'unix-terminal': {
    name: 'Unix Terminal', light: {
      background: '120 10% 95%', foreground: '120 5% 20%', card: '120 5% 90%', cardForeground: '120 5% 15%',
      primary: '120 50% 30%', primaryForeground: '120 10% 95%', secondary: '45 40% 55%', secondaryForeground: '120 5% 20%',
      muted: '120 5% 88%', mutedForeground: '120 3% 45%', accent: '45 60% 55%', accentForeground: '120 10% 95%',
      border: '120 10% 80%', input: '120 10% 80%', ring: '120 50% 30%',
      destructive: '0 60% 50%', destructiveForeground: '120 10% 95%', success: '120 50% 40%', warning: '45 70% 55%', info: '200 40% 45%',
    }, dark: {
      background: '120 10% 8%', foreground: '120 10% 80%', card: '120 5% 10%', cardForeground: '120 10% 75%',
      primary: '120 50% 50%', primaryForeground: '0 0% 0%', secondary: '45 40% 55%', secondaryForeground: '120 10% 75%',
      muted: '120 5% 14%', mutedForeground: '120 5% 50%', accent: '45 60% 60%', accentForeground: '0 0% 0%',
      border: '120 10% 20%', input: '120 10% 20%', ring: '120 50% 50%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 0%', success: '120 50% 45%', warning: '45 75% 55%', info: '200 40% 50%',
    },
  },
  'macos-aqua': {
    name: 'macOS Aqua', light: {
      background: '200 20% 96%', foreground: '200 5% 15%', card: '0 0% 100%', cardForeground: '200 5% 15%',
      primary: '200 90% 48%', primaryForeground: '0 0% 100%', secondary: '200 10% 92%', secondaryForeground: '200 5% 35%',
      muted: '200 10% 90%', mutedForeground: '200 3% 50%', accent: '160 60% 50%', accentForeground: '0 0% 100%',
      border: '200 10% 85%', input: '200 10% 85%', ring: '200 90% 48%',
      destructive: '0 75% 55%', destructiveForeground: '0 0% 100%', success: '145 55% 40%', warning: '38 90% 55%', info: '195 70% 50%',
    }, dark: {
      background: '200 15% 10%', foreground: '0 0% 90%', card: '200 10% 13%', cardForeground: '0 0% 90%',
      primary: '200 85% 55%', primaryForeground: '0 0% 100%', secondary: '200 8% 20%', secondaryForeground: '0 0% 75%',
      muted: '200 8% 16%', mutedForeground: '200 3% 55%', accent: '160 55% 55%', accentForeground: '0 0% 100%',
      border: '200 10% 25%', input: '200 10% 25%', ring: '200 85% 55%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '145 50% 45%', warning: '38 90% 60%', info: '195 65% 55%',
    },
  },
  'macos-graphite': {
    name: 'macOS Graphite', light: {
      background: '220 8% 96%', foreground: '220 3% 20%', card: '0 0% 100%', cardForeground: '220 3% 20%',
      primary: '220 20% 55%', primaryForeground: '0 0% 100%', secondary: '220 5% 92%', secondaryForeground: '220 3% 40%',
      muted: '220 5% 90%', mutedForeground: '220 2% 50%', accent: '220 25% 55%', accentForeground: '0 0% 100%',
      border: '220 6% 85%', input: '220 6% 85%', ring: '220 20% 55%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '170 40% 40%', warning: '38 80% 55%', info: '210 50% 50%',
    }, dark: {
      background: '220 8% 10%', foreground: '0 0% 90%', card: '220 5% 12%', cardForeground: '0 0% 90%',
      primary: '220 15% 60%', primaryForeground: '0 0% 100%', secondary: '220 3% 18%', secondaryForeground: '0 0% 75%',
      muted: '220 3% 15%', mutedForeground: '220 2% 55%', accent: '220 20% 60%', accentForeground: '0 0% 100%',
      border: '220 5% 22%', input: '220 5% 22%', ring: '220 15% 60%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '170 35% 45%', warning: '38 85% 60%', info: '210 45% 55%',
    },
  },
  'centos-blue': {
    name: 'CentOS', light: {
      background: '210 15% 96%', foreground: '210 5% 18%', card: '0 0% 100%', cardForeground: '210 5% 18%',
      primary: '210 70% 45%', primaryForeground: '0 0% 100%', secondary: '230 30% 85%', secondaryForeground: '210 5% 35%',
      muted: '210 8% 92%', mutedForeground: '210 3% 50%', accent: '230 40% 55%', accentForeground: '0 0% 100%',
      border: '210 10% 82%', input: '210 10% 82%', ring: '210 70% 45%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '150 50% 40%', warning: '38 85% 55%', info: '210 60% 45%',
    }, dark: {
      background: '215 20% 8%', foreground: '0 0% 90%', card: '215 15% 10%', cardForeground: '0 0% 90%',
      primary: '215 65% 50%', primaryForeground: '0 0% 100%', secondary: '230 25% 25%', secondaryForeground: '0 0% 80%',
      muted: '215 10% 14%', mutedForeground: '215 5% 55%', accent: '230 35% 40%', accentForeground: '0 0% 100%',
      border: '215 15% 20%', input: '215 15% 20%', ring: '215 65% 50%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '150 45% 45%', warning: '38 90% 60%', info: '210 55% 50%',
    },
  },
  'android-material': {
    name: 'Android Material', light: {
      background: '162 30% 96%', foreground: '162 10% 15%', card: '0 0% 100%', cardForeground: '162 10% 15%',
      primary: '162 55% 45%', primaryForeground: '0 0% 100%', secondary: '25 60% 90%', secondaryForeground: '162 10% 30%',
      muted: '162 15% 92%', mutedForeground: '162 5% 50%', accent: '25 70% 55%', accentForeground: '0 0% 100%',
      border: '162 15% 85%', input: '162 15% 85%', ring: '162 55% 45%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '150 55% 40%', warning: '38 90% 55%', info: '197 70% 50%',
    }, dark: {
      background: '162 25% 10%', foreground: '0 0% 92%', card: '162 15% 12%', cardForeground: '0 0% 92%',
      primary: '162 50% 52%', primaryForeground: '0 0% 100%', secondary: '25 50% 25%', secondaryForeground: '0 0% 80%',
      muted: '162 10% 16%', mutedForeground: '162 5% 60%', accent: '25 65% 60%', accentForeground: '0 0% 100%',
      border: '162 15% 22%', input: '162 15% 22%', ring: '162 50% 52%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '150 50% 45%', warning: '38 90% 60%', info: '197 65% 55%',
    },
  },
  'material-you': {
    name: 'Material You', light: {
      background: '260 20% 97%', foreground: '260 5% 18%', card: '0 0% 100%', cardForeground: '260 5% 18%',
      primary: '270 55% 50%', primaryForeground: '0 0% 100%', secondary: '30 40% 92%', secondaryForeground: '260 5% 35%',
      muted: '260 10% 94%', mutedForeground: '260 3% 50%', accent: '45 70% 55%', accentForeground: '0 0% 100%',
      border: '260 8% 88%', input: '260 8% 88%', ring: '270 55% 50%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '155 50% 42%', warning: '38 90% 55%', info: '195 65% 50%',
    }, dark: {
      background: '260 15% 10%', foreground: '0 0% 92%', card: '260 10% 13%', cardForeground: '0 0% 92%',
      primary: '270 50% 58%', primaryForeground: '0 0% 100%', secondary: '30 35% 22%', secondaryForeground: '0 0% 80%',
      muted: '260 8% 17%', mutedForeground: '260 3% 60%', accent: '45 65% 60%', accentForeground: '0 0% 100%',
      border: '260 8% 25%', input: '260 8% 25%', ring: '270 50% 58%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '155 45% 48%', warning: '38 90% 60%', info: '195 60% 55%',
    },
  },
  'debian-red': {
    name: 'Debian', light: {
      background: '0 10% 96%', foreground: '0 5% 15%', card: '0 0% 100%', cardForeground: '0 5% 15%',
      primary: '0 70% 50%', primaryForeground: '0 0% 100%', secondary: '0 10% 92%', secondaryForeground: '0 5% 35%',
      muted: '0 5% 90%', mutedForeground: '0 3% 50%', accent: '0 80% 55%', accentForeground: '0 0% 100%',
      border: '0 10% 85%', input: '0 10% 85%', ring: '0 70% 50%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '145 55% 40%', warning: '38 90% 55%', info: '210 60% 48%',
    }, dark: {
      background: '0 15% 10%', foreground: '0 0% 90%', card: '0 10% 12%', cardForeground: '0 0% 90%',
      primary: '0 65% 55%', primaryForeground: '0 0% 100%', secondary: '0 8% 18%', secondaryForeground: '0 0% 75%',
      muted: '0 5% 15%', mutedForeground: '0 3% 55%', accent: '0 75% 60%', accentForeground: '0 0% 100%',
      border: '0 10% 22%', input: '0 10% 22%', ring: '0 65% 55%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '145 50% 45%', warning: '38 90% 60%', info: '210 55% 52%',
    },
  },
  'fedora-blue': {
    name: 'Fedora', light: {
      background: '205 20% 97%', foreground: '205 5% 18%', card: '0 0% 100%', cardForeground: '205 5% 18%',
      primary: '205 75% 48%', primaryForeground: '0 0% 100%', secondary: '200 20% 92%', secondaryForeground: '205 5% 35%',
      muted: '205 10% 93%', mutedForeground: '205 3% 50%', accent: '55 70% 55%', accentForeground: '0 0% 100%',
      border: '205 10% 86%', input: '205 10% 86%', ring: '205 75% 48%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '145 55% 42%', warning: '38 90% 55%', info: '195 70% 50%',
    }, dark: {
      background: '205 15% 10%', foreground: '0 0% 92%', card: '205 10% 13%', cardForeground: '0 0% 92%',
      primary: '205 70% 55%', primaryForeground: '0 0% 100%', secondary: '200 15% 20%', secondaryForeground: '0 0% 78%',
      muted: '205 8% 16%', mutedForeground: '205 3% 58%', accent: '55 65% 60%', accentForeground: '0 0% 100%',
      border: '205 10% 24%', input: '205 10% 24%', ring: '205 70% 55%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '145 50% 48%', warning: '38 90% 60%', info: '195 65% 55%',
    },
  },
  'arch-minimal': {
    name: 'Arch Linux', light: {
      background: '190 10% 97%', foreground: '190 5% 18%', card: '0 0% 100%', cardForeground: '190 5% 18%',
      primary: '185 60% 45%', primaryForeground: '0 0% 100%', secondary: '180 15% 92%', secondaryForeground: '190 5% 35%',
      muted: '190 8% 93%', mutedForeground: '190 3% 50%', accent: '180 55% 50%', accentForeground: '0 0% 100%',
      border: '190 8% 86%', input: '190 8% 86%', ring: '185 60% 45%',
      destructive: '0 65% 55%', destructiveForeground: '0 0% 100%', success: '160 45% 40%', warning: '38 90% 55%', info: '195 65% 50%',
    }, dark: {
      background: '190 15% 8%', foreground: '0 0% 92%', card: '190 10% 11%', cardForeground: '0 0% 92%',
      primary: '185 55% 52%', primaryForeground: '0 0% 100%', secondary: '180 10% 18%', secondaryForeground: '0 0% 78%',
      muted: '190 6% 14%', mutedForeground: '190 3% 58%', accent: '180 50% 55%', accentForeground: '0 0% 100%',
      border: '190 8% 20%', input: '190 8% 20%', ring: '185 55% 52%',
      destructive: '0 70% 55%', destructiveForeground: '0 0% 100%', success: '160 40% 45%', warning: '38 90% 60%', info: '195 60% 55%',
    },
  },
}

export const THEME_LIST: { id: string; name: string }[] = Object.entries(THEMES).map(([id, theme]) => ({ id, name: theme.name }))

export function getThemeTokens(preset: string, mode: Mode): ThemeTokens {
  return THEMES[preset]?.[mode] ?? THEMES['material-you']![mode]
}
