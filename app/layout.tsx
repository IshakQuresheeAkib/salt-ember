import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DynaPuff,
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

const dynaPuff = DynaPuff({
  subsets: ["latin"],
  variable: "--font-dynapuff",
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
      data-title-font="dynapuff"
      className={`${displayFont.variable} ${bodyFont.variable} ${dynaPuff.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
