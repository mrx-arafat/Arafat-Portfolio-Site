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
    <main className="min-h-screen bg-surface-night text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-surface-panel rounded-lg p-6 font-mono border border-terminal-green/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <p className="text-terminal-green/50 text-sm mb-2">$ error --diagnose</p>
        <p className="text-terminal-green text-lg mb-4">Something went wrong</p>
        <p className="text-[#8b949e] text-sm mb-6">
          An unexpected error occurred. Try again or refresh the page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-terminal-green text-surface-raised font-bold rounded-md hover:bg-terminal-green/80 transition-colors text-sm"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-surface-raised text-terminal-green border border-terminal-green/30 rounded-md hover:border-terminal-green transition-colors text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    </main>
  );
}
