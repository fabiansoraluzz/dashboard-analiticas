import { prisma } from "@/lib/prisma";
import { AddProductDialog } from "@/components/add-product-dialog"; // Modal Crear
import { StockCounter } from "@/components/stock-counter"; // Contador Optimista
import { DeleteProductButton } from "@/components/delete-product-button"; // Botón Eliminar
import { ExportButton } from "@/components/export-button"; // Botón Excel
import { Package } from "lucide-react";

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const query = params.q || "";

    // Filtro de productos
    const whereClause: any = { status: 'active' }; // Solo activos por defecto
    if (query) {
        whereClause['OR'] = [
            { name: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } }
        ];
    }

    const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
    });

    // Preparar datos para Excel
    const exportData = products.map(p => ({
        ID: p.id,
        Producto: p.name,
        Categoría: p.category,
        Precio: p.price,
        Stock: p.stock,
        Estado: p.status,
        Creado: p.createdAt.toLocaleDateString()
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Inventario</h2>
                    {query && <p className="text-sm text-slate-500">Filtrando por: "{query}"</p>}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <ExportButton
                        data={exportData}
                        fileName={`Inventario_${new Date().toISOString().split('T')[0]}.xlsx`}
                        label="Descargar Excel"
                    />
                    <AddProductDialog />
                </div>
            </div>

            {/* GRID PRODUCTOS */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 border rounded-2xl bg-slate-50 border-dashed">
                    <Package className="h-12 w-12 mb-4 text-slate-300" />
                    <p>No se encontraron productos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-all"
                        >
                            {/* Header Card: Icono y Botón Eliminar */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Package className="h-6 w-6" />
                                </div>
                                <DeleteProductButton productId={product.id} />
                            </div>

                            {/* Info Producto */}
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={product.name}>
                                    {product.name}
                                </h3>
                                <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                                    {product.category}
                                </span>
                            </div>

                            {/* Footer: Precio y Stock Optimista */}
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="font-bold text-slate-900 text-lg">
                                    ${product.price.toFixed(2)}
                                </span>
                                {/* Componente de Stock Rápido */}
                                <StockCounter productId={product.id} initialStock={product.stock} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}