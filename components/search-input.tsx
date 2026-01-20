"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation" // <--- Agregamos usePathname
import { useDebouncedCallback } from "use-debounce"

export function SearchInput() {
    const searchParams = useSearchParams()
    const pathname = usePathname() // <--- Obtenemos la ruta actual (ej: /users)
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)

        // Si escribimos algo, lo ponemos en la URL (?q=algo)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }

        // Mantenemos la ruta actual (pathname) y solo cambiamos los parámetros
        replace(`${pathname}?${params.toString()}`)
    }, 300);

    return (
        <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
                type="text"
                placeholder="Buscar..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
                className="w-full rounded-full bg-slate-100 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
        </div>
    )
}