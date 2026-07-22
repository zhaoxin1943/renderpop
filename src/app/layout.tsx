import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
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
    default: `${siteConfig.name}: Free AI Generator — AI Image, Video & Photo to Dance, No Login`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "free ai image generator",
    "free ai video generator",
    "image to video generator",
    "photo to dance ai free",
    "ai image generator free no sign up",
    "ai video generator no login",
    "generador de imagenes de ia gratis sin registro",
    "free ai generator",
    "no login ai generator",
    "ai photo animation free",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: `${siteConfig.name}: Free AI Image & Video Generator — No Sign Up`,
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
          <Header />
          <main className="w-full flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
