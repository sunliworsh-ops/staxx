import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Staxx — Stack smarter. Create freer.", template: "%s | Staxx" },
  description: "AI-powered financial tracker for OnlyFans creators. Upload earnings, AI handles the math, tax-ready exports when you need them.",
  keywords: ["OnlyFans finance", "creator tax tracker", "content creator finance"],
  openGraph: { title: "Staxx — Stack smarter. Create freer.", description: "AI-powered financial tracker for OnlyFans creators.", type: "website", locale: "en_US" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Staxx" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
