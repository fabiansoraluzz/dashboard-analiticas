"use client"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6366f1'];

export function DonutChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}