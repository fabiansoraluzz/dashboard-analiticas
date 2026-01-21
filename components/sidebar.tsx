"use client"

import { LayoutDashboard, Users, Settings, Package, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Productos", icon: Package },
    { href: "/users", label: "Usuarios", icon: Users },
    { href: "/reports", label: "Reportes", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-white dark:bg-slate-950 dark:border-slate-800 md:flex w-64 min-h-screen flex-col sticky top-0 transition-colors duration-300">
            <div className="p-6 border-b dark:border-slate-800">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">atlass.</h1>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2">
                <p className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                    General
                </p>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <p className="px-2 pt-8 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Soporte</p>
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                        pathname === "/settings" && "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    )}
                >
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                </Link>
            </div>
        </div>
    );
}