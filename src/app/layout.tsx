import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Thought's Gallery",
  description: "Share and react to thoughts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <header className="fixed inset-x-0 top-0 z-50">
          <Navbar /> {/* ✅ client-side navbar */}
        </header>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
