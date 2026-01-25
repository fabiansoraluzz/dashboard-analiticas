import { OverviewChart } from "@/components/overview-chart";
import { DonutChart } from "@/components/donut-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { NewSaleDialog } from "@/components/new-sale-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Package, Calendar } from "lucide-react";
// ELIMINADO: import { Search } from "@/components/search";

// --- LÓGICA DE DATOS ---
async function getDashboardData(query?: string) {
  const salesWhere: any = { status: 'completed' };
  const productsWhere: any = { status: 'active' };

  // El filtro sigue funcionando porque lee la URL global
  if (query) {
    salesWhere['OR'] = [
      { customerName: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
    ];

    productsWhere['OR'] = [
      { name: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }
    ];
  }

  const [sales, products] = await Promise.all([
    prisma.sale.findMany({
      where: salesWhere,
      orderBy: { date: 'desc' }
    }),
    prisma.product.findMany({
      where: productsWhere
    })
  ]);

  const totalAmount = sales.reduce((acc, curr) => acc + curr.amount, 0);

  // Comparativa Mes Actual vs Mes Anterior
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let currentMonthTotal = 0;
  let lastMonthTotal = 0;
  const monthlyData: Record<string, number> = {};

  sales.forEach(sale => {
    const d = new Date(sale.date);

    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      currentMonthTotal += sale.amount;
    } else if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) {
      lastMonthTotal += sale.amount;
    }

    const monthKey = d.toLocaleString('es-ES', { month: 'short' });
    const formattedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
    if (!monthlyData[formattedMonth]) monthlyData[formattedMonth] = 0;
    monthlyData[formattedMonth] += sale.amount;
  });

  let percentageChange = 0;
  if (lastMonthTotal > 0) {
    percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  } else if (currentMonthTotal > 0) {
    percentageChange = 100;
  }

  const categoryCount: Record<string, number> = {};
  products.forEach(p => {
    if (!categoryCount[p.category]) categoryCount[p.category] = 0;
    categoryCount[p.category] += 1;
  });

  const lineChartData = Object.keys(monthlyData).map(month => ({
    name: month,
    total: Math.floor(monthlyData[month])
  }));

  const donutData = Object.keys(categoryCount)
    .map(cat => ({ name: cat, value: categoryCount[cat] }))
    .sort((a, b) => b.value - a.value);

  const recentSales = sales.slice(0, 5);

  return {
    lineChartData,
    donutData,
    recentSales,
    totalAmount,
    percentageChange,
    productsCount: products.length
  };
}

// --- VISTA DASHBOARD ---
export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams;
  const query = params.q || "";

  const data = await getDashboardData(query);

  const productsList = await prisma.product.findMany({
    select: { id: true, name: true, price: true, stock: true },
    where: { status: 'active' }
  });

  // Fecha Actual
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">

      {/* HEADER DE PÁGINA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {query ? (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Resultados para: &quot;{query}&quot;
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* ACCIONES PRINCIPALES (Solo el botón de Nueva Venta) */}
        <div className="w-full md:w-auto">
          <NewSaleDialog products={productsList} />
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* 1. VENTAS TOTALES */}
        <Card className="col-span-1 md:col-span-8 rounded-2xl shadow-sm border-none bg-white dark:bg-slate-900 dark:border dark:border-slate-800 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-base font-medium text-slate-500 dark:text-slate-400">Ventas Totales</CardTitle>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  ${data.totalAmount.toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                </p>
                <span className="text-xs font-medium text-slate-400">USD</span>
              </div>
            </div>
            <div className={`px-2 py-1 md:px-3 text-[10px] md:text-xs font-bold rounded-full flex items-center gap-1 shrink-0 ${data.percentageChange >= 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
              {data.percentageChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(data.percentageChange).toFixed(1)}% <span className="hidden sm:inline">vs mes anterior</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full min-w-0 h-[300px]">
              <OverviewChart data={data.lineChartData} />
            </div>
          </CardContent>
        </Card>

        {/* 2. INVENTARIO */}
        <Card className="col-span-1 md:col-span-4 rounded-2xl shadow-sm border-none bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Inventario</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">Productos por categoría</p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full flex items-center justify-center relative">
              {data.donutData.length > 0 ? (
                <div className="w-full h-full">
                  <DonutChart data={data.donutData} />
                </div>
              ) : (
                <div className="text-slate-400 text-sm flex flex-col items-center justify-center h-full">
                  <Package className="h-8 w-8 mb-2 opacity-50" />
                  <p>Sin stock</p>
                </div>
              )}
              {data.donutData.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-800 dark:text-white">{data.productsCount}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Items</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {data.donutData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-indigo-500'][idx % 4]}`} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. CATEGORÍAS POPULARES */}
        <Card className="col-span-1 md:col-span-7 rounded-2xl shadow-sm border-none bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Categorías Populares</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">Basado en volumen de stock</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.donutData.slice(0, 5).map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none">{item.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">{item.value} prods</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((item.value / (data.donutData[0]?.value || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {data.donutData.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-slate-400 text-sm">No hay datos suficientes.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. TRANSACCIONES RECIENTES */}
        <Card className="col-span-1 md:col-span-5 rounded-2xl shadow-sm border-none bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6 mt-2">
              {data.recentSales.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No hay ventas recientes.</p>
              ) : (
                data.recentSales.map((sale: any) => (
                  <div key={sale.id || Math.random()} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2.5 rounded-xl transition-colors -mx-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-slate-100 dark:border-slate-700 shrink-0">
                        <AvatarFallback className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800">
                          {sale.customerName?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none mb-1.5 truncate pr-2">
                          {sale.customerName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {new Date(sale.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-emerald-400 shrink-0 ml-2">
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