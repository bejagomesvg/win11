import type { AppId } from '@/types';
import { SettingsPanel } from '@/components/SettingsPanel';

export function renderWindowContent(appId: AppId) {
  if (appId === 'files') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-300">Atalhos rapidos para o seu ambiente.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {['Documentos', 'Downloads', 'Projetos', 'Imagens'].map((folder) => (
            <div
              key={folder}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100"
            >
              {folder}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === 'terminal') {
    return (
      <div className="rounded-2xl bg-slate-950 p-4 font-mono text-sm text-emerald-300">
        <p>guest@web-desktop:~$ ls</p>
        <p>Documentos Downloads Projetos Imagens</p>
        <p className="mt-3">guest@web-desktop:~$ echo "Ubuntu vibes inside React"</p>
        <p>Ubuntu vibes inside React</p>
      </div>
    );
  }

  return <SettingsPanel />;
}
