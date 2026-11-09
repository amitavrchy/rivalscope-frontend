import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./product.css";
import { Providers } from '@/components/providers';

const geistSans = localFont({
  src: '../fonts/Geist.woff2',
  variable: "--font-geist-sans",
  display: 'swap',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../fonts/GeistMono.woff2',
  variable: "--font-geist-mono",
  display: 'swap',
  weight: '100 900',
});
const bengaliFont = localFont({ src: '../fonts/NotoSansBengali.ttf', variable: '--font-bengali', display: 'swap', weight: '100 900' });

export const metadata: Metadata = {
  title: "RivalScope AI — Competitive intelligence",
  description: "Evidence-backed competitor research, market intelligence, and monitoring for ambitious teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bengaliFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
