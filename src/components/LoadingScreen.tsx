export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="radius-panel animate-pulse border border-border/70 bg-card/70 px-8 py-5 backdrop-blur-xl">
        Carregando desktop...
      </div>
    </div>
  );
}
