import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Yeon_Sung,
  Inter,
} from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const titleFont = Yeon_Sung({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

export const metadata: Metadata = {
  title: "Salt & Ember | Flavour Meets Fire",
  description: "A fire-led restaurant in Sylhet where local ingredients meet global instincts.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${titleFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
