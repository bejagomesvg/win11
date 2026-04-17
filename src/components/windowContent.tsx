import { FolderOpen, HardDriveDownload, Image, Music4, Video } from 'lucide-react';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AppId } from '@/types';

const folders = [
  { name: 'Documentos', icon: FolderOpen },
  { name: 'Downloads', icon: HardDriveDownload },
  { name: 'Projetos', icon: FolderOpen },
  { name: 'Imagens', icon: Image },
  { name: 'Videos', icon: Video },
  { name: 'Musicas', icon: Music4 },
  { name: 'Desktop', icon: FolderOpen },
  { name: 'Drives', icon: HardDriveDownload },
];

export function renderWindowContent(appId: AppId) {
  if (appId === 'files') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Badge className="w-fit">Workspace</Badge>
          <p className="text-sm text-muted-foreground">Atalhos rapidos para o seu ambiente.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {folders.map(({ name, icon: Icon }) => (
            <Card key={name} className="border-border/60 bg-background/55">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{name}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sistema</p>
          {['Cache', 'Temp', 'Logs'].map((item) => (
            <Card key={item} className="border-border/60 bg-background/45">
              <CardContent className="p-3 text-sm text-foreground">{item}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (appId === 'terminal') {
    return (
      <Card className="rounded-2xl border-emerald-500/20 bg-slate-950 text-emerald-300">
        <CardContent className="space-y-2 p-4 font-mono text-sm">
          <p>guest@web-desktop:~$ ls</p>
          <p>Documentos Downloads Projetos Imagens Videos</p>
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
        </CardContent>
      </Card>
    );
  }

  return <SettingsPanel />;
}
