"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser } from "@/app/actions"
import { useState } from "react"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react" // Importar Loader2

export function AddUserDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false) // Nuevo estado

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true); // Bloquear
        try {
            await createUser(formData)
            setOpen(false)
            toast.success("Usuario creado exitosamente")
        } catch (error) {
            toast.error("Error al crear usuario")
        } finally {
            setIsSubmitting(false); // Desbloquear
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="h-4 w-4" /> Nuevo Usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" name="name" required placeholder="Juan Pérez" disabled={isSubmitting} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="juan@empresa.com" disabled={isSubmitting} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Rol</Label>
                        <select
                            name="role"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            <option value="viewer">Viewer</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>
                    <Button type="submit" className="mt-2 bg-slate-900" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Usuario"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}