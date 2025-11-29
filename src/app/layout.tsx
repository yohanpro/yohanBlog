import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Yohan Kim | Frontend Engineer",
  description:
    "8년차 프론트엔드 엔지니어. Next.js, Vue 기반 대규모 서비스 설계 및 성능 최적화 전문.",
  keywords: [
    "Frontend Engineer",
    "React",
    "Next.js",
    "Vue",
    "TypeScript",
    "프론트엔드 개발자",
  ],
  authors: [{ name: "Yohan Kim" }],
  openGraph: {
    title: "Yohan Kim | Frontend Engineer",
    description:
      "8년차 프론트엔드 엔지니어. Next.js, Vue 기반 대규모 서비스 설계 및 성능 최적화 전문.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
