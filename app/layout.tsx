import type { Metadata } from "next";
import { Dancing_Script, Quicksand } from "next/font/google";
import { SITE_TITLE } from "@/lib/brand";
import "./globals.css";

const display = Dancing_Script({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: "Something special, made just for you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={`${display.variable} ${body.variable} antialiased`}>{children}</body>
    </html>
  );
}
