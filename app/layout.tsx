import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Secure Notes",
  description: "A secure notes workspace for authenticated users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-transparent text-foreground" style={{ colorScheme: "light" }}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
