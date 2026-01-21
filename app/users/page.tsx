import { prisma } from "@/lib/prisma";
import { UserActions } from "@/components/user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search } from "@/components/search";
import { Users as UsersIcon } from "lucide-react";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params.q || "";

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* HEADER DE USUARIOS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <UsersIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Usuarios</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Gestión de acceso y roles.</p>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <Search />
                </div>
            </div>

            {/* TABLA */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900">
                        <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                            <TableHead className="w-[300px] text-slate-600 dark:text-slate-400 font-semibold">Usuario</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400 font-semibold">Rol</TableHead>
                            <TableHead className="text-slate-600 dark:text-slate-400 font-semibold">Estado</TableHead>
                            <TableHead className="text-right text-slate-600 dark:text-slate-400 font-semibold">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                    No se encontraron usuarios.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50 last:border-none transition-colors">
                                    <TableCell className="flex items-center gap-3 font-medium">
                                        <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-800">
                                            <AvatarImage src={`/avatars/${user.id}.png`} />
                                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                                                {/* CORRECCIÓN: Usamos (user.name || "U") para evitar el error de null */}
                                                {(user.name || "U").charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            {/* CORRECCIÓN: Fallback si no hay nombre */}
                                            <span className="text-slate-900 dark:text-white font-medium">
                                                {user.name || "Sin Nombre"}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize font-medium border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 border-none shadow-none font-medium px-2 py-0.5">
                                            Activo
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActions user={user} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}