export function NotesSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-4 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-48 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="h-4 w-[min(42rem,92%)] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
          <div className="h-12 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
          <div className="h-12 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="h-4 w-64 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
          <div className="inline-flex gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1">
            <div className="h-10 w-20 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="h-10 w-20 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
          </div>
        </div>
      </div>

      <div
        className="grid gap-4 sm:gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.2)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="h-7 w-20 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="flex gap-2">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-[color:var(--surface-muted)]" />
                <div className="h-10 w-10 animate-pulse rounded-xl bg-[color:var(--surface-muted)]" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-4 w-full animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-4 w-10/12 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            </div>
            <div className="mt-6 grid gap-3 border-t border-[color:var(--border)] pt-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                <div className="h-4 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                <div className="h-4 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
