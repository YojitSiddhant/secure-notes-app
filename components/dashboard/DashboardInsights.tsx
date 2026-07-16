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
  const maxValue = Math.max(0, ...insights.map((item) => item.value));

  return (
    <section className={cn(sectionShellClassName, "relative overflow-hidden p-5 sm:p-6")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-5rem] h-40 w-40 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
        <div className="absolute right-[-5rem] top-6 h-48 w-48 rounded-full bg-[color:var(--warning-soft)] blur-3xl" />
      </div>

      <div className="relative space-y-4">
        <div className="space-y-2">
          <h2 className={sectionTitleClassName}>Where your notes are concentrated</h2>
          <p className={helperTextClassName}>
            A clean bar-only view of urgency, balance, and momentum so you can scan the workspace
            in seconds.
          </p>
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
          </div>

          <div className="mt-6">
            <div
              className="grid min-h-72 items-end gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:gap-4 sm:p-5"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr))",
              }}
            >
              {insights.map((item) => {
                const percent = formatPercent(item.value, totalNotes);
                const heightPercent = maxValue === 0 ? 0 : Math.max(8, (item.value / maxValue) * 100);

                return (
                  <div key={item.key} className="flex h-full flex-col justify-end gap-3">
                    <div className="flex min-h-8 items-center justify-center">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                          item.accentClassName,
                          "bg-[color:var(--surface-elevated)] ring-[color:var(--border)]"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>

                    <div className="relative flex flex-1 items-end justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,rgba(148,163,184,0.06),rgba(148,163,184,0.02))] px-2 py-3">
                      <div className="absolute inset-x-3 bottom-3 h-px bg-[color:var(--border)]" />
                      <div
                        className="relative w-full max-w-20 rounded-[1rem] border border-white/60 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.32)] transition-all duration-500"
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: item.value === 0 ? "0.5rem" : "1.25rem",
                          background: `linear-gradient(180deg, ${item.softColor}, ${item.color})`,
                        }}
                      />
                    </div>

                    <div className="space-y-1 text-center">
                      <p className="text-sm font-semibold tabular-nums text-[color:var(--foreground)]">
                        {item.value}
                      </p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {percent}% of total
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              {totalNotes === 0
                ? "Add notes to see the columns grow."
                : "The tallest column shows the current priority concentration."}
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
              {totalNotes === 0
                ? "Once you capture a few notes, the bar chart will reflect how your workspace is split."
                : "This view keeps the focus on vertical bars only, so the distribution stays easy to read at a glance."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
