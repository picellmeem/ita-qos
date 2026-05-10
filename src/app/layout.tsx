import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ITA-QOS — Integrated Temporal Analytics",
  description: "NFC-based monitoring system for expiry and maintenance tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
