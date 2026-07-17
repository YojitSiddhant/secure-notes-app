"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ProtectedAppShell } from "@/components/auth/ProtectedAppShell";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardStatCards } from "@/components/dashboard/DashboardStatCards";
import { ErrorState } from "@/components/shared/FeedbackState";
import { NoteDialog } from "@/components/notes/NoteDialog";
import { cn } from "@/lib/cn";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  pageSubtitleClassName,
  pageTitleClassName,
  primaryButtonClassName,
  sectionEyebrowClassName,
  sectionShellClassName,
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
      dashboardQuery.error instanceof Error
        ? dashboardQuery.error.message
        : "Please try again.";

    return (
        <ErrorState
        icon={<Sparkles className="h-7 w-7" />}
        title="We couldn&apos;t load your dashboard."
        description={description}
          action={
            <button
              type="button"
              onClick={() => dashboardQuery.refetch()}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-lg shadow-blue-950/20 transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-blue-500/20 sm:w-auto"
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

  return (
    <div className="space-y-6 sm:space-y-7">
      <section
        className={cn(
          sectionShellClassName,
          "ui-animate-rise-in p-5 sm:p-6"
        )}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className={sectionEyebrowClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard overview
            </div>
            <div className="space-y-2">
              <h1 className={pageTitleClassName}>Welcome back</h1>
              <p className={pageSubtitleClassName}>
                Track your note workload, monitor priorities, and jump into note
                creation from one calm, focused workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setManualCreateOpen(true)}
              className={cn(primaryButtonClassName, "ui-animate-rise-in-delay-2 w-full sm:w-auto")}
            >
              Create Note
            </button>
          </div>
        </div>
      </section>

      <DashboardStatCards stats={stats} />

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
      <div className="space-y-6 sm:space-y-7">
        <DashboardContent />
      </div>
    </ProtectedAppShell>
  );
}
