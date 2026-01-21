"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

interface ExportButtonProps {
    data: any[];
    fileName?: string;
    label?: string;
}

export function ExportButton({
    data,
    fileName = "Reporte.xlsx",
    label = "Exportar"
}: ExportButtonProps) {

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        XLSX.writeFile(wb, fileName);
    }

    return (
        <Button
            variant="outline"
            className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            onClick={handleExport}
            disabled={!data || data.length === 0}
        >
            <Download className="h-4 w-4" />
            {label}
        </Button>
    )
}