import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Manrope } from "next/font/google";

import { AppToaster } from "@/components/feedback/app-toaster";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Box & Go Chocolate Co. | Corporate Configurator",
  description:
    "Design custom corporate chocolate boxes with visual placement, branding, and production-ready exports.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${instrumentSerif.variable} ${geistMono.variable} flex min-h-dvh flex-col antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-[var(--cream)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--chocolate-dark)]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main
          id="main-content"
          className="flex min-h-0 min-w-0 flex-1 flex-col bg-white"
        >
          {children}
        </main>
        <SiteFooter />
        <AppToaster />
      </body>
    </html>
  );
}
