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
    label: "Total Notes",
    icon: NotebookPen,
    labelClass: "text-[color:var(--foreground)]",
    valueClass: "text-[color:var(--foreground)]",
    iconClass: "text-[color:var(--primary)]",
  },
  {
    key: "highPriority",
    label: "High Priority",
    icon: AlertCircle,
    labelClass: "text-[color:var(--foreground)]",
    valueClass: "text-[color:var(--foreground)]",
    iconClass: "text-[color:var(--danger)]",
  },
  {
    key: "mediumPriority",
    label: "Medium Priority",
    icon: ChartColumn,
    labelClass: "text-[color:var(--foreground)]",
    valueClass: "text-[color:var(--foreground)]",
    iconClass: "text-[color:var(--warning)]",
  },
  {
    key: "lowPriority",
    label: "Low Priority",
    icon: CircleDot,
    labelClass: "text-[color:var(--foreground)]",
    valueClass: "text-[color:var(--foreground)]",
    iconClass: "text-[color:var(--success)]",
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
      {statCards.map(({ key, label, icon: Icon, labelClass, valueClass, iconClass }) => (
        <article
          key={label}
          className={cn(
            "group flex h-full min-h-[8.5rem] items-center rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--primary-border)] hover:shadow-[0_22px_60px_-42px_rgba(79,70,229,0.18)] sm:min-h-[9rem] sm:p-5"
          )}
        >
          <div className="flex w-full items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p
                className={cn(
                  "whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)] sm:text-xs",
                  labelClass
                )}
              >
                {label}
              </p>
              <p
                className={cn(
                  "text-[2.35rem] font-semibold leading-none tracking-tight tabular-nums text-[color:var(--foreground)] sm:text-[2.75rem]",
                  valueClass
                )}
              >
                {stats[key].toLocaleString()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-muted)] ring-1 ring-inset ring-[color:var(--border)] transition-transform duration-200 group-hover:scale-[1.02] sm:h-14 sm:w-14">
              <Icon className={cn("h-5.5 w-5.5 sm:h-6 sm:w-6", iconClass)} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
