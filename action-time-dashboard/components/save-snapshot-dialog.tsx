"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

interface SaveSnapshotDialogProps {
  onSave: (name: string) => void
  isSaving?: boolean
}

export function SaveSnapshotDialog({ onSave, isSaving }: SaveSnapshotDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      setName("")
      setOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      handleSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar Snapshot"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Guardar Snapshot</DialogTitle>
          <DialogDescription>
            Dale un nombre a este snapshot para poder cargarlo más tarde.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Snapshot</Label>
            <Input
              id="name"
              placeholder="ej: Distribución Enero 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
