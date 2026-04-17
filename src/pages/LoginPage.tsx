import { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Power,
  User2,
  UserCircle2,
  Wifi,
} from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const lockscreenActions = [
  { title: 'Internet', icon: Wifi },
  { title: 'Acessibilidade', icon: Accessibility },
  { title: 'Energia', icon: Power },
];

const footerMessage =
  "Cloud PC data is stored in the cloud. It won't be stored on this physical device.";

function AuthModeToggle({
  customUser,
  onChange,
}: {
  customUser: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[12px] text-white/78">Sign-in options</span>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'flex h-9 w-10 items-center justify-center border transition-colors',
            'radius-micro',
            !customUser ? 'border-white/45 bg-white/18' : 'border-white/10 bg-white/5 hover:bg-white/12',
          )}
        >
          <div className="h-4 w-5 border border-white/80" style={{ borderRadius: '2px' }} />
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'flex h-9 w-10 items-center justify-center border transition-colors',
            'radius-micro',
            customUser ? 'border-white/45 bg-white/18' : 'border-white/10 bg-white/5 hover:bg-white/12',
          )}
        >
          <User2 size={18} className="text-white/80" />
        </button>
      </div>
    </div>
  );
}

export function LoginPage() {
  const login = useDesktopStore((state) => state.login);
  const [email, setEmail] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customUser, setCustomUser] = useState(false);
  const [isMounting, setIsMounting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    setIsMounting(true);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setIsShaking(false);

    try {
      await login(customUser ? email : 'demo', password);
    } catch {
      setError('Nao foi possivel entrar. Verifique as credenciais.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyInteraction(event: KeyboardEvent) {
    setIsCapsLockOn(event.getModifierState('CapsLock'));
  }

  return (
    <main className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden bg-[#071c45] text-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-8px); }
              80% { transform: translateX(8px); }
            }
            .animate-shake {
              animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
            }
          `,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(85,146,234,0.32),transparent_24%),radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.2),transparent_20%),linear-gradient(180deg,#0b3277_0%,#0b2e6c_34%,#08275f_60%,#05183c_100%)]" />
      <div
        className="absolute inset-0 transition-transform ease-out"
        style={{
          transform: isMounting ? 'scale(1)' : 'scale(1.06)',
          filter: 'blur(0px)',
          transitionDuration: '1800ms',
        }}
      >
        <div className="absolute left-[-5%] top-[54%] h-64 w-64 rounded-full bg-white/12 blur-[90px]" />
        <div className="absolute left-[18%] top-[16%] h-72 w-72 rounded-full bg-[#6aa4ff]/18 blur-[120px]" />
        <div className="absolute right-[16%] top-[12%] h-72 w-72 rounded-full bg-white/18 blur-[110px]" />
        <div className="absolute bottom-[-4%] right-[22%] h-80 w-80 rounded-full bg-[#0f4ea8]/22 blur-[130px]" />
      </div>

      <section
        className={cn(
          'relative z-10 flex w-full max-w-md flex-col items-center px-6 transition-all duration-1000 ease-out',
          isMounting ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        )}
      >
        {!customUser ? (
          <Avatar className="mb-5 h-28 w-28 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <AvatarFallback className="bg-white/8 text-white">
              <UserCircle2 className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
        ) : null}

        <h1 className="mb-7 text-center text-[28px] font-semibold tracking-tight text-white">
          {customUser ? 'Other user' : 'Demo User'}
        </h1>

        <form
          className={cn('w-full max-w-[300px] space-y-3 transition-transform', isShaking && 'animate-shake')}
          onSubmit={handleSubmit}
        >
          {customUser ? (
            <Input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={handleKeyInteraction}
              onKeyUp={handleKeyInteraction}
              className="h-[36px] rounded-[3px] border-white/20 bg-black/28 text-white shadow-none placeholder:text-white/60 focus-visible:border-white/25 focus-visible:ring-0"
              style={{ boxShadow: 'inset 0 -2px 0 rgba(96, 165, 250, 0)' }}
              onFocus={(event) => {
                event.currentTarget.style.boxShadow = 'inset 0 -2px 0 rgba(96, 165, 250, 0.95)';
              }}
              onBlur={(event) => {
                event.currentTarget.style.boxShadow = 'inset 0 -2px 0 rgba(96, 165, 250, 0)';
              }}
              placeholder="Email address"
              autoFocus
            />
          ) : null}

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleKeyInteraction}
              onKeyUp={handleKeyInteraction}
              className="h-[36px] rounded-[3px] border-white/20 bg-black/28 pr-24 text-white shadow-none placeholder:text-white/60 focus-visible:border-white/25 focus-visible:ring-0"
              style={{ boxShadow: 'inset 0 -2px 0 rgba(96, 165, 250, 0)' }}
              onFocus={(event) => {
                event.currentTarget.style.boxShadow = 'inset 0 -2px 0 rgba(96, 165, 250, 0.95)';
              }}
              onBlur={(event) => {
                event.currentTarget.style.boxShadow = 'inset 0 -2px 0 rgba(96, 165, 250, 0)';
              }}
              placeholder="Password"
              autoFocus={!customUser}
            />

            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="h-7 w-7 rounded-[3px] text-white/70 hover:bg-white/10 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className={cn(
                  'h-7 w-7 rounded-[3px] text-white transition-all hover:bg-white/10',
                  password ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-2 opacity-0',
                )}
                disabled={loading || !password.trim()}
              >
                <ArrowRight size={17} strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          {isCapsLockOn ? (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/72">
              <Info size={12} />
              <span>Caps Lock esta ativado</span>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[3px] border border-rose-300/35 bg-rose-400/10 px-3 py-2 text-center text-xs text-rose-100">
              {error}
            </div>
          ) : null}

          <p className="pt-2 text-center text-[13px] text-white/80">Sign in to connect to your Cloud PC.</p>

          <Button
            type="button"
            variant="ghost"
            className="mx-auto block h-auto px-0 py-1 text-[13px] font-normal text-white/90 hover:bg-transparent hover:text-white hover:underline"
          >
            {customUser ? 'Forgot your password?' : 'Forgot your PIN?'}
          </Button>

          <div className="pt-1">
            <AuthModeToggle customUser={customUser} onChange={setCustomUser} />
          </div>
        </form>
      </section>

      <div className="absolute bottom-8 left-0 right-0 z-10 px-4 text-center text-[13px] text-white/85">
        {footerMessage}
      </div>

      <div className="absolute bottom-8 right-10 z-10 flex items-center gap-5 text-white/85">
        {lockscreenActions.map(({ title, icon: Icon }) => (
          <button key={title} title={title} className="rounded-full p-1 transition hover:scale-110 hover:text-white">
            <Icon size={22} strokeWidth={1.4} />
          </button>
        ))}
      </div>
    </main>
  );
}
