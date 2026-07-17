export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-48 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="h-4 w-[min(42rem,92%)] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="h-4 w-[min(36rem,80%)] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-36 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
            <div className="h-11 w-36 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
          </div>
        </div>
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
            className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.2)] backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-3 w-28 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                <div className="h-10 w-20 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                <div className="h-4 w-40 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              </div>
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-[color:var(--surface-muted)]" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:p-6">
          <div className="space-y-3">
            <div className="h-8 w-44 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="h-4 w-[min(34rem,90%)] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
          </div>
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                    <div className="h-3 w-48 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-10 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                    <div className="h-3 w-14 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  </div>
                </div>
                <div className="h-3 rounded-full bg-[color:var(--surface-muted)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:p-6">
            <div className="h-3 w-40 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="mt-4 space-y-3">
              <div className="h-6 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-4 w-56 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.94))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:p-6">
            <div className="h-3 w-32 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="mt-4 space-y-3">
              <div className="h-5 w-48 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="h-4 w-60 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
