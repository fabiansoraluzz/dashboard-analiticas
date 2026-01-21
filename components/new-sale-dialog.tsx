"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription // <--- 1. IMPORTANTE: Importamos esto
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
import { registerSale } from "@/app/actions"
import { useState } from "react"
import { Loader2, ShoppingCart, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewSaleDialog({ products }: { products: any[] }) {
    const [openForm, setOpenForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState<string>("")

    const [resultModal, setResultModal] = useState<{
        open: boolean;
        success: boolean;
        message: string;
    }>({ open: false, success: false, message: "" })

    const selectedProduct = products.find(p => p.id === selectedProductId)
    const maxStock = selectedProduct ? selectedProduct.stock : 1

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const response = await registerSale(formData)
        setIsSubmitting(false)

        if (response.success) {
            setOpenForm(false)
            setSelectedProductId("")
        }

        setResultModal({
            open: true,
            success: response.success,
            message: response.message
        })
    }

    const availableProducts = products.filter(p => p.stock > 0);

    return (
        <>
            {/* --- MODAL 1: FORMULARIO DE VENTA --- */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm transition-all active:scale-95">
                        <ShoppingCart className="h-4 w-4" /> Registrar Venta
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nueva Venta</DialogTitle>
                        {/* Agregamos una descripción oculta o visible para cumplir con accesibilidad */}
                        <DialogDescription>
                            Completa los detalles para registrar una nueva transacción.
                        </DialogDescription>
                    </DialogHeader>

                    <form action={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Producto</Label>
                            <Select name="productId" required onValueChange={setSelectedProductId} value={selectedProductId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar del inventario" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableProducts.length === 0 ? (
                                        <SelectItem value="none" disabled>No hay stock disponible</SelectItem>
                                    ) : (
                                        availableProducts.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} — ${p.price}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <Label htmlFor="quantity">Cantidad</Label>
                                {selectedProduct && (
                                    <span className="text-xs text-slate-500 font-medium">
                                        Stock: {selectedProduct.stock}
                                    </span>
                                )}
                            </div>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                max={maxStock}
                                defaultValue="1"
                                required
                                disabled={!selectedProductId}
                                className="font-bold text-lg"
                            />
                            {selectedProduct && selectedProduct.stock < 5 && (
                                <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                                    <AlertCircle className="h-3 w-3" /> Quedan pocas unidades
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="mt-4 bg-slate-900 h-11 text-base" disabled={isSubmitting || !selectedProductId}>
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                            ) : (
                                "Confirmar Venta"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL 2: RESULTADO (CORREGIDO PARA ACCESIBILIDAD) --- */}
            <Dialog open={resultModal.open} onOpenChange={(open) => setResultModal(prev => ({ ...prev, open }))}>
                <DialogContent className="sm:max-w-md text-center p-0 overflow-hidden border-none shadow-2xl">

                    <div className={cn(
                        "p-6 flex flex-col items-center justify-center gap-4",
                        resultModal.success ? "bg-emerald-50" : "bg-red-50"
                    )}>
                        <div className={cn(
                            "h-20 w-20 rounded-full flex items-center justify-center border-4 shadow-sm",
                            resultModal.success ? "bg-emerald-100 border-emerald-200 text-emerald-600" : "bg-red-100 border-red-200 text-red-600"
                        )}>
                            {resultModal.success ? (
                                <CheckCircle2 className="h-10 w-10" />
                            ) : (
                                <XCircle className="h-10 w-10" />
                            )}
                        </div>

                        <div className="space-y-1">
                            {/* 2. USAMOS DialogTitle EN LUGAR DE h2 */}
                            <DialogTitle className={cn("text-2xl font-bold", resultModal.success ? "text-emerald-700" : "text-red-700")}>
                                {resultModal.success ? "¡Venta Exitosa!" : "No se pudo realizar"}
                            </DialogTitle>

                            {/* 3. USAMOS DialogDescription EN LUGAR DE p */}
                            <DialogDescription className="text-slate-600 font-medium px-4">
                                {resultModal.message}
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="p-6 bg-white">
                        <Button
                            className={cn(
                                "w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all",
                                resultModal.success ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800"
                            )}
                            onClick={() => setResultModal(prev => ({ ...prev, open: false }))}
                        >
                            Entendido
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}