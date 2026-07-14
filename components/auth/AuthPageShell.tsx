import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

type AuthHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type AuthPageShellProps = {
  badgeLabel: string;
  title: string;
  description: string;
  highlights: AuthHighlight[];
  children: ReactNode;
};

export function AuthPageShell({
  badgeLabel,
  title,
  description,
  highlights,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-x-clip bg-transparent px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-[-7rem] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-[8rem] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-7xl items-center gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,28rem)] xl:gap-10">
        <section className="hidden flex-col justify-between rounded-[2.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.24)] backdrop-blur-xl xl:flex">
          <div className="space-y-8">
            <div className="space-y-3">
              <BrandLogo variant="auth" />
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--primary)] shadow-sm shadow-neutral-950/5">
                {badgeLabel}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] xl:text-[3.15rem]">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-[color:var(--muted-foreground)]">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.title}
                  className="flex items-start gap-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.16)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)] ring-1 ring-inset ring-[color:var(--primary-border)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                      {highlight.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 sm:space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.24)] backdrop-blur-xl xl:hidden sm:p-6">
            <div className="space-y-3">
              <BrandLogo variant="auth" />
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--primary)] shadow-sm shadow-neutral-950/5">
                {badgeLabel}
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-[2.4rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted-foreground)] sm:text-base">
              {description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5 shadow-[0_30px_90px_-52px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
