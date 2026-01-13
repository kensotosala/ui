"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Empleado } from "../../../types";

interface EmpleadoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
}

export function EmpleadoDetailsDialog({
  open,
  onOpenChange,
  empleado,
}: EmpleadoDetailsDialogProps) {
  if (!empleado) return null;

  const nombreCompleto = [
    empleado.nombre,
    empleado.primerApellido,
    empleado.segundoApellido,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalle del Empleado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-medium">{empleado.id ?? "-"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Estado</p>
              <Badge
                variant={empleado.estado === "ACTIVO" ? "default" : "secondary"}
              >
                {empleado.estado ?? "-"}
              </Badge>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Nombre completo</p>
              <p className="font-medium">{nombreCompleto}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Código</p>
              <p>{empleado.codigoEmpleado}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{empleado.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Teléfono</p>
              <p>{empleado.telefono}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Departamento ID</p>
              <p>{empleado.departamentoId}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Puesto ID</p>
              <p>{empleado.puestoId}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Jefe inmediato</p>
              <p>{empleado.jefeInmediatoId ?? "-"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Fecha de contratación</p>
              <p>
                {empleado.fechaContratacion
                  ? new Date(empleado.fechaContratacion).toLocaleDateString(
                      "es-ES"
                    )
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Salario base</p>
              <p>{empleado.salarioBase}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Tipo de contrato</p>
              <p>{empleado.tipoContrato}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
