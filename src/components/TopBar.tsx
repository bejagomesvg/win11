import { LogOut } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { useDesktopStore } from '@/store/desktopStore';

export function TopBar() {
  const time = useClock();
  const user = useDesktopStore((state) => state.user);
  const logout = useDesktopStore((state) => state.logout);
  const theme = useDesktopStore((state) => state.settings.theme);
  const darkMode = theme === 'dark';

  return (
    <header
      className={`absolute inset-x-0 top-0 z-[1360] flex h-14 items-center justify-between border-b px-4 text-sm backdrop-blur-xl ${
        darkMode
          ? 'border-black/10 bg-black/25 text-white'
          : 'border-slate-300/70 bg-white/55 text-slate-900'
      }`}
    >
      <div className="font-medium tracking-wide">{time}</div>
      <div className="flex items-center gap-4">
        <span
          className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] ${
            darkMode ? 'bg-white/10 text-slate-100' : 'bg-slate-900/10 text-slate-700'
          }`}
        >
          {user?.username}
        </span>
        <button
          type="button"
          onClick={() => void logout()}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${
            darkMode
              ? 'border-white/10 bg-white/10 hover:bg-white/20'
              : 'border-slate-300/70 bg-white/70 hover:bg-white'
          }`}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
