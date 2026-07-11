export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded-full bg-slate-200/80" />
        <div className="h-4 w-80 max-w-[90%] animate-pulse rounded-full bg-slate-200/80" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-3 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="h-10 w-20 animate-pulse rounded-full bg-slate-200/80" />
              </div>
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-200/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
