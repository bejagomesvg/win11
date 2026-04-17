import clsx from 'clsx';
import { Folder, MonitorCog, Pin, PinOff, TerminalSquare } from 'lucide-react';
import { Dock } from '@/components/Dock';
import { DesktopWindow } from '@/components/DesktopWindow';
import { TopBar } from '@/components/TopBar';
import { useDesktopStore } from '@/store/desktopStore';
import type { AppId } from '@/types';

const launcherApps: Array<{
  id: AppId;
  title: string;
  description: string;
  icon: typeof Folder;
}> = [
  {
    id: 'files',
    title: 'Arquivos',
    description: 'Navegue pelos atalhos do sistema.',
    icon: Folder,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'Abra um terminal fake no estilo Ubuntu.',
    icon: TerminalSquare,
  },
  {
    id: 'settings',
    title: 'Configuracoes',
    description: 'Ajuste tema, dock e auto-hide.',
    icon: MonitorCog,
  },
];

export function DesktopPage() {
  const settings = useDesktopStore((state) => state.settings);
  const windows = useDesktopStore((state) => state.windows);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const launcherOpen = useDesktopStore((state) => state.launcherOpen);
  const pinnedApps = useDesktopStore((state) => state.pinnedApps);
  const openWindow = useDesktopStore((state) => state.openWindow);
  const closeLauncher = useDesktopStore((state) => state.closeLauncher);
  const togglePinnedApp = useDesktopStore((state) => state.togglePinnedApp);
  const user = useDesktopStore((state) => state.user);
  const hasFocusedSurface = launcherOpen;

  return (
    <main
      className={clsx(
        'relative min-h-screen overflow-hidden transition-colors duration-300',
        settings.theme === 'dark'
          ? 'text-white'
          : 'text-slate-900',
      )}
      style={{
        background:
          settings.theme === 'dark'
            ? 'radial-gradient(circle at top, rgba(var(--color-primary), 0.18), transparent 24%), linear-gradient(180deg, #111827 0%, #0f172a 65%, #020617 100%)'
            : 'radial-gradient(circle at top, rgba(var(--color-primary), 0.16), transparent 26%), linear-gradient(180deg, #dbeafe 0%, #eff6ff 50%, #e2e8f0 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Cg fill=%22none%22 fill-opacity=%220.12%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%221%22 fill=%22%23fff%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      <TopBar />
      <Dock />

      {hasFocusedSurface ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[1340] backdrop-blur-md transition"
            style={{
              background:
                settings.theme === 'dark'
                  ? 'rgba(2, 6, 23, 0.42)'
                  : 'rgba(15, 23, 42, 0.18)',
            }}
          />
          {launcherOpen ? (
            <button
              type="button"
              aria-label="Fechar painel de aplicativos"
              onMouseDown={() => {
                closeLauncher();
              }}
              className="absolute inset-0 z-[1390] cursor-default bg-transparent"
            />
          ) : null}
        </>
      ) : null}

      {launcherOpen ? (
        <section className="relative z-[1400] flex min-h-screen items-center justify-center px-4 pt-20 pointer-events-none">
          <div
            data-launcher-panel="true"
            className={clsx(
              "pointer-events-auto w-full max-w-2xl rounded-[32px] border p-8 shadow-panel backdrop-blur-2xl transition-all duration-300",
              settings.theme === 'dark' 
                ? "border-white/15 bg-black/25 text-white shadow-black/40" 
                : "border-slate-200/60 bg-white/70 text-slate-900 shadow-slate-200/50"
            )}
          >
            <p
              className="text-xs uppercase tracking-[0.34em]"
              style={{ color: settings.theme === 'dark' ? 'rgba(var(--color-glow), 0.9)' : 'rgb(var(--color-primary))' }}
            >
              Desktop Ready
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
              Bem-vindo, {user?.username ?? 'guest'}
            </h1>
            <p className={clsx("mt-3 max-w-xl text-sm", settings.theme === 'dark' ? "text-slate-200/85" : "text-slate-600")}>
              Seu desktop web ja esta carregado. Abra um app pela dock ou use os atalhos abaixo
              para iniciar a experiencia.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {launcherApps.map(({ id, title, description, icon: Icon }) => {
                const pinned = pinnedApps.includes(id);

                return (
                  <div
                    key={id}
                    onClick={() => openWindow(id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openWindow(id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={clsx(
                      "relative rounded-3xl border p-5 text-left transition hover:-translate-y-1",
                      settings.theme === 'dark'
                        ? "border-white/10 bg-white/10 hover:bg-white/15"
                        : "border-slate-200 bg-white/50 hover:bg-white/80 hover:shadow-lg"
                    )}
                  >
                    <button
                      type="button"
                      aria-label={pinned ? 'Desafixar da dock' : 'Fixar na dock'}
                      onClick={(event) => {
                        event.stopPropagation();
                        togglePinnedApp(id);
                      }}
                      className={clsx(
                        'group absolute right-4 top-4 rounded-full border p-1.5 transition',
                        pinned
                          ? 'text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                      )}
                      style={
                        pinned
                          ? {
                              borderColor: 'rgba(var(--color-primary), 0.35)',
                              backgroundColor: 'rgba(var(--color-primary), 0.12)',
                              color: 'rgb(var(--color-glow))',
                            }
                          : undefined
                      }
                    >
                      {pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
                      <span className="pointer-events-none absolute -top-9 right-0 rounded-lg border border-white/10 bg-slate-950/95 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                        {pinned ? 'Desafixar' : 'Fixar'}
                      </span>
                    </button>

                    <Icon className="h-8 w-8" style={{ color: 'rgb(var(--color-glow))' }} />
                    <p className="mt-4 font-display text-xl font-semibold">{title}</p>
                    <p className={clsx("mt-2 text-sm", settings.theme === 'dark' ? "text-slate-300" : "text-slate-500")}>{description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {windows.map((window) => (
        <DesktopWindow
          key={window.id}
          window={window}
          active={activeWindowId === window.id}
          dimmed={false}
        />
      ))}
    </main>
  );
}
