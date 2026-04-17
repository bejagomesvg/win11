import { create } from 'zustand';
import { api } from '@/lib/api';
import type { AppId, ColorTheme, DockPosition, Settings, ThemeMode, User, WindowState } from '@/types';

const settingsStorageKey = 'win11-desktop-settings';

const defaultSettings: Settings = {
  theme: 'dark',
  colorTheme: 'blue',
  interfaceRadius: 5,
  dockPosition: 'bottom',
  autoHide: false,
  panelMode: false,
  iconSize: 34,
  dockRadius: 0,
  dockTransparency: 92,
};

function clampSettings(raw: Partial<Settings> | null | undefined): Settings {
  return {
    theme: raw?.theme === 'light' ? 'light' : 'dark',
    colorTheme: raw?.colorTheme ?? defaultSettings.colorTheme,
    interfaceRadius: Math.min(25, Math.max(2, Number(raw?.interfaceRadius ?? defaultSettings.interfaceRadius))),
    dockPosition: raw?.dockPosition ?? defaultSettings.dockPosition,
    autoHide: Boolean(raw?.autoHide),
    panelMode: Boolean(raw?.panelMode),
    iconSize: Math.min(56, Math.max(24, Number(raw?.iconSize ?? defaultSettings.iconSize))),
    dockRadius: Math.min(40, Math.max(0, Number(raw?.dockRadius ?? defaultSettings.dockRadius))),
    dockTransparency: Math.min(100, Math.max(35, Number(raw?.dockTransparency ?? defaultSettings.dockTransparency))),
  };
}

function readStoredSettings() {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const raw = window.localStorage.getItem(settingsStorageKey);
    if (!raw) {
      return defaultSettings;
    }

    return clampSettings(JSON.parse(raw) as Partial<Settings>);
  } catch {
    return defaultSettings;
  }
}

function persistSettings(settings: Settings) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

const appTitles: Record<AppId, string> = {
  files: 'Arquivos',
  terminal: 'Terminal',
  settings: 'Configuracoes',
};

interface DesktopStore {
  user: User | null;
  settings: Settings;
  windows: WindowState[];
  activeWindowId: AppId | null;
  launcherOpen: boolean;
  pinnedApps: AppId[];
  authLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
  toggleLauncher: () => void;
  closeLauncher: () => void;
  togglePinnedApp: (id: AppId) => void;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  toggleMaximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, width: number, height: number, x?: number, y?: number) => void;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
}

function getWindowStartPosition(totalWindows: number) {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 720;
  const baseX = Math.max(20, Math.round((viewportWidth - 720) / 2));
  const baseY = Math.max(72, Math.round((viewportHeight - 600) / 2));

  return {
    x: baseX + totalWindows * 24,
    y: baseY + totalWindows * 18,
  };
}

const DEFAULT_WINDOW_WIDTH = 720;
const DEFAULT_WINDOW_HEIGHT = 600;

function getMaximizedWindowBounds() {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 720;

  return {
    x: 20,
    y: 72,
    width: Math.max(MIN_WINDOW_WIDTH, viewportWidth - 40),
    height: Math.max(MIN_WINDOW_HEIGHT, viewportHeight - 92),
  };
}

const MIN_WINDOW_WIDTH = 520;
const MIN_WINDOW_HEIGHT = 320;

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  user: null,
  settings: readStoredSettings(),
  windows: [],
  activeWindowId: null,
  launcherOpen: false,
  pinnedApps: ['files', 'terminal', 'settings'],
  authLoading: true,

  bootstrap: async () => {
    try {
      const [{ data: userData }, { data: settingsData }] = await Promise.all([
        api.get('/user'),
        api.get('/settings'),
      ]);

      set({
        user: userData.user,
        settings: clampSettings(settingsData.settings),
        authLoading: false,
      });
      persistSettings(clampSettings(settingsData.settings));
    } catch {
      set({
        user: null,
        settings: readStoredSettings(),
        authLoading: false,
        windows: [],
        activeWindowId: null,
        launcherOpen: false,
        pinnedApps: ['files', 'terminal', 'settings'],
      });
    }
  },

  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    const settingsResponse = await api.get('/settings');

    set({
      user: data.user,
      settings: clampSettings(settingsResponse.data.settings),
      authLoading: false,
    });
    persistSettings(clampSettings(settingsResponse.data.settings));
  },

  logout: async () => {
    await api.delete('/auth/logout');
    const cachedSettings = readStoredSettings();
    set({
      user: null,
      settings: cachedSettings,
      windows: [],
      activeWindowId: null,
      launcherOpen: false,
      pinnedApps: ['files', 'terminal', 'settings'],
      authLoading: false,
    });
  },

  toggleLauncher: () =>
    set((state) => ({
      launcherOpen: !state.launcherOpen,
    })),

  closeLauncher: () =>
    set({
      launcherOpen: false,
    }),

  togglePinnedApp: (id) =>
    set((state) => ({
      pinnedApps: state.pinnedApps.includes(id)
        ? state.pinnedApps.filter((appId) => appId !== id)
        : [...state.pinnedApps, id],
    })),

  openWindow: (id) =>
    set((state) => {
      const existing = state.windows.find((window) => window.id === id);
      const nextZ = Math.max(10, ...state.windows.map((window) => window.zIndex)) + 1;

      if (existing) {
        return {
          windows: state.windows.map((window) =>
            window.id === id ? { ...window, minimized: false, zIndex: nextZ } : window,
          ),
          activeWindowId: id,
          launcherOpen: false,
        };
      }

      const startPosition = getWindowStartPosition(state.windows.length);

      return {
        windows: [
          ...state.windows,
           {
             id,
             title: appTitles[id],
             minimized: false,
             maximized: false,
             zIndex: nextZ,
             x: startPosition.x,
             y: startPosition.y,
             width: DEFAULT_WINDOW_WIDTH,
             height: DEFAULT_WINDOW_HEIGHT,
          },
        ],
        activeWindowId: id,
        launcherOpen: false,
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, minimized: true } : window,
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),

  toggleMaximizeWindow: (id) =>
    set((state) => {
      const nextZ = Math.max(10, ...state.windows.map((window) => window.zIndex)) + 1;

      return {
        windows: state.windows.map((window) => {
          if (window.id !== id) {
            return window;
          }

          if (window.maximized && window.restoreBounds) {
            return {
              ...window,
              ...window.restoreBounds,
              maximized: false,
              restoreBounds: undefined,
              zIndex: nextZ,
            };
          }

          return {
            ...window,
            ...getMaximizedWindowBounds(),
            maximized: true,
            minimized: false,
            restoreBounds: {
              x: window.x,
              y: window.y,
              width: window.width,
              height: window.height,
            },
            zIndex: nextZ,
          };
        }),
        activeWindowId: id,
      };
    }),

  focusWindow: (id) =>
    set((state) => {
      const nextZ = Math.max(10, ...state.windows.map((window) => window.zIndex)) + 1;
      return {
        windows: state.windows.map((window) =>
          window.id === id ? { ...window, minimized: false, zIndex: nextZ } : window,
        ),
        activeWindowId: id,
      };
    }),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id && !window.maximized
          ? {
              ...window,
              x,
              y,
            }
          : window,
      ),
    })),

  resizeWindow: (id, width, height, x, y) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id && !window.maximized
          ? {
              ...window,
              width,
              height,
              x: x ?? window.x,
              y: y ?? window.y,
            }
          : window,
      ),
    })),

  updateSettings: async (partial) => {
    const current = get().settings;
    const nextSettings = {
      ...current,
      ...partial,
    };

    await api.post('/settings', nextSettings);
    persistSettings(clampSettings(nextSettings));

    set({
      settings: clampSettings(nextSettings),
    });
  },
}));
