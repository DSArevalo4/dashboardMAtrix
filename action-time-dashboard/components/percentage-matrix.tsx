"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkArea } from "@/lib/types"

interface PercentageMatrixProps {
  areas: WorkArea[]
}

export function PercentageMatrix({ areas }: PercentageMatrixProps) {
  const totalPercentage = areas.reduce((sum, a) => sum + a.percentage, 0)
  
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Matriz de Distribución</CardTitle>
          <span className={`text-sm font-medium ${totalPercentage === 100 ? 'text-primary' : 'text-destructive'}`}>
            Total: {totalPercentage}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Área</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">% Área</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actividad</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">% Actividad</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">% Real</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                area.activities.length > 0 ? (
                  area.activities.map((activity, actIndex) => (
                    <tr key={`${area.id}-${activity.id}`} className="border-b border-border/30">
                      {actIndex === 0 && (
                        <>
                          <td
                            rowSpan={area.activities.length}
                            className="px-4 py-3 font-medium"
                            style={{ color: area.color }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: area.color }}
                              />
                              {area.name}
                            </div>
                          </td>
                          <td
                            rowSpan={area.activities.length}
                            className="px-4 py-3 text-center font-bold"
                            style={{ color: area.color }}
                          >
                            {area.percentage}%
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 text-foreground/80">{activity.name}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {activity.percentage}%
                      </td>
                      <td className="px-4 py-3 text-center font-semibold" style={{ color: area.color }}>
                        {((area.percentage * activity.percentage) / 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={area.id} className="border-b border-border/30">
                    <td className="px-4 py-3 font-medium" style={{ color: area.color }}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: area.color }}
                        />
                        {area.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold" style={{ color: area.color }}>
                      {area.percentage}%
                    </td>
                    <td colSpan={3} className="px-4 py-3 text-center text-muted-foreground italic">
                      Sin actividades
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {areas.map((area) => {
            const realTotal = area.activities.reduce(
              (sum, act) => sum + (area.percentage * act.percentage) / 100,
              0
            )
            return (
              <div
                key={area.id}
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: `${area.color}15` }}
              >
                <div className="text-xs text-muted-foreground">{area.name}</div>
                <div className="mt-1 text-xl font-bold" style={{ color: area.color }}>
                  {area.activities.length > 0 ? `${realTotal.toFixed(1)}%` : `${area.percentage}%`}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
