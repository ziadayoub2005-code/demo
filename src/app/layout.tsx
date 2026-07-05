import type { Metadata, Viewport } from "next";
import { Cairo, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SplashScreen from "@/components/SplashScreen";

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
  title: "منيو بلاك وايت | القائمة الفاخرة",
  description: "اكتشف قائمتنا الفاخرة من البرغر، سطل اللمة، البوكسات، كرسبي بايتس، والباستا الإيطالية المحضرة بأجود المكونات. تجربة طعام فريدة بلونين الأبيض والأسود.",
  robots: "index, follow",
  openGraph: {
    title: "منيو بلاك وايت | القائمة الفاخرة",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black" suppressHydrationWarning>
        <CartProvider>
          <SplashScreen />
          {children}
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
