"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Auto-reload on chunk load errors
  if (
    typeof window !== "undefined" &&
    (error.name === "ChunkLoadError" ||
      error.message?.includes("ChunkLoadError") ||
      error.message?.includes("Failed to load chunk"))
  ) {
    window.location.reload();
    return null;
  }

  return (
    <html lang="en">
      <body style={{ backgroundColor: "#1a1b26", margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "monospace",
            color: "white",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              backgroundColor: "#1e272e",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              border: "1px solid rgba(46, 213, 115, 0.2)",
            }}
          >
            <p style={{ color: "rgba(46, 213, 115, 0.5)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              $ fatal-error --diagnose
            </p>
            <p style={{ color: "#2ed573", fontSize: "1.25rem", marginBottom: "1rem" }}>
              Something went wrong
            </p>
            <p style={{ color: "#8b949e", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              A critical error occurred. Please reload the page.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2ed573",
                  color: "#0f0f0f",
                  fontWeight: "bold",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#0f0f0f",
                  color: "#2ed573",
                  border: "1px solid rgba(46, 213, 115, 0.3)",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
