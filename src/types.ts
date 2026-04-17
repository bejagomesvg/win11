export type ThemeMode = 'light' | 'dark';
export type DockPosition = 'left' | 'right' | 'top' | 'bottom';
export type AppId = 'files' | 'terminal' | 'settings';
export type ColorTheme =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'mist'
  | 'blue'
  | 'purple'
  | 'fuchsia'
  | 'pink';

export interface User {
  id: number;
  username: string;
}

export interface Settings {
  theme: ThemeMode;
  colorTheme: ColorTheme;
  dockPosition: DockPosition;
  autoHide: boolean;
  panelMode: boolean;
  iconSize: number;
  dockRadius: number;
  dockTransparency: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  minimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
