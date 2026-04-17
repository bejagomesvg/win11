import clsx from 'clsx';
import { useDesktopStore } from '@/store/desktopStore';
import type { ColorTheme, DockPosition, ThemeMode } from '@/types';

const themeOptions: ThemeMode[] = ['light', 'dark'];
const dockOptions: DockPosition[] = ['left', 'right', 'top', 'bottom'];
const colorThemeOptions: Array<{ value: ColorTheme; swatch: string; label: string }> = [
  { value: 'red', swatch: '#ef4444', label: 'Red' },
  { value: 'orange', swatch: '#f97316', label: 'Orange' },
  { value: 'yellow', swatch: '#eab308', label: 'Yellow' },
  { value: 'green', swatch: '#65a30d', label: 'Green' },
  { value: 'teal', swatch: '#14b8a6', label: 'Teal' },
  { value: 'mist', swatch: '#67e8f9', label: 'Mist' },
  { value: 'blue', swatch: '#3b82f6', label: 'Blue' },
  { value: 'purple', swatch: '#8b5cf6', label: 'Purple' },
  { value: 'fuchsia', swatch: '#d946ef', label: 'Fuchsia' },
  { value: 'pink', swatch: '#ec4899', label: 'Pink' },
];

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  darkMode,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  darkMode: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between rounded-2xl border px-4 py-3',
        darkMode ? 'border-white/10 bg-slate-950/35' : 'border-slate-300/70 bg-white/70',
      )}
    >
      <div>
        <p className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>
          {title}
        </p>
        <p className={clsx('mt-1 text-xs', darkMode ? 'text-slate-400' : 'text-slate-600')}>
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-7 w-12 rounded-full transition',
          checked ? '' : darkMode ? 'bg-white/15' : 'bg-slate-300',
        )}
        style={checked ? { backgroundColor: 'rgb(var(--color-primary))' } : undefined}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPanel() {
  const settings = useDesktopStore((state) => state.settings);
  const updateSettings = useDesktopStore((state) => state.updateSettings);
  const darkMode = settings.theme === 'dark';

  return (
    <div className="space-y-6 pb-10">
      <section
        className={clsx(
          'rounded-3xl border p-5 transition-colors',
          darkMode ? 'border-white/10 bg-white/5' : 'border-slate-300/70 bg-white/75',
        )}
      >
        <h3 className={clsx('font-display text-xl font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>
          Themes
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {themeOptions.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => void updateSettings({ theme })}
              className={clsx('rounded-2xl border p-3 text-left transition', theme === settings.theme
                ? darkMode ? 'bg-white/10' : 'bg-slate-100'
                : darkMode ? 'border-white/10 bg-slate-950/30 hover:bg-white/10' : 'border-slate-300/70 bg-white/70 hover:bg-white')}
              style={
                theme === settings.theme
                  ? {
                      borderColor: 'rgb(var(--color-primary))',
                      boxShadow: '0 0 0 1px rgba(var(--color-primary), 0.35)',
                    }
                  : undefined
              }
            >
              <div
                className={clsx(
                  'relative h-24 overflow-hidden rounded-xl border border-white/10',
                  theme === 'light'
                    ? 'bg-[linear-gradient(180deg,#8ec5ff,#2f8fff)]'
                    : 'bg-[linear-gradient(180deg,#77bbff,#1b7df2)]',
                )}
              >
                <div className={clsx(
                  'absolute left-6 top-7 h-10 w-14 rounded-md shadow-lg',
                  theme === 'light' ? 'bg-white' : 'bg-slate-900',
                )} />
                <div className="absolute left-11 top-3 h-10 w-16 rounded-md bg-black/45" />
              </div>
              <p className={clsx('mt-3 text-center text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>
                {theme === 'light' ? 'Light' : 'Dark'}
              </p>
            </button>
          ))}
        </div>

        <div className={clsx('mt-4 rounded-2xl border px-4 py-3', darkMode ? 'border-white/10 bg-slate-950/35' : 'border-slate-300/70 bg-white/70')}>
          <p className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>Color</p>
          <div
            className={clsx(
              'mt-1 flex flex-wrap items-center justify-center gap-2 px-1 pb-1 pt-0',
              darkMode ? 'bg-transparent' : 'bg-transparent',
            )}
          >
            {colorThemeOptions.map((option) => {
              const selected = settings.colorTheme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => void updateSettings({ colorTheme: option.value })}
                  className={clsx(
                    'relative flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded-full transition',
                    selected
                      ? 'shadow-[0_0_0_2px_var(--swatch-ring),0_0_6px_var(--swatch-ring)]'
                      : 'hover:scale-105',
                  )}
                  style={
                    selected
                      ? ({
                          ['--swatch-ring' as string]: option.swatch,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <span
                    className={clsx(
                      'block rounded-full transition',
                      selected ? 'h-[1.125rem] w-[1.125rem] border' : 'h-[1.125rem] w-[1.125rem]',
                    )}
                    style={{
                      backgroundColor: option.swatch,
                      borderColor: selected ? option.swatch : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className={clsx(
          'rounded-3xl border p-5 transition-colors',
          darkMode ? 'border-white/10 bg-white/5' : 'border-slate-300/70 bg-white/75',
        )}
      >
        <h3 className={clsx('font-display text-xl font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>
          Dock
        </h3>
        <div className="mt-4 space-y-3">
          <ToggleRow
            title="Auto-hide the Dock"
            description="A dock se esconde automaticamente quando nao esta em uso."
            checked={settings.autoHide}
            onChange={(checked) => void updateSettings({ autoHide: checked })}
            darkMode={darkMode}
          />

          <ToggleRow
            title="Panel mode"
            description="A dock fica com visual mais encostado na borda da tela."
            checked={settings.panelMode}
            onChange={(checked) => void updateSettings({ panelMode: checked })}
            darkMode={darkMode}
          />

          <div className={clsx('rounded-2xl border px-4 py-3', darkMode ? 'border-white/10 bg-slate-950/35' : 'border-slate-300/70 bg-white/70')}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>Icon size</p>
                <p className={clsx('mt-1 text-xs', darkMode ? 'text-slate-400' : 'text-slate-600')}>
                  Ajuste o tamanho dos icones da dock.
                </p>
              </div>
              <span className={clsx('w-10 text-right text-sm font-semibold', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                {settings.iconSize}
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="56"
              step="2"
              value={settings.iconSize}
              onChange={(event) => void updateSettings({ iconSize: Number(event.target.value) })}
              className="mt-4 w-full"
              style={{ accentColor: 'rgb(var(--color-primary))' }}
            />
          </div>

          <div className={clsx('rounded-2xl border px-4 py-3', darkMode ? 'border-white/10 bg-slate-950/35' : 'border-slate-300/70 bg-white/70')}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>Dock corner radius</p>
                <p className={clsx('mt-1 text-xs', darkMode ? 'text-slate-400' : 'text-slate-600')}>
                  Controle o quanto a dock fica arredondada.
                </p>
              </div>
              <span className={clsx('w-10 text-right text-sm font-semibold', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                {settings.dockRadius}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              step="2"
              value={settings.dockRadius}
              onChange={(event) => void updateSettings({ dockRadius: Number(event.target.value) })}
              className="mt-4 w-full"
              style={{ accentColor: 'rgb(var(--color-primary))' }}
            />
          </div>

          <div className={clsx('rounded-2xl border px-4 py-3', darkMode ? 'border-white/10 bg-slate-950/35' : 'border-slate-300/70 bg-white/70')}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>Dock transparency</p>
                <p className={clsx('mt-1 text-xs', darkMode ? 'text-slate-400' : 'text-slate-600')}>
                  Ajuste a transparencia do fundo da dock.
                </p>
              </div>
              <span className={clsx('w-10 text-right text-sm font-semibold', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                {settings.dockTransparency}
              </span>
            </div>
            <input
              type="range"
              min="35"
              max="100"
              step="5"
              value={settings.dockTransparency}
              onChange={(event) =>
                void updateSettings({ dockTransparency: Number(event.target.value) })
              }
              className="mt-4 w-full"
              style={{ accentColor: 'rgb(var(--color-primary))' }}
            />
          </div>

          <div className={clsx('rounded-2xl border px-4 py-3', darkMode ? 'border-white/10 bg-slate-950/35' : 'border-slate-300/70 bg-white/70')}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={clsx('text-sm font-semibold', darkMode ? 'text-white' : 'text-slate-900')}>Position on screen</p>
                <p className={clsx('mt-1 text-xs', darkMode ? 'text-slate-400' : 'text-slate-600')}>
                  Escolha em qual borda a dock fica visivel.
                </p>
              </div>
              <select
                value={settings.dockPosition}
                onChange={(event) =>
                  void updateSettings({ dockPosition: event.target.value as DockPosition })
                }
                className={clsx(
                  'rounded-xl border px-3 py-2 text-sm outline-none transition',
                  darkMode
                    ? 'border-white/10 bg-white/5 text-white'
                    : 'border-slate-300 bg-white text-slate-900',
                )}
                style={{ borderColor: darkMode ? undefined : undefined }}
              >
                {dockOptions.map((dockPosition) => (
                  <option key={dockPosition} value={dockPosition} className="bg-slate-900">
                    {dockPosition}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
