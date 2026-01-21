import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/profile-form" // Tu componente existente
import { ModeToggle } from "@/components/mode-toggle"   // El toggle nuevo

// Simulamos obtener el usuario actual (En producción usarías auth())
// Por ahora usamos el primer usuario o uno fijo para que funcione
async function getUser() {
    const user = await prisma.user.findFirst()
    return user
}

export default async function SettingsPage() {
    const user = await getUser()

    if (!user) return <div>No se encontró usuario.</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto py-6">
            <div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Configuración</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Administra tu cuenta y las preferencias del sistema.
                </p>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6">

                {/* 1. SECCIÓN DE PERFIL (Reutilizamos tu form) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Perfil</CardTitle>
                        <CardDescription>Actualiza tu nombre y correo electrónico público.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm user={user} />
                    </CardContent>
                </Card>

                {/* 2. SECCIÓN DE APARIENCIA */}
                <Card>
                    <CardHeader>
                        <CardTitle>Apariencia</CardTitle>
                        <CardDescription>Personaliza cómo se ve la aplicación en tu dispositivo.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Tema del Sistema</Label>
                            <p className="text-sm text-slate-500">Selecciona entre modo claro, oscuro o automático.</p>
                        </div>
                        <ModeToggle />
                    </CardContent>
                </Card>

                {/* 3. SECCIÓN DE SEGURIDAD (Stub visual) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>Cambia tu contraseña para mantener tu cuenta segura.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current">Contraseña Actual</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="new">Nueva Contraseña</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm">Confirmar Contraseña</Label>
                                <Input id="confirm" type="password" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button variant="outline" disabled>Actualizar Contraseña (Demo)</Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}