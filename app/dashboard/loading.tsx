export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-base relative grid-dots">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin" />
        <p className="text-terminal-green/60 font-mono text-sm tracking-wider">
          INITIALIZING DASHBOARD...
        </p>
      </div>
    </main>
  );
}
