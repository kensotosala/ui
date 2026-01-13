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
import {
  AlertTriangle,
  User,
  AlertCircle,
  Shield,
  Briefcase,
} from "lucide-react";
import { Empleado } from "../../../types";

interface EmpleadoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  onConfirm: (id: number) => Promise<void>;
  isDeleting?: boolean;
  tieneRegistrosAsociados?: boolean;
  registrosAsociados?: string[]; // Ej: ["Asistencias", "Permisos", "Evaluaciones"]
}

export function EmpleadoDeleteDialog({
  open,
  onOpenChange,
  empleado,
  onConfirm,
  isDeleting = false,
  tieneRegistrosAsociados = false,
  registrosAsociados = [],
}: EmpleadoDeleteDialogProps) {
  if (!empleado) return null;

  const nombreCompleto = `${empleado.nombre} ${empleado.primerApellido}${
    empleado.segundoApellido ? ` ${empleado.segundoApellido}` : ""
  }`;

  const handleDelete = async () => {
    await onConfirm(empleado.id || 0);
    onOpenChange(false);
  };

  const getImpactMessage = () => {
    if (tieneRegistrosAsociados) {
      return `Este empleado tiene ${
        registrosAsociados.length > 0
          ? registrosAsociados.join(", ")
          : "registros"
      } asociados.`;
    }
    return "Este empleado no tiene registros asociados.";
  };

  const getRecomendacion = () => {
    if (empleado.estado === "ACTIVO") {
      return "Se recomienda desactivar al empleado en lugar de eliminarlo, para mantener un historial completo.";
    }
    if (tieneRegistrosAsociados) {
      return "Considera desactivar al empleado para preservar los registros históricos.";
    }
    return "Esta acción es permanente y eliminará toda la información del empleado.";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-600 text-xl">
                Eliminar Empleado
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Acción crítica del sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del empleado */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-200 p-2">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {nombreCompleto}
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Código:</span>
                    <span className="font-medium">
                      {empleado.codigoEmpleado}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Estado:</span>
                    <span
                      className={`font-medium ${
                        empleado.estado === "ACTIVO"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {empleado.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Puesto:</span>
                    <Briefcase className="h-3 w-3 text-gray-400" />
                    <span className="font-medium">ID: {empleado.puestoId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Contrato:</span>
                    <span className="font-medium capitalize">
                      {empleado.tipoContrato.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advertencia principal */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">
                  ¿Estás seguro de que deseas eliminar permanentemente a este
                  empleado?
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Esta acción eliminará toda la información del empleado del
                  sistema y no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {/* Impacto y recomendaciones */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">
                  Impacto en el sistema:
                </p>
                <ul className="text-sm text-gray-600 mt-1 space-y-1 list-disc list-inside">
                  <li>{getImpactMessage()}</li>
                  <li>
                    Todos los datos personales y laborales serán eliminados
                    permanentemente
                  </li>
                  <li>El código de empleado no podrá ser reutilizado</li>
                  <li>
                    No se podrán generar reportes históricos que incluyan a este
                    empleado
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Recomendación:</span>{" "}
                {getRecomendacion()}
              </p>
            </div>

            {/* Confirmación adicional para empleados activos */}
            {empleado.estado === "ACTIVO" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ Este empleado está actualmente{" "}
                  <span className="font-bold">ACTIVO</span> en el sistema.
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  ¿Estás seguro de que deseas eliminar a un empleado activo?
                  Considera desactivarlo primero.
                </p>
              </div>
            )}
          </div>

          {/* Advertencia final */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 text-center">
              Esta operación está registrada en los logs del sistema y requiere
              aprobación de auditoría.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center sm:justify-end gap-3 border-t pt-6">
          <div className="text-sm text-gray-500 sm:hidden">
            Acción irreversible
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="min-w-25"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="min-w-30"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Eliminar Permanentemente
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Versión simplificada (compatible con el patrón de departamentos)
export function EmpleadoDeleteDialogSimple({
  open,
  onOpenChange,
  empleado,
  onConfirm,
  isDeleting = false,
}: EmpleadoDeleteDialogProps) {
  if (!empleado) return null;

  const handleDelete = async () => {
    await onConfirm(empleado.id || 0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar empleado</DialogTitle>

          <DialogDescription className="space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar al empleado{" "}
              <span className="font-medium">
                {empleado.nombre} {empleado.primerApellido}
              </span>
              ?
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
