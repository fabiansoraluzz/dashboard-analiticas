"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUser } from "@/app/actions"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function EditUserDialog({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await updateUser(formData)
            onOpenChange(false)
            toast.success("Usuario actualizado correctamente")
        } catch (error) {
            toast.error("Error al actualizar usuario")
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    {/* Input oculto para enviar el ID */}
                    <input type="hidden" name="id" value={user.id} />

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" name="name" defaultValue={user.name} required disabled={isSubmitting} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={user.email} required disabled={isSubmitting} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Rol</Label>
                        <select
                            name="role"
                            defaultValue={user.role}
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
                            "Guardar Cambios"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}