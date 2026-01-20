import { prisma } from "@/lib/prisma";
import { markNotificationAsRead, clearAllNotifications } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function NotificationsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const query = params.q || "";

    const notifications = await prisma.notification.findMany({
        where: query ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { message: { contains: query, mode: 'insensitive' } }
            ]
        } : {},
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Responsivo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Notificaciones</h2>
                    {query && <p className="text-sm text-slate-500">Buscando: "{query}"</p>}
                </div>
                <form action={clearAllNotifications} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:bg-red-50 border-red-100">
                        <Trash2 className="mr-2 h-4 w-4" /> Borrar todas
                    </Button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center text-slate-500">
                        <Bell className="h-12 w-12 mb-4 text-slate-200" />
                        <p>Estás al día. No hay notificaciones nuevas.</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} className={cn("p-4 md:p-6 border-b flex gap-3 md:gap-4 transition-colors", !n.isRead ? "bg-blue-50/30" : "hover:bg-slate-50")}>
                            <div className={cn("h-2 w-2 mt-2 rounded-full shrink-0", !n.isRead ? "bg-blue-600" : "bg-slate-300")} />
                            <div className="flex-1 min-w-0"> {/* min-w-0 evita desbordamiento de texto flex */}
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
                                    <h3 className={cn("text-sm font-bold truncate w-full sm:w-auto", !n.isRead ? "text-slate-900" : "text-slate-600")}>{n.title}</h3>
                                    <span className="text-xs text-slate-400 shrink-0">{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-600 break-words">{n.message}</p>

                                {!n.isRead && (
                                    <form action={markNotificationAsRead.bind(null, n.id)} className="mt-3 sm:mt-2">
                                        <button className="text-xs font-bold text-blue-600 hover:underline flex items-center bg-blue-50 sm:bg-transparent px-3 py-1 sm:p-0 rounded-full sm:rounded-none">
                                            <CheckCircle className="mr-1 h-3 w-3" /> Marcar como leída
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}