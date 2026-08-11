"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#fafafa",
          color: "#111",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>This page didn&apos;t load</h2>
          <p style={{ color: "#4b5563", margin: "0 0 1.5rem" }}>
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid transparent",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
