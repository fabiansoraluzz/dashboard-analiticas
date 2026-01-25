export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/actions"; // <--- Importamos la acción
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, User as UserIcon, Mail, Shield } from "lucide-react";
import { toast } from "sonner"; // Para notificaciones (usaremos un componente cliente pequeño)
import { ProfileForm } from "@/components/profile-form"; // <--- Crearemos este componente abajo

export default async function ProfilePage() {
    // 1. Simular sesión: Obtenemos el usuario admin (el del seed)
    // En una app real, aquí usarías: const session = await auth();
    const user = await prisma.user.findFirst({
        where: { role: 'admin' }
    }) || await prisma.user.findFirst(); // Fallback por si no hay admin

    if (!user) {
        return <div className="p-8 text-center">No se encontró el usuario. Corre el seed nuevamente.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mi Perfil</h2>
                <p className="text-slate-500">Gestiona tu información personal y configuración de cuenta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* COLUMNA IZQUIERDA: Tarjeta de Identidad */}
                <Card className="md:col-span-1 h-fit shadow-sm border-none bg-white rounded-2xl">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="relative inline-block">
                            <Avatar className="h-32 w-32 mx-auto border-4 border-slate-50 shadow-sm">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="text-4xl bg-slate-100 text-slate-400">
                                    {user.name?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors shadow-md border-2 border-white">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl text-slate-900">{user.name}</h3>
                            <p className="text-sm text-slate-500">{user.email}</p>
                        </div>

                        <div className="flex justify-center gap-2 pt-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
                                {user.role.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-slate-500">
                                Activo
                            </Badge>
                        </div>

                        <div className="pt-4 border-t text-left space-y-3 text-sm text-slate-600">
                            <div className="flex items-center justify-between">
                                <span>Miembro desde:</span>
                                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Último acceso:</span>
                                <span className="font-medium text-emerald-600">Ahora</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* COLUMNA DERECHA: Formulario de Edición */}
                <Card className="md:col-span-2 shadow-sm border-none bg-white rounded-2xl">
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>Actualiza tus datos de contacto básicos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Usamos un componente Cliente para manejar el estado de carga y toast */}
                        <ProfileForm user={user} />
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}