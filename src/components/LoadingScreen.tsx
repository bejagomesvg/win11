export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-xl">
        Carregando desktop...
      </div>
    </div>
  );
}
