"use client"

import { updateProfile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, User, Mail } from "lucide-react";
import { useState } from "react"; // <--- Ya no importamos useEffect
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileForm({ user }: { user: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await updateProfile(formData);

            router.refresh();

            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar perfil");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={user.id} />

            <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" /> Nombre Completo
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-50/50"
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" /> Correo Electrónico
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-50/50"
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-slate-400">Rol (Solo lectura)</Label>
                <Input
                    value={user.role?.toUpperCase() || 'USER'}
                    disabled
                    className="bg-slate-100 text-slate-500 border-none"
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-slate-900 text-white min-w-[140px]" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}