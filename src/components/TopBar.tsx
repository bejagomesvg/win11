import { LogOut } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { useDesktopStore } from '@/store/desktopStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const time = useClock();
  const user = useDesktopStore((state) => state.user);
  const logout = useDesktopStore((state) => state.logout);
  const darkMode = useDesktopStore((state) => state.settings.theme === 'dark');

  return (
    <header
      className={cn(
        'absolute inset-x-0 top-0 z-[1360] flex h-14 items-center justify-between border-b px-4 text-sm backdrop-blur-xl',
        darkMode ? 'border-black/10 bg-black/25 text-white' : 'border-slate-300/70 bg-white/55 text-slate-900',
      )}
    >
      <div className="font-medium tracking-wide">{time}</div>
      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className={cn(
            'rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]',
            darkMode ? 'border-white/10 bg-white/10 text-slate-100' : 'bg-slate-900/10 text-slate-700',
          )}
        >
          {user?.username}
        </Badge>
        <Button
          type="button"
          variant="outline"
          onClick={() => void logout()}
          className={cn(
            'rounded-full px-3 py-1.5',
            darkMode ? 'border-white/10 bg-white/10 text-white hover:bg-white/20' : 'bg-white/70 hover:bg-white',
          )}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
