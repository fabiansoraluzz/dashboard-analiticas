import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { OverviewChart } from "@/components/overview-chart";
// Asumimos que OverviewChart es flexible o creas uno similar llamado 'ComparisonChart'

export default async function AnalyticsPage() {
    // Datos simulados avanzados (en producción harías groupBys complejos)
    const regionData = [
        { name: "Norte", total: 4500 }, { name: "Sur", total: 3200 },
        { name: "Este", total: 2100 }, { name: "Oeste", total: 5100 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analíticas Avanzadas</h2>
                <select className="border rounded-md p-2 text-sm bg-white">
                    <option>Últimos 30 días</option>
                    <option>Este Año</option>
                </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-2xl shadow-sm border-none">
                    <CardHeader><CardTitle>Ventas por Región</CardTitle></CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            {/* Reutilizamos el chart existente o crea uno de Barras */}
                            <OverviewChart data={regionData} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm border-none">
                    <CardHeader><CardTitle>Tasa de Conversión</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                        <div className="text-center space-y-2">
                            <span className="text-6xl font-bold text-blue-600">4.2%</span>
                            <p className="text-slate-500">De visitantes a compradores</p>
                            <div className="w-full bg-slate-100 h-4 rounded-full mt-4 overflow-hidden">
                                <div className="bg-blue-600 h-full w-[42%]"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}