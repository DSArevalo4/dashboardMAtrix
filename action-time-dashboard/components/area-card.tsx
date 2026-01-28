"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { WorkArea, Activity } from "@/lib/types"

interface AreaCardProps {
  area: WorkArea
  onPercentageChange: (id: string, percentage: number) => void
  onActivityAdd: (areaId: string, activity: Activity) => void
  onActivityRemove: (areaId: string, activityId: string) => void
  onActivityChange: (areaId: string, activityId: string, updates: Partial<Activity>) => void
}

export function AreaCard({
  area,
  onPercentageChange,
  onActivityAdd,
  onActivityRemove,
  onActivityChange,
}: AreaCardProps) {
  const [newActivityName, setNewActivityName] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      const remainingPercentage = 100 - area.activities.reduce((sum, a) => sum + a.percentage, 0)
      onActivityAdd(area.id, {
        id: crypto.randomUUID(),
        name: newActivityName.trim(),
        percentage: Math.min(remainingPercentage, 25),
      })
      setNewActivityName("")
    }
  }

  const totalActivityPercentage = area.activities.reduce((sum, a) => sum + a.percentage, 0)

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: area.color }}
            />
            <CardTitle className="text-lg font-semibold">{area.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Porcentaje del tiempo total</span>
            <span className="text-2xl font-bold" style={{ color: area.color }}>
              {area.percentage}%
            </span>
          </div>
          <Slider
            value={[area.percentage]}
            onValueChange={([value]) => onPercentageChange(area.id, value)}
            max={100}
            step={1}
            className="[&_[role=slider]]:border-2"
            style={{
              // @ts-expect-error CSS custom properties
              '--slider-track-background': `${area.color}20`,
              '--slider-range-background': area.color,
            }}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Nueva actividad..."
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddActivity()}
              className="flex-1 bg-secondary/50"
            />
            <Button
              onClick={handleAddActivity}
              size="sm"
              variant="secondary"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {area.activities.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Actividades</span>
                <span className={totalActivityPercentage === 100 ? "text-primary" : "text-muted-foreground"}>
                  Total: {totalActivityPercentage}%
                </span>
              </div>
              
              {area.activities.map((activity) => (
                <div key={activity.id} className="space-y-2 rounded-lg bg-secondary/30 p-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={activity.name}
                      onChange={(e) =>
                        onActivityChange(area.id, activity.id, { name: e.target.value })
                      }
                      className="h-8 flex-1 border-0 bg-transparent px-0 text-sm font-medium focus-visible:ring-0"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: area.color }}>
                        {activity.percentage}%
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onActivityRemove(area.id, activity.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[activity.percentage]}
                    onValueChange={([value]) =>
                      onActivityChange(area.id, activity.id, { percentage: value })
                    }
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                  />
                </div>
              ))}
            </div>
          )}

          {area.activities.length === 0 && (
            <div className="rounded-lg border border-dashed border-border/50 p-4 text-center text-sm text-muted-foreground">
              Agrega actividades para esta area
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
