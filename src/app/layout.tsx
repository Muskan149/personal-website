import type { Metadata } from "next";
import localFont from "next/font/local";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const samarkan = localFont({
  src: "./fonts/Samarkan.ttf",
  variable: "--font-samarkan-file",
});

export const metadata: Metadata = {
  title: "Muskan Mahajan",
  description: "Personal website of Muskan Mahajan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${samarkan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
