


import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/themeContext";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import PortfolioShell from "@/components/PortfolioShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vendor Portfolio",
  description: "Discover amazing products from our vendors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <PortfolioShell>
              {children}
            </PortfolioShell>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
