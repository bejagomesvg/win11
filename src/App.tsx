import { useEffect } from 'react';
import { DesktopPage } from '@/pages/DesktopPage';
import { LoginPage } from '@/pages/LoginPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useDesktopStore } from '@/store/desktopStore';

type ThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
};

const colorThemeVars: Record<
  string,
  {
    primary: string;
    glow: string;
    soft: string;
    dark: Omit<ThemeTokens, 'background' | 'foreground' | 'card' | 'cardForeground' | 'popover' | 'popoverForeground' | 'secondaryForeground' | 'mutedForeground' | 'accentForeground' | 'primaryForeground'>;
    light: Omit<ThemeTokens, 'background' | 'foreground' | 'card' | 'cardForeground' | 'popover' | 'popoverForeground' | 'secondaryForeground' | 'mutedForeground' | 'accentForeground' | 'primaryForeground'>;
  }
> = {
  red: {
    primary: '239 68 68',
    glow: '248 113 113',
    soft: '127 29 29',
    dark: { primary: '239 68 68', secondary: '69 18 24', muted: '63 20 24', accent: '93 24 32', border: '130 34 43', input: '152 44 54', ring: '248 113 113' },
    light: { primary: '220 38 38', secondary: '254 242 242', muted: '254 242 242', accent: '254 226 226', border: '252 165 165', input: '248 113 113', ring: '239 68 68' },
  },
  orange: {
    primary: '249 115 22',
    glow: '251 146 60',
    soft: '124 45 18',
    dark: { primary: '249 115 22', secondary: '72 30 12', muted: '66 32 16', accent: '102 47 18', border: '133 63 23', input: '154 74 26', ring: '251 146 60' },
    light: { primary: '234 88 12', secondary: '255 247 237', muted: '255 247 237', accent: '255 237 213', border: '253 186 116', input: '251 146 60', ring: '249 115 22' },
  },
  yellow: {
    primary: '234 179 8',
    glow: '250 204 21',
    soft: '113 63 18',
    dark: { primary: '234 179 8', secondary: '68 49 8', muted: '64 49 14', accent: '94 72 12', border: '128 95 18', input: '148 111 24', ring: '250 204 21' },
    light: { primary: '202 138 4', secondary: '254 252 232', muted: '254 252 232', accent: '254 249 195', border: '253 224 71', input: '250 204 21', ring: '234 179 8' },
  },
  green: {
    primary: '34 197 94',
    glow: '74 222 128',
    soft: '20 83 45',
    dark: { primary: '34 197 94', secondary: '17 52 35', muted: '19 54 38', accent: '20 83 45', border: '28 112 63', input: '34 128 74', ring: '74 222 128' },
    light: { primary: '22 163 74', secondary: '240 253 244', muted: '240 253 244', accent: '220 252 231', border: '134 239 172', input: '74 222 128', ring: '34 197 94' },
  },
  teal: {
    primary: '20 184 166',
    glow: '45 212 191',
    soft: '17 94 89',
    dark: { primary: '20 184 166', secondary: '19 49 47', muted: '20 56 54', accent: '17 94 89', border: '25 126 118', input: '29 148 139', ring: '45 212 191' },
    light: { primary: '13 148 136', secondary: '240 253 250', muted: '240 253 250', accent: '204 251 241', border: '153 246 228', input: '45 212 191', ring: '20 184 166' },
  },
  mist: {
    primary: '34 211 238',
    glow: '103 232 249',
    soft: '8 47 73',
    dark: { primary: '34 211 238', secondary: '12 43 56', muted: '15 52 68', accent: '8 74 96', border: '19 110 131', input: '24 128 152', ring: '103 232 249' },
    light: { primary: '8 145 178', secondary: '236 254 255', muted: '236 254 255', accent: '207 250 254', border: '103 232 249', input: '34 211 238', ring: '34 211 238' },
  },
  blue: {
    primary: '59 130 246',
    glow: '96 165 250',
    soft: '30 58 138',
    dark: { primary: '59 130 246', secondary: '18 37 74', muted: '21 42 82', accent: '30 58 138', border: '39 78 160', input: '47 95 196', ring: '96 165 250' },
    light: { primary: '37 99 235', secondary: '239 246 255', muted: '239 246 255', accent: '219 234 254', border: '147 197 253', input: '96 165 250', ring: '59 130 246' },
  },
  purple: {
    primary: '139 92 246',
    glow: '167 139 250',
    soft: '76 29 149',
    dark: { primary: '139 92 246', secondary: '45 24 78', muted: '53 30 91', accent: '76 29 149', border: '98 47 183', input: '113 62 214', ring: '167 139 250' },
    light: { primary: '124 58 237', secondary: '245 243 255', muted: '245 243 255', accent: '237 233 254', border: '196 181 253', input: '167 139 250', ring: '139 92 246' },
  },
  fuchsia: {
    primary: '217 70 239',
    glow: '232 121 249',
    soft: '112 26 117',
    dark: { primary: '217 70 239', secondary: '66 21 74', muted: '75 28 82', accent: '112 26 117', border: '146 39 153', input: '168 50 176', ring: '232 121 249' },
    light: { primary: '192 38 211', secondary: '253 244 255', muted: '253 244 255', accent: '250 232 255', border: '240 171 252', input: '232 121 249', ring: '217 70 239' },
  },
  pink: {
    primary: '236 72 153',
    glow: '244 114 182',
    soft: '131 24 67',
    dark: { primary: '236 72 153', secondary: '74 20 46', muted: '83 25 52', accent: '131 24 67', border: '171 35 93', input: '196 45 109', ring: '244 114 182' },
    light: { primary: '219 39 119', secondary: '253 242 248', muted: '253 242 248', accent: '252 231 243', border: '249 168 212', input: '244 114 182', ring: '236 72 153' },
  },
};

const baseThemeTokens = {
  dark: {
    background: '9 9 11',
    foreground: '250 250 250',
    card: '24 24 27',
    cardForeground: '250 250 250',
    popover: '24 24 27',
    popoverForeground: '250 250 250',
    primary: '250 250 250',
    primaryForeground: '24 24 27',
    secondary: '39 39 42',
    secondaryForeground: '250 250 250',
    muted: '39 39 42',
    mutedForeground: '161 161 170',
    accent: '39 39 42',
    accentForeground: '250 250 250',
    border: '63 63 70',
    input: '63 63 70',
    ring: '212 212 216',
  },
  light: {
    background: '244 244 245',
    foreground: '9 9 11',
    card: '250 250 250',
    cardForeground: '9 9 11',
    popover: '255 255 255',
    popoverForeground: '9 9 11',
    primary: '24 24 27',
    primaryForeground: '250 250 250',
    secondary: '239 239 240',
    secondaryForeground: '24 24 27',
    muted: '239 239 240',
    mutedForeground: '113 113 122',
    accent: '239 239 240',
    accentForeground: '24 24 27',
    border: '212 212 216',
    input: '212 212 216',
    ring: '161 161 170',
  },
};

const loginThemeTokens: ThemeTokens = {
  background: '9 20 44',
  foreground: '248 250 252',
  card: '15 23 42',
  cardForeground: '248 250 252',
  popover: '15 23 42',
  popoverForeground: '248 250 252',
  primary: '96 165 250',
  primaryForeground: '248 250 252',
  secondary: '30 41 59',
  secondaryForeground: '248 250 252',
  muted: '30 41 59',
  mutedForeground: '203 213 225',
  accent: '37 99 235',
  accentForeground: '248 250 252',
  border: '71 85 105',
  input: '96 165 250',
  ring: '96 165 250',
};

export default function App() {
  const user = useDesktopStore((state) => state.user);
  const authLoading = useDesktopStore((state) => state.authLoading);
  const settings = useDesktopStore((state) => state.settings);
  const bootstrap = useDesktopStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!user) {
      document.documentElement.classList.remove('dark');
      return;
    }

    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme, user]);

  useEffect(() => {
    if (!user) {
      document.documentElement.removeAttribute('data-color-theme');
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'dark';
      document.documentElement.style.setProperty('--color-primary', '96 165 250');
      document.documentElement.style.setProperty('--color-glow', '191 219 254');
      document.documentElement.style.setProperty('--color-soft', '30 64 175');
      document.documentElement.style.setProperty('--background', loginThemeTokens.background);
      document.documentElement.style.setProperty('--foreground', loginThemeTokens.foreground);
      document.documentElement.style.setProperty('--card', loginThemeTokens.card);
      document.documentElement.style.setProperty('--card-foreground', loginThemeTokens.cardForeground);
      document.documentElement.style.setProperty('--popover', loginThemeTokens.popover);
      document.documentElement.style.setProperty('--popover-foreground', loginThemeTokens.popoverForeground);
      document.documentElement.style.setProperty('--primary', loginThemeTokens.primary);
      document.documentElement.style.setProperty('--primary-foreground', loginThemeTokens.primaryForeground);
      document.documentElement.style.setProperty('--secondary', loginThemeTokens.secondary);
      document.documentElement.style.setProperty('--secondary-foreground', loginThemeTokens.secondaryForeground);
      document.documentElement.style.setProperty('--muted', loginThemeTokens.muted);
      document.documentElement.style.setProperty('--muted-foreground', loginThemeTokens.mutedForeground);
      document.documentElement.style.setProperty('--accent', loginThemeTokens.accent);
      document.documentElement.style.setProperty('--accent-foreground', loginThemeTokens.accentForeground);
      document.documentElement.style.setProperty('--border', loginThemeTokens.border);
      document.documentElement.style.setProperty('--input', loginThemeTokens.input);
      document.documentElement.style.setProperty('--ring', loginThemeTokens.ring);
      document.documentElement.style.setProperty('--radius', '12px');
      return;
    }

    const palette = colorThemeVars[settings.colorTheme] || colorThemeVars.blue;
    const activeTokens = settings.theme === 'dark'
      ? baseThemeTokens.dark
      : baseThemeTokens.light;

    document.documentElement.dataset.colorTheme = settings.colorTheme;
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.style.colorScheme = settings.theme;
    document.documentElement.style.setProperty('--color-primary', palette.primary);
    document.documentElement.style.setProperty('--color-glow', palette.glow);
    document.documentElement.style.setProperty('--color-soft', palette.soft);
    document.documentElement.style.setProperty('--background', activeTokens.background);
    document.documentElement.style.setProperty('--foreground', activeTokens.foreground);
    document.documentElement.style.setProperty('--card', activeTokens.card);
    document.documentElement.style.setProperty('--card-foreground', activeTokens.cardForeground);
    document.documentElement.style.setProperty('--popover', activeTokens.popover);
    document.documentElement.style.setProperty('--popover-foreground', activeTokens.popoverForeground);
    document.documentElement.style.setProperty('--primary', palette.primary);
    document.documentElement.style.setProperty('--primary-foreground', activeTokens.primaryForeground);
    document.documentElement.style.setProperty('--secondary', activeTokens.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', activeTokens.secondaryForeground);
    document.documentElement.style.setProperty('--muted', activeTokens.muted);
    document.documentElement.style.setProperty('--muted-foreground', activeTokens.mutedForeground);
    document.documentElement.style.setProperty('--accent', activeTokens.accent);
    document.documentElement.style.setProperty('--accent-foreground', activeTokens.accentForeground);
    document.documentElement.style.setProperty('--border', activeTokens.border);
    document.documentElement.style.setProperty('--input', activeTokens.input);
    document.documentElement.style.setProperty('--ring', palette.glow);
    document.documentElement.style.setProperty('--radius', `${settings.interfaceRadius}px`);
  }, [settings.colorTheme, settings.interfaceRadius, settings.theme, user]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return user ? <DesktopPage /> : <LoginPage />;
}
