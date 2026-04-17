import { LogOut } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { useDesktopStore } from '@/store/desktopStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const time = useClock();
  const user = useDesktopStore((state) => state.user);
  const logout = useDesktopStore((state) => state.logout);
  return (
    <header className="absolute inset-x-0 top-0 z-[1360] flex h-14 items-center justify-between border-b border-border/70 bg-card/75 px-4 text-sm text-foreground backdrop-blur-xl">
      <div className="font-medium tracking-wide">{time}</div>
      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className="rounded-full border border-border/70 bg-secondary px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-secondary-foreground"
        >
          {user?.username}
        </Badge>
        <Button
          type="button"
          variant="outline"
          onClick={() => void logout()}
          className="rounded-full border-border/70 bg-background/70 px-3 py-1.5 hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
