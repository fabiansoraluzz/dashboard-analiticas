"use client"

import { updateProductStock } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StockCounterProps {
    productId: string;
    initialStock: number;
}

export function StockCounter({ productId, initialStock }: StockCounterProps) {
    // 1. Estado local para respuesta INSTANTÁNEA
    const [stock, setStock] = useState(initialStock);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Sincronizar si la base de datos cambia por otro lado (opcional pero recomendado)
    useEffect(() => {
        setStock(initialStock);
    }, [initialStock]);

    const handleUpdate = async (increment: boolean) => {
        // 2. ACTUALIZACIÓN OPTIMISTA:
        // Cambiamos el número visualmente AHORA MISMO, sin esperar al servidor.
        const newStock = increment ? stock + 1 : stock - 1;
        if (newStock < 0) return; // Evitar negativos

        setStock(newStock);

        // 3. ENVIAR AL SERVIDOR EN SEGUNDO PLANO:
        // Usamos startTransition para que esto no congele la UI
        startTransition(async () => {
            try {
                await updateProductStock(productId, increment);
                // Opcional: router.refresh() si quieres asegurar sincronización, 
                // pero para stock rápido a veces es mejor no abusar de refresh.
            } catch (error) {
                // Si falla, revertimos el cambio (Rollback)
                setStock(stock);
                toast.error("Error al actualizar stock");
            }
        });
    };

    return (
        <div className="flex items-center gap-1 bg-white px-1 py-1 rounded-lg shadow-sm border">
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                disabled={stock <= 0}
                onClick={() => handleUpdate(false)} // False = Restar
            >
                <Minus className="h-3 w-3" />
            </Button>

            <span className={`text-sm font-bold min-w-[1.5rem] text-center transition-colors ${stock < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                {stock}
            </span>

            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded"
                onClick={() => handleUpdate(true)} // True = Sumar
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    )
}