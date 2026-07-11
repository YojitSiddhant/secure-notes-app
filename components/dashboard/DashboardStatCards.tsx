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
    labelClass: "text-slate-900",
    valueClass: "text-slate-950",
    iconClass: "text-indigo-600",
  },
  {
    key: "highPriority",
    label: "High Priority",
    icon: AlertCircle,
    labelClass: "text-slate-900",
    valueClass: "text-slate-950",
    iconClass: "text-rose-600",
  },
  {
    key: "mediumPriority",
    label: "Medium Priority",
    icon: ChartColumn,
    labelClass: "text-slate-900",
    valueClass: "text-slate-950",
    iconClass: "text-amber-600",
  },
  {
    key: "lowPriority",
    label: "Low Priority",
    icon: CircleDot,
    labelClass: "text-slate-900",
    valueClass: "text-slate-950",
    iconClass: "text-emerald-600",
  },
] as const;

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map(({ key, label, icon: Icon, labelClass, valueClass, iconClass }) => (
        <article
          key={label}
          className={cn(
            "group flex h-full min-h-[8.5rem] items-center rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_22px_60px_-42px_rgba(15,23,42,0.24)] sm:min-h-[9rem] sm:p-5"
          )}
        >
          <div className="flex w-full items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p
                className={cn(
                  "whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-xs",
                  labelClass
                )}
              >
                {label}
              </p>
              <p
                className={cn(
                  "text-[2.45rem] font-semibold leading-none tracking-tight tabular-nums text-slate-950 sm:text-[2.8rem]",
                  valueClass
                )}
              >
                {stats[key].toLocaleString()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-inset ring-slate-200 transition-transform duration-200 group-hover:scale-[1.02] sm:h-14 sm:w-14">
              <Icon className={cn("h-5.5 w-5.5 sm:h-6 sm:w-6", iconClass)} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
