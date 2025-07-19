"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { month: "Jan", revenue: 8400 },
  { month: "Feb", revenue: 9200 },
  { month: "Mar", revenue: 7800 },
  { month: "Apr", revenue: 10500 },
  { month: "May", revenue: 11200 },
  { month: "Jun", revenue: 12450 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
        <YAxis axisLine={false} tickLine={false} className="text-xs" tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value) => [`$${value}`, "Revenue"]}
          labelStyle={{ color: "#374151" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
