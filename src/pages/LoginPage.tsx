import { FormEvent, useState } from 'react';
import { LockKeyhole, UserRound } from 'lucide-react';
import { useDesktopStore } from '@/store/desktopStore';

export function LoginPage() {
  const login = useDesktopStore((state) => state.login);
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
    } catch (submitError) {
      setError('Nao foi possivel entrar. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(var(--color-glow), 0.28), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.10), rgba(148,163,184,0.04))',
        }}
      />
      <div
        className="absolute left-10 top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(var(--color-primary), 0.20)' }}
      />
      <div
        className="absolute bottom-10 right-16 h-52 w-52 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(var(--color-soft), 0.28)' }}
      />

      <div className="relative w-full max-w-md animate-floatUp rounded-[32px] border border-white/20 bg-white/12 p-8 text-white shadow-panel backdrop-blur-2xl">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl font-bold tracking-tight">Welcome back</p>
          <p className="mt-2 text-sm text-slate-200/80">
            Experiencia Windows 11 no login, desktop GNOME depois do acesso.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-200">
              <UserRound className="h-4 w-4" />
              Usuario
            </span>
            <input
              className="w-full rounded-2xl border border-white/20 bg-slate-950/30 px-4 py-3 outline-none transition focus:bg-slate-950/50"
              style={{ ['--tw-ring-color' as string]: 'rgba(var(--color-primary), 0.45)' }}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="demo"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-200">
              <LockKeyhole className="h-4 w-4" />
              Senha
            </span>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/20 bg-slate-950/30 px-4 py-3 outline-none transition focus:bg-slate-950/50"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="demo123"
              style={{ borderColor: undefined }}
            />
          </label>

          {error ? <p className="text-sm text-rose-200">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              background: 'linear-gradient(90deg, rgba(var(--color-glow), 1), rgba(var(--color-primary), 1))',
            }}
          >
            {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-200/70">
          Use `demo` / `demo123` para testar.
        </p>
      </div>
    </main>
  );
}
