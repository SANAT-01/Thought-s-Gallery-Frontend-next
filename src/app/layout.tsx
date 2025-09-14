import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/provider";
import Controls from "@/components/Controls";

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
            <body className="bg-background text-foreground min-h-screen flex flex-col">
                {/* Redux Provider */}
                <Providers>
                    {/* Global Controls like Toasts, Modals */}
                    <Controls />
                    {/* ✅ Navbar always fixed at top */}
                    <header className="fixed inset-x-0 top-0 z-50">
                        <Navbar />
                    </header>

                    {/* ✅ main content below navbar, scrollable if needed */}
                    <main className="flex-1 pt-16 overflow-y-hidden">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
