"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderOpen, Trash2, Calendar } from "lucide-react"
import { Snapshot } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LoadSnapshotDialogProps {
  onLoad: (snapshot: Snapshot) => void
  onDelete: (id: string) => void
  snapshots: Snapshot[]
}

export function LoadSnapshotDialog({ onLoad, onDelete, snapshots }: LoadSnapshotDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleLoad = (snapshot: Snapshot) => {
    onLoad(snapshot)
    setOpen(false)
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FolderOpen className="mr-2 h-4 w-4" />
            Cargar Snapshot
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Cargar Snapshot</DialogTitle>
            <DialogDescription>
              Selecciona un snapshot guardado para cargar su configuración.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {snapshots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  No hay snapshots guardados
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Guarda tu primera configuración usando el botón "Guardar Snapshot"
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="group flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleLoad(snapshot)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{snapshot.name}</h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(snapshot.createdAt)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(snapshot.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar snapshot?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El snapshot será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
