"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkArea } from "@/lib/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface OverviewChartProps {
  areas: WorkArea[]
}

export function OverviewChart({ areas }: OverviewChartProps) {
  const totalPercentage = areas.reduce((sum, a) => sum + a.percentage, 0)
  
  const data = areas.map((area) => ({
    name: area.name,
    value: area.percentage,
    color: area.color,
  }))

  // Add remaining percentage if not 100%
  if (totalPercentage < 100) {
    data.push({
      name: "Sin asignar",
      value: 100 - totalPercentage,
      color: "#333344",
    })
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribución General</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {areas.map((area) => (
            <div
              key={area.id}
              className="flex items-center justify-between rounded-md px-3 py-2"
              style={{ backgroundColor: `${area.color}10` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: area.color }}
                />
                <span className="text-xs text-muted-foreground">{area.name}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: area.color }}>
                {area.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
