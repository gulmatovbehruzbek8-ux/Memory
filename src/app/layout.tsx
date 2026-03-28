import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeRegistry } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { StorageProvider } from "@/components/StorageProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memory Archive",
  description: "A private, elegant memory storage platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeRegistry>
          <AuthProvider>
            <StorageProvider>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  {children}
                </main>
              </div>
            </StorageProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
