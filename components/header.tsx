import { Calendar as CalendarIcon, User, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { SearchInput } from "@/components/search-input";
import { NotificationsNav } from "@/components/notifications-nav";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function Header() {
    // Obtenemos notificaciones reales
    const notifications = await prisma.notification.findMany({
        take: 5, orderBy: { createdAt: 'desc' }
    });

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 py-4 shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-4 w-full md:w-1/3">
                <MobileNav />
                <SearchInput />
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-4 shrink-0">
                <Button variant="outline" size="sm" className="hidden lg:flex gap-2 rounded-full border-slate-200 text-slate-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}</span>
                </Button>

                {/* Notificaciones (asegúrate de que NotificationsNav también tenga su arreglo si usa Popover) */}
                <NotificationsNav notifications={notifications} />

                <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

                {/* CORRECCIÓN AQUÍ: Agregamos modal={false} */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer p-1 pr-0 md:pr-3 rounded-full transition-all hover:bg-slate-50">
                            <Avatar className="h-8 w-8 md:h-9 md:w-9">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>YO</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-slate-700 leading-none">Mi Portfolio</p>
                                <p className="text-xs text-slate-500 mt-1">Admin</p>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/profile" className="flex items-center w-full">
                                <User className="mr-2 h-4 w-4" /> Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/settings" className="flex items-center w-full">
                                <Settings className="mr-2 h-4 w-4" /> Configuración
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}