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
        "flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-[0_24px_70px_-42px_rgba(15,23,42,0.18)] sm:py-16",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100 sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
        {title}
      </h3>
      <p className={cn("mt-2 max-w-md text-sm leading-6 text-slate-600", helperTextClassName)}>
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
        "flex flex-col items-center justify-center rounded-[2rem] border border-rose-200 bg-white px-6 py-14 text-center shadow-[0_24px_70px_-42px_rgba(225,29,72,0.18)] sm:py-16",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm ring-1 ring-inset ring-rose-100 sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
        {title}
      </h3>
      <p className={cn("mt-2 max-w-md text-sm leading-6 text-slate-600", helperTextClassName)}>
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
