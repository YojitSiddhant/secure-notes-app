import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Login | Secure Notes",
  description: "Sign in to continue to your Notes Dashboard.",
};

export default async function LoginPage() {
  const authUser = await getAuthenticatedUserFromCookies();

  if (authUser) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full max-w-[420px]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.28)] sm:p-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-950/15">
                <span className="text-base font-semibold tracking-tight">SN</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                <LogIn className="h-3.5 w-3.5" />
                Secure Notes
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
                Welcome Back
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
                Sign in to continue to your Notes Dashboard.
              </p>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
