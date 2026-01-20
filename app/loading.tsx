import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>
                <Skeleton className="h-10 w-[140px]" />
            </div>

            {/* Grid Skeleton (Imita tu Dashboard) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Chart Grande */}
                <Card className="md:col-span-8 rounded-2xl border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-[180px]" />
                        </div>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </CardContent>
                </Card>

                {/* Chart Donut */}
                <Card className="md:col-span-4 rounded-2xl border-none shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-[120px]" />
                        <Skeleton className="h-3 w-[100px] mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center">
                            <Skeleton className="h-[200px] w-[200px] rounded-full" />
                        </div>
                        <div className="mt-4 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Categorías (Barras) */}
                <Card className="md:col-span-7 rounded-2xl border-none shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[40px]" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Lista Recientes */}
                <Card className="md:col-span-5 rounded-2xl border-none shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px]" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[120px]" />
                                        <Skeleton className="h-3 w-[80px]" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-[50px]" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}