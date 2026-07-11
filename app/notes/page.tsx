import type { Metadata } from "next";
import { NotesPageClient } from "@/components/notes/NotesPageClient";

export const metadata: Metadata = {
  title: "Notes | Secure Notes",
};

export default function NotesPage() {
  return <NotesPageClient />;
}
