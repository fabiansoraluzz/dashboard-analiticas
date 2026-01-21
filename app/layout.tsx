import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header"; // <--- 1. IMPORTAMOS EL HEADER
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atlass Dashboard",
  description: "Sistema de gestión.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">

            {/* 1. SIDEBAR FIJO A LA IZQUIERDA */}
            <Sidebar />

            {/* 2. COLUMNA DERECHA (HEADER + CONTENIDO) */}
            <div className="flex flex-1 flex-col h-screen overflow-hidden">

              {/* HEADER GLOBAL (Aquí es donde "aparece") */}
              <Header />

              {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
              <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 p-4 md:p-6 lg:p-8">
                {children}
              </main>

            </div>
          </div>
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}