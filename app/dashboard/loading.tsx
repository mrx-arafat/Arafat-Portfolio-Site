export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#121212] relative grid-dots">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#2ed573]/30 border-t-[#2ed573] rounded-full animate-spin" />
        <p className="text-[#2ed573]/60 font-mono text-sm tracking-wider">
          INITIALIZING DASHBOARD...
        </p>
      </div>
    </main>
  );
}
