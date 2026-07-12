import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookMarked, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { SignupForm } from "@/components/forms/SignupForm";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sign Up | Secure Notes",
  description: "Create your account to continue to your Notes Dashboard.",
};

export default async function SignUpPage() {
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
      badgeIcon={UserPlus}
      title="Create your account"
      description="Set up your private notes workspace in seconds. Capture ideas, organize priorities, and keep everything accessible with a polished, responsive interface."
      highlights={[
        {
          title: "Private and secure",
          description: "Your notes stay inside your authenticated workspace with the same safety guarantees.",
          icon: ShieldCheck,
        },
        {
          title: "Designed for speed",
          description: "Use notes, search, and filters from a layout built to feel effortless on every screen.",
          icon: BookMarked,
        },
        {
          title: "Ready for growth",
          description: "A production-grade presentation makes the learning project feel like a real SaaS product.",
          icon: Sparkles,
        },
      ]}
    >
      <SignupForm />
    </AuthPageShell>
  );
}
