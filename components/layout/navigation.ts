import { LayoutDashboard, NotebookPen } from "lucide-react";

export type AppNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

export const appNavItems: AppNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Notes", href: "/notes", icon: NotebookPen },
];
