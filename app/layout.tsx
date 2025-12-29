import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Content Optimizer - SEO & Marketing Content Platform",
  description: "AI-powered content optimization platform for SEO and marketing teams. Real-time analysis, competitor insights, and actionable recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
