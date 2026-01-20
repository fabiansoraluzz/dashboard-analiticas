import { OverviewChart } from "@/components/overview-chart";
import { DonutChart } from "@/components/donut-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ExportButton } from "@/components/export-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- LÓGICA DE DATOS (SERVER SIDE) ---
async function getDashboardData(query?: string) {

  const whereClause: any = {
    status: 'completed',
  };

  if (query) {
    whereClause['OR'] = [
      { customerName: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
    ];
  }

  const sales = await prisma.sale.findMany({
    where: whereClause,
    select: { date: true, amount: true, category: true, customerName: true, customerEmail: true },
    orderBy: { date: 'desc' }
  });

  const monthlyData: Record<string, number> = {};

  sales.forEach(sale => {
    const month = sale.date.toLocaleString('es-ES', { month: 'short' });
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    if (!monthlyData[formattedMonth]) monthlyData[formattedMonth] = 0;
    monthlyData[formattedMonth] += sale.amount;
  });

  const lineChartData = Object.keys(monthlyData).map(month => ({
    name: month,
    total: Math.floor(monthlyData[month])
  }));

  const categoryCount: Record<string, number> = {};

  sales.forEach(sale => {
    if (!categoryCount[sale.category]) categoryCount[sale.category] = 0;
    categoryCount[sale.category] += 1;
  });

  const donutData = Object.keys(categoryCount)
    .map(cat => ({
      name: cat,
      value: categoryCount[cat]
    }))
    .sort((a, b) => b.value - a.value);

  const recentSales = sales.slice(0, 5);
  const totalAmount = sales.reduce((acc, curr) => acc + curr.amount, 0);

  const exportData = sales.map(s => ({
    Fecha: s.date.toLocaleDateString(),
    Cliente: s.customerName,
    Email: s.customerEmail,
    Categoría: s.category,
    Monto: s.amount
  }));

  return { lineChartData, donutData, recentSales, totalAmount, exportData };
}

// --- VISTA PRINCIPAL CORREGIDA ---
export default async function DashboardPage({
  searchParams
}: {
  // 1. CAMBIO AQUÍ: Definimos searchParams como una Promesa
  searchParams: Promise<{ q?: string }>
}) {
  // 2. CAMBIO AQUÍ: Esperamos (await) a que se resuelva la promesa antes de leer
  const params = await searchParams;
  const query = params.q || "";

  const data = await getDashboardData(query);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Analytics Overview
          </h2>
          <p className="text-sm md:text-base text-slate-500">
            {query
              ? `Mostrando resultados para: "${query}"`
              : "Resumen financiero y métricas clave en tiempo real."}
          </p>
        </div>
        <ExportButton data={data.exportData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* GRÁFICO TENDENCIA */}
        <Card className="col-span-1 md:col-span-8 rounded-2xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-medium text-slate-500">Ventas Totales</CardTitle>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                  ${data.totalAmount.toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                </p>
                <span className="text-xs font-medium text-slate-400">USD</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              ↑ 20.8%
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px] w-full min-w-0">
              <OverviewChart data={data.lineChartData} />
            </div>
          </CardContent>
        </Card>

        {/* GRÁFICO DISTRIBUCIÓN */}
        <Card className="col-span-1 md:col-span-4 rounded-2xl shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Distribución</CardTitle>
            <p className="text-xs text-slate-500">Por categoría</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center relative">
              {data.donutData.length > 0 ? (
                <DonutChart data={data.donutData} />
              ) : (
                <div className="text-slate-400 text-sm">Sin datos</div>
              )}
              {data.donutData.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-800">100%</span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {data.donutData.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-indigo-500'][idx % 4]}`} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TOP CATEGORÍAS */}
        <Card className="col-span-1 md:col-span-7 rounded-2xl shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {data.donutData.slice(0, 5).map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-500 font-medium">{item.value} ventas</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((item.value / (data.donutData[0]?.value || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* VENTAS RECIENTES */}
        <Card className="col-span-1 md:col-span-5 rounded-2xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6 mt-2">
              {data.recentSales.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No se encontraron resultados.</p>
              ) : (
                data.recentSales.map((sale: any) => (
                  <div key={sale.id || Math.random()} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-slate-100 shrink-0">
                        <AvatarFallback className="text-xs md:text-sm font-bold text-slate-600 bg-white">
                          {sale.customerName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 leading-none mb-1 truncate">
                          {sale.customerName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {new Date(sale.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 shrink-0 ml-2">
                      +${sale.amount.toFixed(0)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}