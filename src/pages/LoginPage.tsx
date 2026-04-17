import { FormEvent, useState, useEffect, KeyboardEvent } from 'react';
import { ArrowRight, UserCircle2, Eye, EyeOff, Wifi, Accessibility, Power, User2, Info } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';
import clsx from 'clsx';

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
      await login(email, password);
    } catch (submitError) {
      setError('Não foi possível entrar. Verifique as credenciais.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyInteraction(e: KeyboardEvent) {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black font-sans text-white select-none">
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
      {/* Wallpaper com desfoque profundo (Efeito Acrylic) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2064&auto=format&fit=crop")',
          filter: 'brightness(0.7) blur(60px)',
          transform: isMounting ? 'scale(1)' : 'scale(1.1)'
        }}
      />

      <div className={clsx(
        "relative z-10 flex flex-col items-center transition-all duration-1000 ease-out",
        isMounting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        {/* Avatar do Usuário */}
        <div className="mb-6 h-48 w-48 overflow-hidden rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
          <UserCircle2 className="h-full w-full p-8 text-white/90 bg-white/5" />
        </div>

        {/* Nome do Usuário */}
        <h1 className="mb-10 text-[32px] font-semibold tracking-tight text-white drop-shadow-md">
          {customUser ? 'Outro Usuário' : 'Demo User'}
        </h1>

        {/* Formulário de PIN/Senha */}
        <form 
          className={clsx("w-[300px] space-y-4 transition-transform", isShaking && "animate-shake")} 
          onSubmit={handleSubmit}
        >
          {customUser && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={handleKeyInteraction}
                onKeyUp={handleKeyInteraction}
                className={clsx(
                  "w-full rounded-[4px] border border-white/20 bg-black/20 py-[7px] px-3 text-sm outline-none transition-all",
                  "backdrop-blur-3xl focus:border-b-sky-500 focus:border-b-2 focus:bg-black/40 placeholder:text-white/60"
                )}
                placeholder="Nome de usuário"
                autoFocus
              />
            </div>
          )}

          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleKeyInteraction}
              onKeyUp={handleKeyInteraction}
              className={clsx(
                "w-full rounded-[4px] border border-white/20 bg-black/20 py-[7px] pl-3 pr-20 text-sm outline-none transition-all",
                "backdrop-blur-3xl focus:border-b-sky-500 focus:border-b-2 focus:bg-black/40 placeholder:text-white/60"
              )}
              placeholder={customUser ? "Senha" : "PIN"}
              autoFocus={!customUser}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                type="submit"
                className={clsx(
                  "ml-0.5 rounded-[4px] bg-white/10 p-1 transition-all hover:bg-white/20",
                  password ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-2"
                )}
                disabled={loading || !password.trim()}
              >
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {isCapsLockOn && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/70 animate-in fade-in slide-in-from-top-1 duration-200">
              <Info size={12} />
              <span>Caps Lock está ativado</span>
            </div>
          )}

          {error ? <p className="text-center text-xs text-rose-300 bg-black/40 py-1 rounded">{error}</p> : null}

          <div className="flex flex-col items-center gap-6">
            <button type="button" className="text-[14px] text-white/90 hover:underline">
              {customUser ? "Esqueci minha senha" : "Esqueci meu PIN"}
            </button>

            <div className="flex flex-col items-center gap-3">
              <span className="text-[12px] text-white/80">Opções de entrada</span>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setCustomUser(false)}
                  className={clsx(
                    "h-9 w-10 rounded-sm border flex items-center justify-center transition-colors",
                    !customUser ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10 hover:bg-white/15"
                  )}
                >
                  <div className="h-4 w-5 border border-white/80 rounded-[1px]" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setCustomUser(true)}
                  className={clsx(
                    "h-9 w-10 rounded-sm border flex items-center justify-center transition-colors",
                    customUser ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10 hover:bg-white/15"
                  )}
                >
                  <User2 size={18} className="text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Barra de Sistema Inferior */}
      <div className="absolute bottom-10 right-12 flex items-center gap-8 opacity-80 hover:opacity-100 transition-opacity">
        <button title="Internet" className="p-1 hover:scale-110 transition-transform">
          <Wifi size={24} strokeWidth={1.2} />
        </button>
        <button title="Acessibilidade" className="p-1 hover:scale-110 transition-transform">
          <Accessibility size={24} strokeWidth={1.2} />
        </button>
        <button title="Ligar/Desligar" className="p-1 hover:scale-110 transition-transform">
          <Power size={24} strokeWidth={1.2} />
        </button>
      </div>
    </main>
  );
}
