import {
  AlertCircle,
  ChartColumn,
  CircleDot,
  NotebookPen,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { DashboardStats } from "@/services/notes.service";

type DashboardStatCardsProps = {
  stats: DashboardStats;
};

const statCards = [
  {
    key: "totalNotes",
    label: "Total notes",
    icon: NotebookPen,
    accent: "bg-[color:var(--primary-soft)] text-[color:var(--primary)]",
  },
  {
    key: "highPriority",
    label: "High priority",
    icon: AlertCircle,
    accent: "bg-[color:var(--danger-soft)] text-[color:var(--danger)]",
  },
  {
    key: "mediumPriority",
    label: "Medium priority",
    icon: ChartColumn,
    accent: "bg-[color:var(--warning-soft)] text-[color:var(--warning)]",
  },
  {
    key: "lowPriority",
    label: "Low priority",
    icon: CircleDot,
    accent: "bg-[color:var(--success-soft)] text-[color:var(--success)]",
  },
] as const;

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div
      className="grid gap-4 sm:gap-5"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
      }}
    >
      {statCards.map(({ key, label, icon: Icon, accent }) => (
        <article
          key={label}
          className="group overflow-hidden rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,255,0.9))] p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.24)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[color:var(--primary-border)] hover:shadow-[0_30px_90px_-52px_rgba(56,86,240,0.22)] sm:p-5"
        >
          <div className={cn("h-1.5 rounded-full", accent)} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                {label}
              </p>
              <p className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)] tabular-nums sm:text-[2.85rem]">
                {stats[key].toLocaleString()}
              </p>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Notes currently visible in the workspace.
              </p>
            </div>

            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14", accent)}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
