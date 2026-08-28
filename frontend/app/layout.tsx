import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIKSHA | Skill Intelligence",
  description: "AI-Powered Skill Intelligence for Official Statistics"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
