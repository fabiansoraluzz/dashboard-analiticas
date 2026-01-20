import { prisma } from "@/lib/prisma";
import { AddUserDialog } from "@/components/add-user-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserActions } from "@/components/user-actions"; // <--- Importamos el componente cliente

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const query = params.q || "";

    const users = await prisma.user.findMany({
        where: query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
            ]
        } : {},
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Usuarios</h2>
                    {query && <p className="text-sm text-slate-500">Resultados para: "{query}"</p>}
                </div>
                <div className="w-full sm:w-auto">
                    <AddUserDialog />
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {users.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No se encontraron usuarios.</div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* CORRECCIÓN: Nos aseguramos de que no haya espacios entre table y thead */}
                        <table className="w-full text-sm text-left min-w-[600px]">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 md:px-6 py-4">Usuario</th>
                                    <th className="px-4 md:px-6 py-4">Rol</th>
                                    <th className="px-4 md:px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4 flex items-center gap-3">
                                            <Avatar className="h-8 w-8 shrink-0"><AvatarFallback>{user.name?.[0]}</AvatarFallback></Avatar>
                                            <div className="min-w-0 max-w-[150px] md:max-w-none">
                                                <p className="font-bold text-slate-900 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <UserActions user={user} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}