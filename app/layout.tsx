import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";
import Providers from "@/components/layout/providers";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: "NextBreak - Premium E-commerce Store",
    template: "%s | NextBreak"
  },
  description: "Discover the best products at NextBreak. Shop our curated collection of high-quality items with fast delivery and excellent customer service.",
  keywords: ["NextBreak", "e-commerce", "online shopping", "premium products", "store"],
  authors: [{ name: "NextBreak Team" }],
  openGraph: {
    title: "NextBreak - Premium E-commerce Store",
    description: "Discover the best products at NextBreak. Shop our curated collection of high-quality items.",
    url: "https://nextbreak-rouge.vercel.app/",
    siteName: "NextBreak",

    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextBreak - Premium E-commerce Store",
    description: "Discover the best products at NextBreak. Shop our curated collection of high-quality items.",
 
  },
   alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${cairo.variable} antialiased `}>
          <main className="min-h-screen  mx-auto max-w-screen-2xl">
            <NavBar />
            {children}
           <Analytics/>
          </main>
          <Footer />
        </body>
      </html>
    </Providers>
  );
}