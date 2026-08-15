import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsConsent from "./AnalyticsConsent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "力曼小姐 · Ms Riman | 中英双语产品导览",
  description:
    "中英双语 RIMAN 产品导览、私人咨询与预订意向，正式价格、库存和付款由官方商城处理。",
  keywords: [
    "RIMAN Singapore",
    "RIMAN consultant Singapore",
    "RIMAN personal store",
    "Korean skincare consultation",
  ],
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "力曼小姐 · Ms Riman",
    email: "mailto:linzhiatwork@gmail.com",
    areaServed: "Singapore",
    description: "Independent bilingual RIMAN product guide",
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <AnalyticsConsent gaId={gaId} metaPixelId={metaPixelId} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}