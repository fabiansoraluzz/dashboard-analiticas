"use client"

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, BarChart3, Users, Settings, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analíticas", icon: BarChart3 },
    { href: "/users", label: "Usuarios", icon: Users },
    { href: "/products", label: "Productos", icon: Package },
    { href: "/settings", label: "Configuración", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* El botón hamburguesa solo visible en móvil (md:hidden) */}
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-6 border-b text-left">
                    <SheetTitle className="text-2xl font-bold tracking-tight">atlass.</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col py-6 px-4 space-y-2 h-full">
                    <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Menú Principal
                    </p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)} // Cierra el menú al hacer clic
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
}