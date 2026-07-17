import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { helperTextClassName } from "@/components/ui/styles";

type FeedbackStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: FeedbackStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,255,0.88))] px-5 py-12 text-center shadow-[0_28px_80px_-52px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:px-6 sm:py-16",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)] ring-1 ring-inset ring-[color:var(--primary-border)] sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-[color:var(--foreground)] sm:text-xl">
        {title}
      </h3>
      <p className={cn("mt-2 max-w-md text-sm leading-6 text-[color:var(--muted-foreground)]", helperTextClassName)}>
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  icon,
  title,
  description,
  action,
  className,
}: FeedbackStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[2rem] border border-[color:var(--danger-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,249,0.92))] px-5 py-12 text-center shadow-[0_28px_80px_-52px_rgba(219,49,81,0.18)] backdrop-blur-xl sm:px-6 sm:py-16",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--danger)] shadow-sm ring-1 ring-inset ring-[color:var(--danger-soft)] sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-[color:var(--foreground)] sm:text-xl">
        {title}
      </h3>
      <p className={cn("mt-2 max-w-md text-sm leading-6 text-[color:var(--muted-foreground)]", helperTextClassName)}>
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
