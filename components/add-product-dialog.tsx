"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { createProduct } from "@/app/actions"
import { useState } from "react"
import { toast } from "sonner"
import { Plus, Loader2, Package, DollarSign } from "lucide-react"

export function AddProductDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        try {
            await createProduct(formData)
            setOpen(false) // Cerrar modal
            toast.success("Producto agregado al inventario")
        } catch (error) {
            toast.error("Error al crear producto")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white gap-2 hover:bg-slate-800 transition-all">
                    <Plus className="h-4 w-4" /> Nuevo Producto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="grid gap-4 py-4">

                    {/* Nombre */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre del Producto</Label>
                        <div className="relative">
                            <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input id="name" name="name" placeholder="Ej: Laptop Pro X" className="pl-9" required />
                        </div>
                    </div>

                    {/* Categoría y Precio (2 Columnas) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Electrónica">Electrónica</SelectItem>
                                    <SelectItem value="Ropa">Ropa</SelectItem>
                                    <SelectItem value="Hogar">Hogar</SelectItem>
                                    <SelectItem value="Accesorios">Accesorios</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">Precio</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="grid gap-2">
                        <Label htmlFor="stock">Stock Inicial</Label>
                        <Input
                            id="stock"
                            name="stock"
                            type="number"
                            placeholder="10"
                            required
                        />
                    </div>

                    {/* Botón de Guardar */}
                    <Button type="submit" className="mt-2 bg-slate-900" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Producto"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}