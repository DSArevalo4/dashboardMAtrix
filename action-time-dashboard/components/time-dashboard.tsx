"use client"

import { useState, useEffect } from "react"
import { AreaCard } from "./area-card"
import { PercentageMatrix } from "./percentage-matrix"
import { OverviewChart } from "./overview-chart"
import type { WorkArea, Activity } from "@/lib/types"
import { Clock, LayoutGrid, Table2, Save, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const AREA_COLORS = {
  cic: "#22c55e",
  admin: "#3b82f6",
  soporte: "#f97316",
  implementacion: "#a855f7",
}

const initialAreas: WorkArea[] = [
  {
    id: "cic",
    name: "CIC",
    percentage: 25,
    color: AREA_COLORS.cic,
    activities: [],
  },
  {
    id: "admin",
    name: "Administración",
    percentage: 25,
    color: AREA_COLORS.admin,
    activities: [],
  },
  {
    id: "soporte",
    name: "Soporte",
    percentage: 25,
    color: AREA_COLORS.soporte,
    activities: [],
  },
  {
    id: "implementacion",
    name: "Implementación",
    percentage: 25,
    color: AREA_COLORS.implementacion,
    activities: [],
  },
]

export function TimeDashboard() {
  const [areas, setAreas] = useState<WorkArea[]>(initialAreas)
  const [view, setView] = useState<"grid" | "matrix">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveData()
      }, 2000) // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timeoutId)
    }
  }, [areas, isLoading])

  const loadData = async () => {
    try {
      const response = await fetch('/api/areas')
      const data = await response.json()
      
      if (data.areas && data.areas.length > 0) {
        setAreas(data.areas)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ areas }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast({
        title: "Guardado",
        description: "Datos guardados automáticamente",
      })
    } catch (error) {
      console.error('Error saving data:', error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los datos",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = async () => {
    await saveData()
  }

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generando PDF",
        description: "Por favor espera...",
      })

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ areas }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-tiempo-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "PDF Generado",
        description: "El reporte ha sido descargado",
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive"
      })
    }
  }

  const handlePercentageChange = (id: string, percentage: number) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === id ? { ...area, percentage } : area
      )
    )
  }

  const handleActivityAdd = (areaId: string, activity: Activity) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? { ...area, activities: [...area.activities, activity] }
          : area
      )
    )
  }

  const handleActivityRemove = (areaId: string, activityId: string) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? {
              ...area,
              activities: area.activities.filter((a) => a.id !== activityId),
            }
          : area
      )
    )
  }

  const handleActivityChange = (
    areaId: string,
    activityId: string,
    updates: Partial<Activity>
  ) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? {
              ...area,
              activities: area.activities.map((a) =>
                a.id === activityId ? { ...a, ...updates } : a
              ),
            }
          : area
      )
    )
  }

  const totalPercentage = areas.reduce((sum, a) => sum + a.percentage, 0)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gestión de Tiempo</h1>
              <p className="text-sm text-muted-foreground">
                Organiza tu tiempo de acción por áreas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${
              totalPercentage === 100 
                ? 'bg-primary/10 text-primary' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {totalPercentage}% asignado
            </div>

            {isSaving && (
              <span className="text-sm text-muted-foreground">Guardando...</span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            
            <div className="flex rounded-lg border border-border/50 bg-secondary/30 p-1">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="h-8"
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Áreas
              </Button>
              <Button
                variant={view === "matrix" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("matrix")}
                className="h-8"
              >
                <Table2 className="mr-2 h-4 w-4" />
                Matriz
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {view === "grid" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Area Cards */}
            <div className="space-y-4 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {areas.map((area) => (
                  <AreaCard
                    key={area.id}
                    area={area}
                    onPercentageChange={handlePercentageChange}
                    onActivityAdd={handleActivityAdd}
                    onActivityRemove={handleActivityRemove}
                    onActivityChange={handleActivityChange}
                  />
                ))}
              </div>
            </div>

            {/* Overview Chart */}
            <div>
              <OverviewChart areas={areas} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <PercentageMatrix areas={areas} />
          </div>
        )}

        {/* Always show summary bar */}
        <div className="mt-6 rounded-lg border border-border/50 bg-card/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Distribución rápida
            </div>
            <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-secondary/50">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="transition-all duration-300"
                  style={{
                    width: `${area.percentage}%`,
                    backgroundColor: area.color,
                  }}
                  title={`${area.name}: ${area.percentage}%`}
                />
              ))}
            </div>
            <div className="flex gap-4">
              {areas.map((area) => (
                <div key={area.id} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {area.name}: {area.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
