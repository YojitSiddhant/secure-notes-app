import type { Metadata } from "next";
import { DashboardPageClient } from "@/components/dashboard/DashboardPageClient";

export const metadata: Metadata = {
  title: "Dashboard | Secure Notes",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
