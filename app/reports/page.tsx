import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportButton } from "@/components/export-button"
import { ReportFilters } from "@/components/report-filters"
import { Package, Users, DollarSign, CalendarRange } from "lucide-react"

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string }>
}) {
    const params = await searchParams;
    const from = params.from ? new Date(params.from) : undefined;
    const to = params.to ? new Date(params.to) : undefined;

    // Ajuste para incluir todo el día final en la consulta
    if (to) {
        to.setHours(23, 59, 59, 999);
    }

    // Construcción dinámica del filtro de fecha
    const dateFilter: any = {};
    if (from && to) {
        dateFilter.createdAt = { gte: from, lte: to };
        dateFilter.date = { gte: from, lte: to };
    } else if (from) {
        dateFilter.createdAt = { gte: from };
        dateFilter.date = { gte: from };
    } else if (to) {
        dateFilter.createdAt = { lte: to };
        dateFilter.date = { lte: to };
    }

    const [sales, products, users] = await Promise.all([
        // Reporte Ventas
        prisma.sale.findMany({
            where: from || to ? { date: dateFilter.date } : {},
            orderBy: { date: 'desc' }
        }),
        // Reporte Inventario (Filtrado por creación)
        prisma.product.findMany({
            where: from || to ? { createdAt: dateFilter.createdAt } : {},
            orderBy: { createdAt: 'desc' }
        }),
        // Reporte Usuarios
        prisma.user.findMany({
            where: from || to ? { createdAt: dateFilter.createdAt } : {},
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    // Mapeo de datos para exportación Excel
    const salesData = sales.map(s => ({
        ID: s.id,
        Fecha: s.date.toLocaleDateString(),
        Cliente: s.customerName,
        Email: s.customerEmail,
        Categoría: s.category,
        Región: s.region || "N/A",
        Total: s.amount,
        Estado: s.status
    }));

    const productsData = products.map(p => ({
        ID: p.id,
        Producto: p.name,
        Categoría: p.category,
        Precio: p.price,
        Stock_Actual: p.stock,
        Estado: p.status,
        Fecha_Creación: p.createdAt.toLocaleDateString()
    }));

    const usersData = users.map(u => ({
        ID: u.id,
        Nombre: u.name,
        Email: u.email,
        Rol: u.role,
        Fecha_Registro: u.createdAt.toLocaleDateString()
    }));

    const totalSalesAmount = sales.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Centro de Reportes</h2>
                <p className="text-slate-500">Genera y descarga informes detallados de todas las áreas.</p>
            </div>

            <ReportFilters />

            {(from || to) && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-blue-100">
                    <CalendarRange className="h-4 w-4" />
                    Mostrando resultados desde: <strong>{from ? from.toLocaleDateString() : 'Inicio'}</strong> hasta <strong>{to ? to.toLocaleDateString() : 'Hoy'}</strong>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card Reporte Ventas */}
                <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <CardTitle>Ventas y Transacciones</CardTitle>
                        </div>
                        <CardDescription>Registro completo de ingresos y movimientos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Total en periodo</p>
                            <p className="text-2xl font-bold text-slate-900">${totalSalesAmount.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">{sales.length} transacciones encontradas</p>
                        </div>
                        <ExportButton
                            data={salesData}
                            fileName={`Reporte_Ventas_${new Date().toISOString().split('T')[0]}.xlsx`}
                            label="Descargar Reporte Ventas"
                        />
                    </CardContent>
                </Card>

                {/* Card Reporte Inventario */}
                <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <CardTitle>Productos e Inventario</CardTitle>
                        </div>
                        <CardDescription>Estado del stock y productos registrados.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Productos listados</p>
                            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                            <p className="text-xs text-slate-500 mt-1">Items en catálogo</p>
                        </div>
                        <ExportButton
                            data={productsData}
                            fileName={`Reporte_Inventario_${new Date().toISOString().split('T')[0]}.xlsx`}
                            label="Descargar Inventario"
                        />
                    </CardContent>
                </Card>

                {/* Card Reporte Usuarios */}
                <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <Users className="h-6 w-6" />
                            </div>
                            <CardTitle>Usuarios del Sistema</CardTitle>
                        </div>
                        <CardDescription>Auditoría de personal y fechas de registro.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Usuarios activos</p>
                            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                            <p className="text-xs text-slate-500 mt-1">Registrados en el periodo</p>
                        </div>
                        <ExportButton
                            data={usersData}
                            fileName={`Reporte_Usuarios_${new Date().toISOString().split('T')[0]}.xlsx`}
                            label="Descargar Usuarios"
                        />
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}