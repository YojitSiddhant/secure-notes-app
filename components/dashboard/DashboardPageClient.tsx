"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProtectedAppShell } from "@/components/auth/ProtectedAppShell";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardStatCards } from "@/components/dashboard/DashboardStatCards";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { ErrorState } from "@/components/shared/FeedbackState";
import { NoteDialog } from "@/components/notes/NoteDialog";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { cn } from "@/lib/cn";
import {
  pageSubtitleClassName,
  pageTitleClassName,
  primaryButtonClassName,
  sectionEyebrowClassName,
} from "@/components/ui/styles";

function DashboardContent() {
  const dashboardQuery = useDashboardStats();
  const [manualCreateOpen, setManualCreateOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCreateRequested = searchParams.get("create") === "1";
  const isCreateOpen = manualCreateOpen || isCreateRequested;

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError) {
    const description =
      dashboardQuery.error instanceof Error ? dashboardQuery.error.message : "Please try again.";

    return (
      <ErrorState
        icon={<Sparkles className="h-7 w-7" />}
        title="We couldn&apos;t load your dashboard."
        description={description}
        action={
          <button
            type="button"
            onClick={() => dashboardQuery.refetch()}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_18px_40px_-22px_rgba(56,86,240,0.65)] transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-slate-500/20 sm:w-auto"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!dashboardQuery.data) {
    return <DashboardSkeleton />;
  }

  const stats = dashboardQuery.data;
  const totalPriorityNotes = stats.highPriority + stats.mediumPriority + stats.lowPriority;

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(247,250,255,0.9),rgba(236,243,255,0.95))] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-4rem] top-[-4rem] h-56 w-56 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
          <div className="absolute right-[-3rem] top-4 h-56 w-56 rounded-full bg-[color:var(--info-soft)] blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className={sectionEyebrowClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard overview
            </div>
            <div className="space-y-3">
              <h1 className={pageTitleClassName}>Your notes workspace at a glance.</h1>
              <p className={pageSubtitleClassName}>
                Track note volume, spot priority pressure, and launch a new note from a calm,
                production-quality dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setManualCreateOpen(true)}
                className={cn(primaryButtonClassName, "w-full sm:w-auto")}
              >
                Create Note
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/notes")}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[color:var(--primary-border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-slate-500/20"
              >
                Open Notes
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem] lg:max-w-[32rem]">
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-4 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Total
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {stats.totalNotes}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:rgba(219,49,81,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,248,0.92))] px-4 py-4 shadow-[0_18px_42px_-32px_rgba(219,49,81,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--danger)]">
                High
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {stats.highPriority}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-4 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Active
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {totalPriorityNotes}
              </p>
            </div>
          </div>
        </div>
      </section>

      <DashboardStatCards stats={stats} />
      <DashboardInsights stats={stats} />

      <NoteDialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (open) {
            setManualCreateOpen(true);
            return;
          }

          setManualCreateOpen(false);

          if (isCreateRequested) {
            router.replace(pathname);
          }
        }}
      />
    </div>
  );
}

export function DashboardPageClient() {
  return (
    <ProtectedAppShell loadingFallback={<DashboardSkeleton />}>
      <DashboardContent />
    </ProtectedAppShell>
  );
}
