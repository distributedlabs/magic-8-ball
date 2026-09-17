import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Jev Oracle",
  description: "A TypeSafe-powered Magic 8 Ball.",
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
