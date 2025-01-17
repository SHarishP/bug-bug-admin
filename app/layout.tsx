import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/provider/toast-provide";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bug-Bug Admin",
  description: "Admin Page to Manage Bug-Bug Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
