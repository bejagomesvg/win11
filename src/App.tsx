import { useEffect } from 'react';
import { DesktopPage } from '@/pages/DesktopPage';
import { LoginPage } from '@/pages/LoginPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useDesktopStore } from '@/store/desktopStore';

const colorThemeVars: Record<string, { primary: string; glow: string; soft: string }> = {
  red: { primary: '239 68 68', glow: '248 113 113', soft: '127 29 29' },
  orange: { primary: '249 115 22', glow: '251 146 60', soft: '124 45 18' },
  yellow: { primary: '234 179 8', glow: '250 204 21', soft: '113 63 18' },
  green: { primary: '34 197 94', glow: '74 222 128', soft: '20 83 45' },
  teal: { primary: '20 184 166', glow: '45 212 191', soft: '17 94 89' },
  mist: { primary: '103 232 249', glow: '34 211 238', soft: '8 47 73' },
  blue: { primary: '59 130 246', glow: '96 165 250', soft: '30 58 138' },
  purple: { primary: '139 92 246', glow: '167 139 250', soft: '76 29 149' },
  fuchsia: { primary: '217 70 239', glow: '232 121 249', soft: '112 26 117' },
  pink: { primary: '236 72 153', glow: '244 114 182', soft: '131 24 67' },
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
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  useEffect(() => {
    const palette = colorThemeVars[settings.colorTheme] || colorThemeVars.blue;
    document.documentElement.dataset.colorTheme = settings.colorTheme;
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.style.setProperty('--color-primary', palette.primary);
    document.documentElement.style.setProperty('--color-glow', palette.glow);
    document.documentElement.style.setProperty('--color-soft', palette.soft);
  }, [settings.colorTheme, settings.theme]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return user ? <DesktopPage /> : <LoginPage />;
}
