"use client" // Client component para manejar el estado del formulario visualmente

import { updateSettings } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {

    async function handleSubmit(formData: FormData) {
        const result = await updateSettings(formData);
        toast.success("Configuración guardada correctamente");
    }

    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Configuración</h2>

            <Card>
                <CardHeader>
                    <CardTitle>General</CardTitle>
                    <CardDescription>Personaliza la apariencia de tu dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="projectName">Nombre del Proyecto</Label>
                            <Input id="projectName" name="projectName" defaultValue="Dashboard Analítico" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="theme">Tema</Label>
                            <select name="theme" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="light">Claro</option>
                                <option value="dark">Oscuro</option>
                                <option value="system">Sistema</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="bg-slate-900 text-white">Guardar Cambios</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}