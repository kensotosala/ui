"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Empleado } from "../../../types";
import { usePuestos } from "@/app/features/puestos/hooks/usePuestos";
import { useDepartamentos } from "@/app/features/departamentos/hooks/useDepartamentos";

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
  const { puestos } = usePuestos();
  const { departamentos } = useDepartamentos();

  if (!empleado) return null;

  const nombreCompleto = [
    empleado.nombre,
    empleado.primerApellido,
    empleado.segundoApellido,
  ]
    .filter(Boolean)
    .join(" ");

  // Buscar el nombre del departamento
  const departamento = departamentos.find(
    (dep) => dep.idDepartamento === empleado.departamentoId
  );
  const nombreDepartamento = departamento?.nombreDepartamento ?? "No asignado";

  // Buscar el nombre del puesto
  const puesto = puestos.find((p) => p.idPuesto === empleado.puestoId);
  const nombrePuesto = puesto?.nombrePuesto ?? "No asignado";

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
              <p className="font-medium">{empleado.idEmpleado ?? "-"}</p>
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
              <p className="text-muted-foreground">Departamento</p>
              <p>{nombreDepartamento}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Puesto</p>
              <p>{nombrePuesto}</p>
            </div>

            {/* <div>
              <p className="text-muted-foreground">Jefe inmediato</p>
              <p>{empleado.jefeInmediatoId ?? "-"}</p>
            </div> */}

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
