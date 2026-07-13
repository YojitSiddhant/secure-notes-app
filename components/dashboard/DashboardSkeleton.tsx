export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
        <div className="h-4 w-80 max-w-[90%] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
      </div>
      <div
        className="grid gap-4 sm:gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-3 w-28 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                <div className="h-10 w-20 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              </div>
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
