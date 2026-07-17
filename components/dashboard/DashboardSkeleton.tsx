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

      <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-40 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
            <div className="h-4 w-[min(36rem,90%)] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
          </div>
          <div className="h-9 w-32 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.18)] sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-center">
              <div className="mx-auto flex h-52 w-52 animate-pulse items-center justify-center rounded-full bg-[color:var(--surface-muted)]" />
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
                  <div className="h-3 w-32 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  <div className="mt-3 space-y-3">
                    <div className="h-3 w-full animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                    <div className="h-3 w-11/12 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                    <div className="h-3 w-[82%] animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  </div>
                </div>
                <div className="h-28 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)]" />
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.18)] sm:p-6">
              <div className="h-3 w-40 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                        <div className="h-3 w-44 max-w-full animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-6 w-10 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                        <div className="h-3 w-14 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.18)] sm:p-6">
              <div className="h-3 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
                  >
                    <div className="h-4 w-4/5 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
