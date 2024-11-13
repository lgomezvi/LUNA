// src/app/layout.tsx
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { AuthHandler } from "@/components/auth-handler";
import { auth } from "@/lib/auth";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Luna - Cycle Tracking",
  description: "Personalized cycle tracking and health insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <AuthHandler />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
