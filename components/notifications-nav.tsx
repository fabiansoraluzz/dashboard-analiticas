"use client"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NotificationsNav({ notifications }: { notifications: any[] }) {
    const [open, setOpen] = useState(false)
    const unreadCount = notifications.filter((n: any) => !n.isRead).length

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-colors">
                    <Bell className="h-5 w-5 text-slate-500" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white animate-pulse"></span>
                    )}
                </div>
            </PopoverTrigger>
            {/* SOLUCIÓN RESPONSIVE: w-[90vw] para que ocupe casi toda la pantalla en móvil, pero máx 320px (w-80) en PC */}
            <PopoverContent className="w-[90vw] sm:w-80 p-0 mr-2 sm:mr-0" align="end" sideOffset={8}>
                <div className="flex items-center justify-between border-b px-4 py-3 bg-white rounded-t-lg">
                    <h4 className="font-semibold text-sm">Notificaciones</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>
                </div>
                <div className="max-h-[60vh] sm:max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500">No tienes notificaciones.</div>
                    ) : (
                        notifications.map((n: any) => (
                            <div key={n.id} className={cn("flex flex-col gap-1 border-b px-4 py-3 text-sm hover:bg-slate-50 transition-colors", !n.isRead && "bg-blue-50/50")}>
                                <div className="flex items-center justify-between">
                                    <span className={cn("font-medium truncate pr-2", !n.isRead ? "text-slate-900" : "text-slate-600")}>{n.title}</span>
                                    <span className="text-[10px] text-slate-400 shrink-0">{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-500 line-clamp-2 text-xs leading-relaxed">{n.message}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="border-t p-2 bg-slate-50 rounded-b-lg">
                    <Link href="/notifications" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-center text-xs text-blue-600 h-8 hover:text-blue-700 hover:bg-blue-100/50">
                            Ver todas las notificaciones
                        </Button>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    )
}