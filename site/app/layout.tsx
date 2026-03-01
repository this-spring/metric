import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Indicators",
  description: "S&P 500 PE, NASDAQ PE, VIX historical trends updated hourly",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
