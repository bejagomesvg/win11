import { Folder, MonitorCog, Pin, PinOff, TerminalSquare } from 'lucide-react';
import { Dock } from '@/components/Dock';
import { DesktopWindow } from '@/components/DesktopWindow';
import { TopBar } from '@/components/TopBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesktopStore } from '@/store/desktopStore';
import { cn } from '@/lib/utils';
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
  const isDark = settings.theme === 'dark';

  return (
    <main
      className={cn('relative min-h-screen overflow-hidden transition-colors duration-300', isDark ? 'text-white' : 'text-slate-900')}
      style={{
        background: isDark
          ? 'radial-gradient(circle at 18% 0%, rgb(var(--color-primary) / 0.08), transparent 22%), linear-gradient(180deg, #09090b 0%, #111827 100%)'
          : 'radial-gradient(circle at 18% 0%, rgb(var(--color-primary) / 0.06), transparent 22%), linear-gradient(180deg, #fafafa 0%, #f4f4f5 52%, #e4e4e7 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            settings.theme === 'dark'
              ? "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Cg fill=%22none%22 fill-opacity=%220.12%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%221%22 fill=%22%23fff%22/%3E%3C/g%3E%3C/svg%3E')"
              : "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Cg fill=%22none%22 fill-opacity=%220.16%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%221%22 fill=%22%230f172a%22/%3E%3C/g%3E%3C/svg%3E')",
        }}
      />
      <TopBar />
      <Dock />

      {launcherOpen ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[1340] backdrop-blur-md transition"
            style={{
              background: isDark ? 'rgba(2, 6, 23, 0.42)' : 'rgba(15, 23, 42, 0.18)',
            }}
          />
          <button
            type="button"
            aria-label="Fechar painel de aplicativos"
            onMouseDown={() => closeLauncher()}
            className="absolute inset-0 z-[1390] cursor-default bg-transparent"
          />
          <section className="relative z-[1400] flex min-h-screen items-center justify-center px-4 pt-20 pointer-events-none">
            <Card
              data-launcher-panel="true"
              className={cn(
                'radius-panel pointer-events-auto w-full max-w-2xl border p-2 shadow-panel backdrop-blur-2xl',
                'border-border/70 bg-card/80 text-card-foreground shadow-black/10',
              )}
            >
              <CardContent className="p-6">
                <Badge
                  className={cn(
                    'border-0 bg-transparent px-0 py-0 text-xs uppercase tracking-[0.34em]',
                    'text-muted-foreground',
                  )}
                >
                  Desktop Ready
                </Badge>
                <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Bem-vindo, {user?.username ?? 'guest'}</h1>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  Seu desktop web ja esta carregado. Abra um app pela dock ou use os atalhos abaixo para iniciar a experiencia.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {launcherApps.map(({ id, title, description, icon: Icon }) => {
                    const pinned = pinnedApps.includes(id);

                    return (
                      <Card
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
                        className={cn(
                          'radius-card relative border p-0 text-left transition hover:-translate-y-1',
                          'border-border/70 bg-background/60 hover:bg-accent/70',
                        )}
                      >
                        <CardContent className="p-5">
                          <Button
                            type="button"
                            aria-label={pinned ? 'Desafixar da dock' : 'Fixar na dock'}
                            onClick={(event) => {
                              event.stopPropagation();
                              togglePinnedApp(id);
                            }}
                            variant="ghost"
                            size="icon"
                            className={cn(
                              'absolute right-4 top-4 h-8 w-8 rounded-full border',
                              pinned ? 'border-primary/35 bg-primary/10 text-primary hover:bg-primary/15' : 'border-border/70 bg-background/60 text-muted-foreground hover:bg-accent/70',
                            )}
                          >
                            {pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
                          </Button>

                          <Icon className="h-8 w-8" style={{ color: 'rgb(var(--color-glow))' }} />
                          <p className="mt-4 font-display text-xl font-semibold">{title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      ) : null}

      {windows.map((window) => (
        <DesktopWindow key={window.id} window={window} active={activeWindowId === window.id} dimmed={false} />
      ))}
    </main>
  );
}
