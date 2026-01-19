import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

// Inicializar cliente (Solo se ejecuta en el servidor)
const prisma = new PrismaClient();

// Función para obtener los datos de la BD
async function getDashboardData() {
  // 1. Calcular Ingresos Totales (Suma de amount)
  const totalSales = await prisma.sale.aggregate({
    _sum: { amount: true },
    where: { status: 'completed' }
  });

  // 2. Contar Ventas Totales
  const salesCount = await prisma.sale.count({
    where: { status: 'completed' }
  });

  // 3. Contar Usuarios Únicos (Simulado agrupando por email)
  const uniqueCustomers = await prisma.sale.groupBy({
    by: ['customerEmail'],
  });

  // 4. Obtener ventas recientes para la lista
  const recentSales = await prisma.sale.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    where: { status: 'completed' }
  });

  return {
    revenue: totalSales._sum.amount || 0,
    sales: salesCount,
    customers: uniqueCustomers.length,
    recentSales: recentSales
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <div className="text-sm text-slate-500">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* SECCIÓN 1: TARJETAS DE KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* KPI: Ingresos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <span className="text-emerald-500 font-bold">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.revenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% mes pasado</p>
          </CardContent>
        </Card>

        {/* KPI: Clientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <span className="text-blue-500">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.customers}</div>
            <p className="text-xs text-muted-foreground">+180 nuevos</p>
          </CardContent>
        </Card>

        {/* KPI: Ventas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Realizadas</CardTitle>
            <span className="text-orange-500">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.sales}</div>
            <p className="text-xs text-muted-foreground">+19% mes pasado</p>
          </CardContent>
        </Card>

        {/* KPI: Activos (Hardcoded para demo) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos Ahora</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 última hora</p>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 2: GRÁFICOS Y TABLAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">

        {/* Gráfico Principal (Placeholder Visual) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen General</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-slate-400 border-2 border-dashed rounded-lg">
              [Aquí irá el Gráfico de Recharts]
            </div>
          </CardContent>
        </Card>

        {/* Lista de Ventas Recientes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data.recentSales.map((sale: any) => (
                <div key={sale.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                    <p className="text-xs text-muted-foreground">{sale.customerEmail}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    +${sale.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}