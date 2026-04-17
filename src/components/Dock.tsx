import { Folder, LayoutGrid, MonitorCog, TerminalSquare } from 'lucide-react';
import clsx from 'clsx';
import { useDesktopStore } from '@/store/desktopStore';
import type { AppId, DockPosition } from '@/types';

const apps: Array<{ id: AppId; label: string; icon: typeof Folder }> = [
  { id: 'files', label: 'Arquivos', icon: Folder },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare },
  { id: 'settings', label: 'Configuracoes', icon: MonitorCog },
];

function positionClasses(position: DockPosition) {
  switch (position) {
    case 'left':
      return 'left-2 top-1/2 flex -translate-y-1/2 flex-col';
    case 'right':
      return 'right-2 top-1/2 flex -translate-y-1/2 flex-col';
    case 'top':
      return 'left-1/2 top-20 flex -translate-x-1/2 flex-row';
    case 'bottom':
    default:
      return 'bottom-5 left-1/2 flex -translate-x-1/2 flex-row';
  }
}

export function Dock() {
  const settings = useDesktopStore((state) => state.settings);
  const openWindow = useDesktopStore((state) => state.openWindow);
  const windows = useDesktopStore((state) => state.windows);
  const pinnedApps = useDesktopStore((state) => state.pinnedApps);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const minimizeWindow = useDesktopStore((state) => state.minimizeWindow);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const launcherOpen = useDesktopStore((state) => state.launcherOpen);
  const toggleLauncher = useDesktopStore((state) => state.toggleLauncher);
  const lateral = settings.dockPosition === 'left' || settings.dockPosition === 'right';
  const isDark = settings.theme === 'dark';
  const visibleApps = apps.filter(
    ({ id }) => pinnedApps.includes(id) || windows.some((window) => window.id === id),
  );
  const buttonSize = Math.max(40, settings.iconSize + 14);
  const glyphSize = Math.max(18, Math.round(settings.iconSize * 0.68));
  const dockFillAlpha = Math.max(0.04, Math.min(0.78, 0.95 - settings.dockTransparency / 100));
  const dockBlur = Math.max(6, Math.round(28 - settings.dockTransparency / 5));
  const panelMode = settings.panelMode;
  const panelButtonSize = Math.max(20, settings.iconSize - 8);
  const effectiveButtonSize = panelMode ? panelButtonSize : buttonSize;
  const panelGlyphSize = Math.max(12, Math.round(glyphSize * 0.82));
  const dockItems = panelMode
    ? [{ type: 'launcher' as const }, ...visibleApps.map((app) => ({ type: 'app' as const, ...app }))]
    : [...visibleApps.map((app) => ({ type: 'app' as const, ...app })), { type: 'launcher' as const }];

  const wrapperClasses =
    settings.dockPosition === 'left'
      ? 'left-0 top-1/2 -translate-y-1/2 pl-1 pr-3 py-2'
      : settings.dockPosition === 'right'
        ? 'right-0 top-1/2 -translate-y-1/2 pr-1 pl-3 py-2'
        : settings.dockPosition === 'top'
          ? 'top-0 left-1/2 -translate-x-1/2 pt-1 pb-3 px-2'
          : 'bottom-0 left-1/2 -translate-x-1/2 pb-1 pt-3 px-2';

  const panelWrapperClasses =
    settings.dockPosition === 'left'
      ? 'left-0 top-0 h-full pl-0 py-0'
      : settings.dockPosition === 'right'
        ? 'right-0 top-0 h-full pr-0 py-0'
        : settings.dockPosition === 'top'
          ? 'top-0 left-0 w-full px-0 py-0'
          : 'bottom-0 left-0 w-full px-0 py-0';

  const autoHideClasses =
    settings.dockPosition === 'left'
      ? 'translate-x-[calc(-100%+20px)] opacity-90 hover:translate-x-0'
      : settings.dockPosition === 'right'
        ? 'translate-x-[calc(100%-20px)] opacity-90 hover:translate-x-0'
        : settings.dockPosition === 'top'
          ? 'translate-y-[calc(-100%+20px)] opacity-90 hover:translate-y-0'
          : 'translate-y-[calc(100%-20px)] opacity-90 hover:translate-y-0';

  const panelAutoHideClasses =
    settings.dockPosition === 'left'
      ? 'translate-x-[calc(-100%+6px)] opacity-95 hover:translate-x-0'
      : settings.dockPosition === 'right'
        ? 'translate-x-[calc(100%-6px)] opacity-95 hover:translate-x-0'
        : settings.dockPosition === 'top'
          ? 'translate-y-[calc(-100%+6px)] opacity-95 hover:translate-y-0'
          : 'translate-y-[calc(100%-6px)] opacity-95 hover:translate-y-0';

  const topAlpha = Math.max(0.02, dockFillAlpha - (panelMode ? 0.08 : 0.05));
  const bottomAlpha = Math.max(0.05, dockFillAlpha);
  const dockBackground = `linear-gradient(180deg, rgb(var(--card) / ${topAlpha + 0.18}), rgb(var(--background) / ${bottomAlpha + 0.12}))`;

  return (
    <div
      className={clsx(
        'absolute z-[2000]',
        panelMode
          ? settings.autoHide
            ? panelWrapperClasses
            : panelWrapperClasses
          : settings.autoHide
            ? wrapperClasses
            : positionClasses(settings.dockPosition),
      )}
    >
      <aside
        className={clsx(
          'transition duration-300',
          panelMode
            ? lateral
              ? 'flex h-full flex-col items-center gap-0.5 px-1 py-1.5'
              : 'flex w-full items-center justify-start gap-0.5 px-2 py-1'
            : lateral
              ? 'flex flex-col items-center gap-1 p-2.5'
              : 'flex items-center gap-1 p-2.5',
          settings.autoHide ? (panelMode ? panelAutoHideClasses : autoHideClasses) : 'opacity-100',
        )}
        style={{
          backdropFilter: `blur(${dockBlur}px) saturate(${Math.max(105, 145 - settings.dockTransparency / 2)}%)`,
          WebkitBackdropFilter: `blur(${dockBlur}px) saturate(${Math.max(105, 145 - settings.dockTransparency / 2)}%)`,
          borderRadius: `${panelMode ? Math.max(0, settings.dockRadius - 24) : Math.max(0, settings.dockRadius)}px`,
          background: dockBackground,
          boxShadow: panelMode
            ? `inset 0 1px 0 rgb(var(--foreground) / 0.03), 0 6px 16px rgb(0 0 0 / ${0.02 + dockFillAlpha * 0.1})`
            : `inset 0 1px 0 rgb(var(--foreground) / 0.04), 0 14px 34px rgb(0 0 0 / ${0.03 + dockFillAlpha * 0.12})`,
          border: '1px solid rgb(var(--border) / 0.7)',
        }}
      >
        <div className={clsx(lateral ? 'flex flex-col items-center gap-0.5' : 'flex items-center gap-0.5')}>
          {dockItems.map((item, index) => {
            const shouldShowDivider = panelMode && index === 1;

            return (
              <div
                key={item.type === 'launcher' ? 'launcher' : item.id}
                className={clsx(lateral ? 'flex flex-col items-center gap-0.5' : 'flex items-center gap-0.5')}
              >
                {shouldShowDivider ? (
                  <div
                    className={clsx(
                      lateral ? 'my-1 h-px w-4' : 'mx-1 h-4 w-px',
                      'bg-border/70'
                    )}
                  />
                ) : null}

                {item.type === 'launcher' ? (
                  <button
                    type="button"
                    title="Aplicativos"
                    onClick={() => toggleLauncher()}
                    className={clsx(
                      'group relative flex items-center justify-center transition duration-200',
                      'text-foreground',
                      panelMode
                        ? clsx(
                          'rounded-lg bg-transparent',
                          'hover:bg-accent/70'
                        )
                        : clsx(
                          'rounded-xl bg-transparent hover:-translate-y-0.5',
                          'hover:bg-accent/70'
                        ),
                      launcherOpen ? 'bg-accent text-accent-foreground' : '',
                    )}
                    style={{ width: `${effectiveButtonSize}px`, height: `${effectiveButtonSize}px` }}
                  >
                    <LayoutGrid
                      style={{
                        width: `${panelMode ? panelGlyphSize : glyphSize}px`,
                        height: `${panelMode ? panelGlyphSize : glyphSize}px`,
                      }}
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const targetWindow = windows.find((window) => window.id === item.id);
                      const isActive = targetWindow && !targetWindow.minimized && activeWindowId === item.id;

                      if (isActive) {
                        minimizeWindow(item.id);
                        return;
                      }

                      if (targetWindow && !targetWindow.minimized) {
                        focusWindow(item.id);
                        return;
                      }

                      openWindow(item.id);
                    }}
                    className={clsx(
                      'group relative flex items-center justify-center transition duration-200',
                      'text-foreground',
                      panelMode
                        ? clsx(
                          'rounded-lg bg-transparent',
                          'hover:bg-accent/70 hover:text-accent-foreground'
                        )
                        : clsx(
                          'rounded-xl bg-transparent hover:-translate-y-0.5',
                          'hover:bg-accent/70 hover:text-accent-foreground'
                        ),
                    )}
                    style={{ width: `${effectiveButtonSize}px`, height: `${effectiveButtonSize}px` }}
                    title={item.label}
                  >
                    <item.icon
                      style={{
                        width: `${panelMode ? panelGlyphSize : glyphSize}px`,
                        height: `${panelMode ? panelGlyphSize : glyphSize}px`,
                      }}
                    />
                    <span
                      className={clsx(
                        'absolute transition',
                        panelMode ? '-bottom-[1px] h-0.5 w-2 rounded-full opacity-90' : '-bottom-1 h-0.5 w-3 rounded-full',
                        windows.some((window) => window.id === item.id && !window.minimized)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                      style={{ backgroundColor: 'rgb(var(--color-glow))' }}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
