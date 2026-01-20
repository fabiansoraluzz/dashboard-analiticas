"use client"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

export function OverviewChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}