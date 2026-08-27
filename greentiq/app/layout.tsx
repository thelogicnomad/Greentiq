import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Advanced CRM Dashboard",
  description: "Customer management dashboard built with Next.js 15, TanStack Query v5, Tailwind CSS, shadcn/ui, dnd-kit, and Zod validation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-200">
        <Providers>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
