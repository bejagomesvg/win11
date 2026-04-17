import type { AppId } from '@/types';
import { SettingsPanel } from '@/components/SettingsPanel';

export function renderWindowContent(appId: AppId) {
  if (appId === 'files') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-300">Atalhos rapidos para o seu ambiente.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {['Documentos', 'Downloads', 'Projetos', 'Imagens', 'Vídeos', 'Músicas', 'Desktop', 'Drives'].map((folder) => (
            <div
              key={folder}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100"
            >
              {folder}
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-xs uppercase tracking-wider text-slate-500">Sistema</p>
          {['Cache', 'Temp', 'Logs'].map((item) => (
            <div key={item} className="rounded-lg border border-white/5 bg-white/3 p-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === 'terminal') {
    return (
      <div className="rounded-2xl bg-slate-950 p-4 font-mono text-sm text-emerald-300 space-y-2">
        <p>guest@web-desktop:~$ ls</p>
        <p>Documentos Downloads Projetos Imagens Vídeos</p>
        <p className="mt-3">guest@web-desktop:~$ echo "Ubuntu vibes inside React"</p>
        <p>Ubuntu vibes inside React</p>
        <p className="mt-3">guest@web-desktop:~$ pwd</p>
        <p>/home/guest</p>
        <p className="mt-3">guest@web-desktop:~$ whoami</p>
        <p>guest</p>
        <p className="mt-3">guest@web-desktop:~$ uname -a</p>
        <p>Linux web-desktop 5.15.0 #1 SMP x86_64 GNU/Linux</p>
        <p className="mt-3">guest@web-desktop:~$ date</p>
        <p>{new Date().toLocaleString()}</p>
        <p className="mt-3">guest@web-desktop:~$ _</p>
      </div>
    );
  }

  return <SettingsPanel />;
}
