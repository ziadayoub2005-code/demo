import type { Metadata, Viewport } from "next";
import { Cairo, Outfit } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "منيو بلاك آند وايت | القائمة الفاخرة",
  description: "اكتشف قائمتنا الفاخرة من البرغر، سطل اللمة، البوكسات، كرسبي بايتس، والباستا الإيطالية المحضرة بأجود المكونات. تجربة طعام فريدة بلونين الأبيض والأسود.",
  robots: "index, follow",
  openGraph: {
    title: "منيو بلاك آند وايت | القائمة الفاخرة",
    description: "القائمة الكاملة لأشهى المأكولات والمشروبات والحلويات الفاخرة باللونين الأبيض والأسود.",
    type: "website",
    locale: "ar_EG",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
