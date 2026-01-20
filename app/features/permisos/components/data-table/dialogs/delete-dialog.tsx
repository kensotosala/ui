"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Permiso } from "../../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PermisoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permiso: Permiso | null;
  isDeleting: boolean;
  onConfirm: (id: number) => Promise<void>;
}

export function PermisoDeleteDialog({
  open,
  onOpenChange,
  permiso,
  isDeleting,
  onConfirm,
}: PermisoDeleteDialogProps) {
  if (!permiso) return null;

  const handleConfirm = async () => {
    await onConfirm(permiso.idPermiso);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la solicitud de permiso.
            </p>

            {/* Información del permiso a eliminar */}
            <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">ID:</span>
                <span className="text-foreground">#{permiso.idPermiso}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Empleado:</span>
                <span className="text-foreground">#{permiso.empleadoId}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-foreground">
                  Fecha del Permiso:
                </span>
                <span className="text-foreground">
                  {format(new Date(permiso.fechaPermiso), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Estado:</span>
                <Badge variant="outline">
                  {permiso.estadoSolicitud || "PENDIENTE"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Motivo:</span>
                <span className="text-foreground text-right max-w-50 truncate">
                  {permiso.motivo}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
