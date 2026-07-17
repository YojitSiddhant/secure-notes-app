import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: {
    default: "Secure Notes",
    template: "%s | Secure Notes",
  },
  description: "A premium secure notes workspace for private, focused note taking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col overflow-x-hidden bg-transparent text-foreground"
        style={{ colorScheme: "light" }}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
