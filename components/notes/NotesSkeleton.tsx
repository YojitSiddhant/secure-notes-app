export function NotesSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="h-7 w-40 animate-pulse rounded-full bg-slate-200/80" />
            <div className="h-4 w-64 animate-pulse rounded-full bg-slate-200/80" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-2xl bg-slate-200/80" />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
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
            className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200/80" />
              <div className="flex gap-2">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200/80" />
              <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-10/12 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="mt-6 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
