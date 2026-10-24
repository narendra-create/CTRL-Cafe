import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/custom-components/providers/theme-provider";
import { cn } from "@/lib/utils";
import Navbar from "@/app/custom-components/Navbar";
import { Toaster } from "@/components/ui/toast";
import Footer from "@/app/custom-components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Space_Grotesk({
  variable: "--font-space-grostek",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTRL-cafe",
  description: "Gaming cafe for your next play",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
