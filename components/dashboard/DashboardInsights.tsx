import { cn } from "@/lib/cn";
import type { DashboardStats } from "@/services/notes.service";
import {
  helperTextClassName,
  sectionShellClassName,
  sectionTitleClassName,
} from "@/components/ui/styles";

type DashboardInsightsProps = {
  stats: DashboardStats;
};

const priorityRows = [
  {
    key: "highPriority",
    label: "High",
    description: "Urgent notes that need immediate attention.",
    accent: "text-[color:var(--danger)]",
    bar: "bg-[color:var(--danger)]",
  },
  {
    key: "mediumPriority",
    label: "Medium",
    description: "Important items with room to breathe.",
    accent: "text-[color:var(--warning)]",
    bar: "bg-[color:var(--warning)]",
  },
  {
    key: "lowPriority",
    label: "Low",
    description: "Calm ideas and follow-ups to revisit later.",
    accent: "text-[color:var(--success)]",
    bar: "bg-[color:var(--success)]",
  },
] as const;

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function DashboardInsights({ stats }: DashboardInsightsProps) {
  const totalNotes = stats.totalNotes;
  const activeNotes = stats.highPriority + stats.mediumPriority + stats.lowPriority;
  const rows = priorityRows.map((row) => ({
    ...row,
    value: stats[row.key],
    percent: formatPercent(stats[row.key], Math.max(totalNotes, 1)),
  }));

  return (
    <section className={cn(sectionShellClassName, "relative overflow-hidden p-5 sm:p-6")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-5rem] h-40 w-40 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
        <div className="absolute right-[-5rem] top-6 h-48 w-48 rounded-full bg-[color:var(--info-soft)] blur-3xl" />
      </div>

      <div className="relative space-y-4">
        <div className="space-y-2">
          <h2 className={sectionTitleClassName}>Priority balance</h2>
          <p className={helperTextClassName}>
            A fast read on which notes need attention first and how the workspace is currently
            distributed.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
          <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.94))] p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)] sm:p-5">
            <div className="flex flex-col gap-4">
              {rows.map((row) => (
                <div key={row.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className={cn("text-sm font-semibold tracking-tight", row.accent)}>
                        {row.label}
                      </p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {row.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold tabular-nums text-[color:var(--foreground)]">
                        {row.value}
                      </p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {row.percent}% of total
                      </p>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
                    <div
                      className={cn("h-full rounded-full transition-all duration-300 ease-out", row.bar)}
                      style={{
                        width: `${Math.max(row.value === 0 ? 0 : row.percent, row.value > 0 ? 12 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.94))] p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Workspace health
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {activeNotes === 0 ? "Quiet" : "Active"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {totalNotes === 0
                  ? "Create your first note to bring the workspace to life."
                  : "Your note inventory is active and ready for quick review."}
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.94))] p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Recommended focus
              </p>
              <p className="mt-3 text-base font-semibold tracking-tight text-[color:var(--foreground)]">
                {stats.highPriority > stats.mediumPriority
                  ? "Clear high-priority notes first."
                  : "Keep moving through the middle of your backlog."}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                The summary is intentionally minimal so the most important work stands out quickly.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
