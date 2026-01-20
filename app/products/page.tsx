import { prisma } from "@/lib/prisma";
import { updateProductStock, deleteProduct } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash, Package } from "lucide-react";

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const query = params.q || "";

    // Filtro dinámico para Productos
    const products = await prisma.product.findMany({
        where: query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } }
            ]
        } : {},
        orderBy: { stock: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
                {query && <p className="text-sm text-slate-500">Filtrando por: "{query}"</p>}
            </div>

            {products.length === 0 ? (
                <p className="text-center py-10 text-slate-500">No hay productos que coincidan.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        // ... (Tu tarjeta de producto existente se mantiene igual)
                        <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                            {/* ... contenido de la tarjeta ... */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-blue-600"><Package /></div>
                                {/* ... Botón borrar y nombre del producto ... */}
                                <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
                            </div>
                            {/* ... resto del código ... */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}