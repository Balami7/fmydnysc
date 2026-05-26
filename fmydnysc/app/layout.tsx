// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHINA-NIGERIA YOUTH EXCHANGE SEMINAR ON CHINA-AFRICA COMMUNITY WITH A SHARED FUTURE",
  description:
    " ",
  icons: {
    icon: "/download26.ico",
  },
  openGraph: {
    title: "CHINA-NIGERIA YOUTH EXCHANGE SEMINAR ON CHINA-AFRICA COMMUNITY WITH A SHARED FUTURE",
    description: " ",
    images: [{ url: "/download26.ico" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}