"use client"

import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react" // Renombramos el icono aquí
import { useRouter, useSearchParams } from "next/navigation"

export function Search() {
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("q", term)
        } else {
            params.delete("q")
        }
        replace(`?${params.toString()}`)
    }

    return (
        <div className="relative w-full md:w-[300px]">
            {/* Icono decorativo */}
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />

            {/* Input funcional */}
            <Input
                type="search"
                placeholder="Buscar..."
                className="w-full bg-white dark:bg-slate-950 pl-9 border-slate-200 dark:border-slate-800 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
        </div>
    )
}