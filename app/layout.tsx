import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Portfolio",
  description: "Dashboard analítico moderno creado con Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
          {/* El Sidebar vive aquí, fijo a la izquierda */}
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            {/* El Header vive aquí, fijo arriba */}
            <Header />

            {/* AQUÍ se renderizan tus páginas (page.tsx, analytics/page.tsx, etc) */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}