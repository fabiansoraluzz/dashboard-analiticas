"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState } from "react"

export function ReportFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [dateFrom, setDateFrom] = useState(searchParams.get("from") || "")
    const [dateTo, setDateTo] = useState(searchParams.get("to") || "")

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams)

        if (dateFrom) params.set("from", dateFrom)
        else params.delete("from")

        if (dateTo) params.set("to", dateTo)
        else params.delete("to")

        router.push(`/reports?${params.toString()}`)
    }

    const clearFilters = () => {
        setDateFrom("")
        setDateTo("")
        router.push("/reports")
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
            <div className="grid gap-2 w-full md:w-auto">
                <Label htmlFor="from" className="text-xs font-semibold text-slate-500 uppercase">Fecha Inicio</Label>
                <Input
                    id="from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-slate-50"
                />
            </div>

            <div className="grid gap-2 w-full md:w-auto">
                <Label htmlFor="to" className="text-xs font-semibold text-slate-500 uppercase">Fecha Fin</Label>
                <Input
                    id="to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="bg-slate-50"
                />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={handleFilter} className="bg-slate-900 text-white hover:bg-slate-800">
                    <Search className="mr-2 h-4 w-4" /> Filtrar
                </Button>
                {(dateFrom || dateTo) && (
                    <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-red-600">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}