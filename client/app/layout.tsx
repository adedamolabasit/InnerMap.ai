import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/shared/components/Ui/toaster";


export const metadata: Metadata = {
  title: "InnerMap - Dream Reflection & AI Insights",
  description:
    "Explore your dreams through journaling and AI-powered analysis. Capture, reflect, and understand your inner world.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      {
        url: "/placeholder-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/placeholder-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/placeholder.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/placeholder-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
