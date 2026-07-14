import { BarChart3, Sparkles, TrendingUp } from "lucide-react";
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

function getWorkspaceSignal(stats: DashboardStats) {
  const total = stats.totalNotes;

  if (total === 0) {
    return {
      title: "Your workspace is ready for its first note.",
      description:
        "Once you capture a few notes, this panel will show how your priorities are distributed.",
    };
  }

  const counts = [
    { label: "High", value: stats.highPriority },
    { label: "Medium", value: stats.mediumPriority },
    { label: "Low", value: stats.lowPriority },
  ];

  const dominant = counts.reduce((winner, current) =>
    current.value > winner.value ? current : winner
  );
  const spread =
    Math.max(...counts.map((item) => item.value)) - Math.min(...counts.map((item) => item.value));

  if (dominant.value === 0) {
    return {
      title: "Everything is calm and unassigned.",
      description:
        "No notes are currently flagged, so the workspace is clean and easy to scan.",
    };
  }

  if (spread <= 1) {
    return {
      title: "Your priorities are nicely balanced.",
      description:
        "No single lane is overwhelming the others, so you can move between urgent and lighter tasks without friction.",
    };
  }

  return {
    title: `${dominant.label} priority is leading your workspace.`,
    description:
      "That pattern is a good cue to keep the top items visible and batch the quieter ones later.",
  };
}

export function DashboardInsights({ stats }: DashboardInsightsProps) {
  const totalNotes = stats.totalNotes;
  const insights = priorityInsights(stats);
  const signal = getWorkspaceSignal(stats);
  const dominantInsight = insights.reduce((winner, current) =>
    current.value > winner.value ? current : winner
  );
  const values = [stats.highPriority, stats.mediumPriority, stats.lowPriority];
  const spread = Math.max(...values) - Math.min(...values);
  const balanceScore = totalNotes === 0 ? 0 : Math.max(35, 100 - spread * 22);

  const chartGradient =
    totalNotes > 0
      ? (() => {
          let start = 0;

          return insights
            .map((item, index) => {
              const share = (item.value / totalNotes) * 100;
              const end = index === insights.length - 1 ? 100 : start + share;
              const slice = `${item.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
              start = end;
              return slice;
            })
            .join(", ");
        })()
      : "var(--surface-muted) 0deg 360deg";

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
              Insights / Charts
            </div>
            <div className="space-y-2">
              <h2 className={sectionTitleClassName}>Where your notes are concentrated</h2>
              <p className={helperTextClassName}>
                A compact breakdown of urgency, balance, and momentum so you can scan the
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

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-center">
              <div className="relative mx-auto flex w-full max-w-[15rem] items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                <div
                  className="relative flex h-48 w-48 items-center justify-center rounded-full shadow-[0_18px_50px_-30px_rgba(15,23,42,0.3)] sm:h-52 sm:w-52"
                  style={{
                    background: `conic-gradient(${chartGradient})`,
                  }}
                >
                  <div className="absolute inset-[0.9rem] rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] shadow-inner" />
                  <div className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-center shadow-[0_10px_30px_-20px_rgba(15,23,42,0.22)] sm:h-32 sm:w-32">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Total notes
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
                      {totalNotes.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[color:var(--muted-foreground)]">
                      {totalNotes > 0 ? `${dominantInsight.label} is leading` : "Capture your first note"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.14)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                        Priority mix
                      </p>
                      <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                        How your workspace is split today
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-[color:var(--primary)]" />
                  </div>

                  <div className="mt-4 space-y-3">
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
                              <span className="font-medium text-[color:var(--foreground)]">
                                {item.label}
                              </span>
                            </div>
                            <span className="tabular-nums text-[color:var(--muted-foreground)]">
                              {item.value} note{item.value === 1 ? "" : "s"} · {percent}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
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
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.16)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
                      Balance score
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                      {balanceScore}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                      {balanceScore >= 85
                        ? "Very even"
                        : balanceScore >= 65
                          ? "Moderate"
                          : "Skewed"}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.16)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
                      Leading lane
                    </p>
                    <p className={cn("mt-2 text-2xl font-semibold tracking-tight", dominantInsight.accentClassName)}>
                      {dominantInsight.label}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                      {dominantInsight.value} note{dominantInsight.value === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.16)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
                      Next cue
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
                      {totalNotes === 0
                        ? "Create a few notes and the chart will start to speak."
                        : dominantInsight.key === "highPriority"
                          ? "Clear the urgent lane first."
                          : dominantInsight.key === "mediumPriority"
                            ? "Batch the middle lane."
                            : "Keep the low lane as your idea parking lot."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Live bar chart
                  </p>
                  <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                    Compact note distribution by priority
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-1.5 text-xs font-semibold text-[color:var(--muted-foreground)]">
                  <BarChart3 className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  Live
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {insights.map((item) => {
                  const percent = formatPercent(item.value, totalNotes);

                  return (
                    <div key={item.key} className="grid grid-cols-[4.25rem_minmax(0,1fr)_3rem] items-center gap-3">
                      <span className={cn("text-sm font-medium", item.accentClassName)}>
                        {item.label}
                      </span>
                      <div className="h-3 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            background: `linear-gradient(90deg, ${item.softColor}, ${item.color})`,
                          }}
                        />
                      </div>
                      <span className="text-right text-sm font-semibold tabular-nums text-[color:var(--foreground)]">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Distribution snapshot
              </p>
              <div className="mt-4 space-y-3">
                {insights.map((item) => {
                  const percent = formatPercent(item.value, totalNotes);

                  return (
                    <div
                      key={item.key}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className={cn("text-sm font-semibold", item.accentClassName)}>
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold tabular-nums text-[color:var(--foreground)]">
                            {item.value}
                          </p>
                          <p className="text-xs font-medium text-[color:var(--muted-foreground)]">
                            {percent}% of total
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Workspace signal
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
                {signal.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {signal.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
