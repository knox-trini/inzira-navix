import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Off the route map</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That stop doesn&apos;t exist on our network. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="press mt-6 inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
