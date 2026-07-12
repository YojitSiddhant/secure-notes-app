import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
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
    <AuthPageShell
      badgeLabel="Secure Notes"
      badgeIcon={LogIn}
      title="Welcome back"
      description="Sign in to continue to your private notes dashboard, review priorities, and keep your workspace organized across every device."
      highlights={[
        {
          title: "Private by default",
          description: "Your session stays encrypted and protected with the app's authentication flow.",
          icon: ShieldCheck,
        },
        {
          title: "Focused workspace",
          description: "Jump directly into a clean dashboard with quick access to notes, filters, and priorities.",
          icon: Workflow,
        },
        {
          title: "Fast anywhere",
          description: "A responsive layout keeps the experience polished on phones, tablets, and large screens.",
          icon: Sparkles,
        },
      ]}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
