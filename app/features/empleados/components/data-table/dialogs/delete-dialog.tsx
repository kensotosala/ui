"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Empleado } from "../../../types";

interface EmpleadoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  isDeleting: boolean;
  onConfirm: (id: number) => void;
}

export function EmpleadoDeleteDialog({
  open,
  onOpenChange,
  empleado,
  isDeleting,
  onConfirm,
}: EmpleadoDeleteDialogProps) {
  if (!empleado) return null;

  const nombreCompleto = [
    empleado.nombre,
    empleado.primerApellido,
    empleado.segundoApellido,
  ]
    .filter(Boolean)
    .join(" ");

  const handleConfirm = () => {
    if (empleado.idEmpleado !== undefined) {
      onConfirm(empleado.idEmpleado);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Empleado</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar este empleado? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <span className="font-medium">Nombre:</span> {nombreCompleto}
            </p>
            <p className="text-sm">
              <span className="font-medium">Código:</span>{" "}
              {empleado.codigoEmpleado}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {empleado.email}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
