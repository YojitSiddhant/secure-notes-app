import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DashboardStats } from "@/services/notes.service";
import {
  helperTextClassName,
  sectionEyebrowClassName,
  sectionShellClassName,
  sectionTitleClassName,
} from "@/components/ui/styles";

type DashboardInsightsProps = {
  stats: DashboardStats;
};

type PriorityInsight = {
  key: keyof Pick<DashboardStats, "highPriority" | "mediumPriority" | "lowPriority">;
  label: string;
  value: number;
  color: string;
  softColor: string;
  accentClassName: string;
  description: string;
};

const priorityInsights = (stats: DashboardStats): PriorityInsight[] => [
  {
    key: "highPriority",
    label: "High",
    value: stats.highPriority,
    color: "var(--danger)",
    softColor: "var(--danger-soft)",
    accentClassName: "text-[color:var(--danger)]",
    description: "Urgent notes that need immediate attention.",
  },
  {
    key: "mediumPriority",
    label: "Medium",
    value: stats.mediumPriority,
    color: "var(--warning)",
    softColor: "var(--warning-soft)",
    accentClassName: "text-[color:var(--warning)]",
    description: "Tasks that matter, but do not need to be rushed.",
  },
  {
    key: "lowPriority",
    label: "Low",
    value: stats.lowPriority,
    color: "var(--success)",
    softColor: "var(--success-soft)",
    accentClassName: "text-[color:var(--success)]",
    description: "Lightweight notes and ideas you can revisit later.",
  },
];

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function DashboardInsights({ stats }: DashboardInsightsProps) {
  const totalNotes = stats.totalNotes;
  const insights = priorityInsights(stats);
  const dominantInsight = insights.reduce((winner, current) =>
    current.value > winner.value ? current : winner
  );

  return (
    <section className={cn(sectionShellClassName, "relative overflow-hidden p-5 sm:p-6")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-5rem] h-40 w-40 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
        <div className="absolute right-[-5rem] top-6 h-48 w-48 rounded-full bg-[color:var(--warning-soft)] blur-3xl" />
      </div>

      <div className="relative space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className={sectionEyebrowClassName}>
              <BarChart3 className="h-3.5 w-3.5" />
              Priority bars
            </div>
            <div className="space-y-2">
              <h2 className={sectionTitleClassName}>Where your notes are concentrated</h2>
              <p className={helperTextClassName}>
                A clean bar-only view of urgency, balance, and momentum so you can scan the
                workspace in seconds.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] shadow-sm">
            <TrendingUp className="h-4 w-4 text-[color:var(--primary)]" />
            <span>
              {totalNotes === 0
                ? "No notes yet"
                : `${dominantInsight.label} leads with ${formatPercent(dominantInsight.value, totalNotes)}%`}
            </span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Bar chart
              </p>
              <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                Priority distribution by note count
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold text-[color:var(--muted-foreground)]">
              <BarChart3 className="h-3.5 w-3.5 text-[color:var(--primary)]" />
              {totalNotes.toLocaleString()} total
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {insights.map((item) => {
              const percent = formatPercent(item.value, totalNotes);

              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className={cn("font-medium", item.accentClassName)}>{item.label}</span>
                    </div>
                    <span className="tabular-nums text-[color:var(--muted-foreground)]">
                      {item.value} note{item.value === 1 ? "" : "s"} · {percent}%
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, ${item.softColor}, ${item.color})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              {totalNotes === 0
                ? "Add notes to see the bars grow."
                : "The longest bar shows the current priority concentration."}
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
              {totalNotes === 0
                ? "Once you capture a few notes, the bar chart will reflect how your workspace is split."
                : "This view keeps the focus on bar lengths only, so the distribution stays easy to read at a glance."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
