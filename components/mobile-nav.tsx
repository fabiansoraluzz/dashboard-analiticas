"use client"

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Users, Settings, Package, FileText } from "lucide-react"; // FileText para Reportes
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menú sincronizado con el Sidebar de escritorio
const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Productos", icon: Package },
    { href: "/users", label: "Usuarios", icon: Users },
    { href: "/reports", label: "Reportes", icon: FileText },
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* Botón Hamburguesa (Solo visible en Móvil/Tablet) */}
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500 dark:text-slate-400">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>

            {/* Contenido del Menú Lateral (Dark Mode Ready) */}
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 bg-white dark:bg-slate-950 border-r dark:border-slate-800">
                <SheetHeader className="p-6 border-b dark:border-slate-800 text-left">
                    <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">atlass.</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col py-6 px-4 space-y-2 h-full">
                    <p className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Menú Principal
                    </p>

                    {/* Renderizado de Items */}
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-500")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <p className="px-2 pt-6 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Soporte
                    </p>
                    <Link
                        href="/settings"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                            pathname === "/settings"
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        <span>Configuración</span>
                    </Link>

                    {/* Footer de Usuario en Móvil */}
                    <div className="mt-auto pb-6">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                                <AvatarImage src="/avatars/01.png" />
                                <AvatarFallback className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">FD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Fabian Developer</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Fabian@atlass.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}