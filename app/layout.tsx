import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >{`
          (function () {
            try {
              var storageKey = "secure-notes-theme";
              var storedTheme = localStorage.getItem(storageKey);
              var theme = storedTheme === "light" || storedTheme === "dark"
                ? storedTheme
                : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
              var root = document.documentElement;
              root.dataset.theme = theme;
              root.style.colorScheme = theme;
            } catch (error) {}
          })();
        `}</Script>
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-transparent text-foreground">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
