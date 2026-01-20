"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react" // Importamos Loader2
import * as XLSX from 'xlsx'
import { toast } from "sonner"
import { useState } from "react" // Importamos useState

export function ExportButton({ data }: { data: any[] }) {
    const [isLoading, setIsLoading] = useState(false); // Estado de carga

    const handleExport = async () => {
        setIsLoading(true); // 1. Activar carga

        // Simulamos un pequeño delay para que el usuario vea la animación (UX)
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte");
            XLSX.writeFile(wb, `Reporte_Analiticas_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success("Reporte descargado correctamente");
        } catch (error) {
            toast.error("Error al generar el reporte");
        } finally {
            setIsLoading(false); // 2. Desactivar carga siempre
        }
    }

    return (
        <Button
            onClick={handleExport}
            disabled={isLoading} // Deshabilitar si carga
            className="bg-slate-900 text-white shadow-lg hover:bg-slate-800 gap-2 transition-all"
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {/* Icono girando */}
                    Generando...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" /> Exportar Reporte
                </>
            )}
        </Button>
    )
}