import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { siteConfig } from "@/lib/config";
import { I18nProvider } from "@/i18n/I18nContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: AI Image & Video Generator`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "free ai image generator",
    "ai video generator",
    "image to video generator",
    "ai image generator",
    "generador de imagenes de ia",
    "text to video generator",
    "ai photo animation",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: `${siteConfig.name}: AI Image & Video Generator`,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-[#050505] text-[#fafafa]">
        <I18nProvider>
          <AuthProvider>
            <Header />
            <main className="w-full flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
