import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { cn } from "@/lib/cn";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-x-clip px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
        <div className="absolute right-[-8rem] top-[9rem] h-[22rem] w-[22rem] rounded-full bg-[color:var(--info-soft)] blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[color:var(--success-soft)] blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-7xl items-center gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,26rem)] lg:gap-8">
        <section className="order-2 lg:order-1">
          <div className={cn("overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,249,255,0.88))] p-6 shadow-[0_36px_110px_-62px_rgba(15,23,42,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10", "relative")}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[-4rem] top-[-3rem] h-48 w-48 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
              <div className="absolute right-[-2rem] bottom-[-4rem] h-56 w-56 rounded-full bg-[color:var(--info-soft)] blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BrandLogo variant="auth" />
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                      Secure Notes
                    </p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      Private workspace for focused thinking
                    </p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-medium text-[color:var(--muted-foreground)] shadow-sm sm:inline-flex">
                  <LockKeyhole className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  Encrypted session
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-end">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Trusted private notes
                  </div>
                  <div className="space-y-4">
                    <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-[3.85rem]">
                      A calm, polished home for the thoughts you want to keep secure.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)] sm:text-lg">
                      Capture notes quickly, organize priorities clearly, and move between
                      desktop and mobile with a product feel that is ready for real customers.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {[
                      "Fast capture",
                      "Secure sign-in",
                      "Responsive everywhere",
                    ].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      title: "Capture in seconds",
                      description:
                        "Create, edit, and prioritize notes from a single streamlined workflow.",
                    },
                    {
                      title: "Designed for trust",
                      description:
                        "Clear states, calm contrast, and secure interaction patterns throughout.",
                    },
                    {
                      title: "Feels like a product",
                      description:
                        "Every screen carries the same polish customers expect from a premium SaaS app.",
                    },
                  ].map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.22)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h2 className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                            {item.title}
                          </h2>
                          <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                            {item.description}
                          </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="mb-4 flex justify-center lg:hidden">
            <BrandLogo variant="auth" />
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,255,0.95))] p-5 shadow-[0_34px_100px_-60px_rgba(15,23,42,0.32)] backdrop-blur-2xl sm:p-6 lg:p-7">
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                Account access
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                Sign in to your workspace
              </h2>
              <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                Use your account to get back to the notes you already trust.
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
