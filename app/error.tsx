"use client";

import Link from "next/link";
import { useEffect } from "react";

import { reportLovableError } from "@/lib/lovable-error-reporting";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "next_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went off-route</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We hit a bump. Try again, or head back to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            className="press rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="press rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
