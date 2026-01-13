"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Empleado } from "../../../types";

interface EmpleadoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  onConfirm: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function EmpleadoDeleteDialog({
  open,
  onOpenChange,
  empleado,
  onConfirm,
  isDeleting = false,
}: EmpleadoDeleteDialogProps) {
  if (!empleado || !empleado.id) return null;

  const handleDelete = async () => {
    await onConfirm(empleado.id!);
    onOpenChange(false);
  };

  const nombreCompleto = [
    empleado.nombre,
    empleado.primerApellido,
    empleado.segundoApellido,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar empleado</DialogTitle>

          <DialogDescription className="space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar al empleado{" "}
              <span className="font-medium">{nombreCompleto}</span>?
            </p>
            <p className="text-sm text-red-500">
              Esta acción no se puede deshacer.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
