import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IncapacidadDeleteDialogProps } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { AlertTriangle } from "lucide-react";

export function IncapacidadDeleteDialog({
  open,
  onOpenChange,
  incapacidad,
  isDeleting,
  onConfirm,
}: IncapacidadDeleteDialogProps) {
  const { empleados } = useEmpleados();

  if (!incapacidad) return null;

  const empleado = empleados.find(
    (e) => e.idEmpleado === incapacidad.empleadoId,
  );

  const handleConfirm = async () => {
    await onConfirm(incapacidad.idIncapacidad); // Usar idIncapacidad del backend
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Eliminar Incapacidad</DialogTitle>
          </div>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            registro de incapacidad.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <p className="text-sm">
            <span className="font-medium">Empleado: </span>
            {empleado
              ? `${empleado.nombre} ${empleado.primerApellido} ${empleado.segundoApellido || ""}`
              : "No encontrado"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Tipo: </span>
            {incapacidad.tipoIncapacidad}
          </p>
          <p className="text-sm">
            <span className="font-medium">Estado: </span>
            {incapacidad.estado}
          </p>
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
