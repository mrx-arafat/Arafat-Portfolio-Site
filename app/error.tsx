"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Auto-reload on chunk load errors (stale deployment)
    if (
      error.name === "ChunkLoadError" ||
      error.message?.includes("ChunkLoadError") ||
      error.message?.includes("Failed to load chunk") ||
      error.message?.includes("Loading chunk")
    ) {
      window.location.reload();
      return;
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#1a1b26] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-[#1e272e] rounded-lg p-6 font-mono border border-[#2ed573]/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <p className="text-[#2ed573]/50 text-sm mb-2">$ error --diagnose</p>
        <p className="text-[#2ed573] text-lg mb-4">Something went wrong</p>
        <p className="text-[#8b949e] text-sm mb-6">
          An unexpected error occurred. Try again or refresh the page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#2ed573] text-[#0f0f0f] font-bold rounded-md hover:bg-[#2ed573]/80 transition-colors text-sm"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30 rounded-md hover:border-[#2ed573] transition-colors text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    </main>
  );
}
